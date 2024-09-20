const express = require('express');
const fs = require('fs');
const { type } = require('os');
const app = express();

app.use(express.json());

app.get('/get-matches', (req, res) => {
    fs.readFile('./matches.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).send('Error reading data');
        }
        res.json(JSON.parse(data));
    });
});

app.get('/get-reserved', (req, res) => {
    fs.readFile('./reserved.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).send('Error reading data');
        }
        
        data = JSON.parse(data);
        const result = {};

        // for (const [key, value] of Object.entries(data)) 
        for (const i in data){
            let totalMale = 0;
            let totalFemale = 0;
            let peoplelist = [];
            for (const j of data[i]){
                // let maskedName = j.name.slice(0, 1) + 'O' + j.name.slice(2);
                peoplelist.push({
                    name: j.name,
                    maleNames: j.maleNames,
                    femaleNames: j.femaleNames
                });
                totalFemale += j.femaleNames.length;
                totalMale += j.maleNames.length;
            }
            result[i] = {
                people_list: peoplelist,
                total_male: totalMale,
                total_female: totalFemale
            };
        }
        res.json(result);
    });
});

app.post('/cancel-reservation', (req, res) => {
    const updatedData = req.body;
    const filename = './reserved.json';
    
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).send('Error reading data');
        }

        let jsonLocal;
        try {
            jsonLocal = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON', parseErr);
            return res.status(500).send('Error parsing data');
        }

        const matchID = Object.keys(jsonLocal).findIndex(item_id => item_id === updatedData.id);
        if (matchID === -1) {
            return res.status(400).send('沒有該場次的預約資料');
        }
        const result = jsonLocal[updatedData.id].findIndex(item => item.name === updatedData.name);
        if (result === -1) {
            return res.status(400).send('尚未有您的預約資料');
        }
        else if (jsonLocal[updatedData.id][result].phone !== updatedData.phone) {
            return res.status(400).send('電話號碼不符合');
        }

        // delete the reservation
        jsonLocal[updatedData.id].splice(result, 1);

        fs.writeFile(filename, JSON.stringify(jsonLocal, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).send('Error saving data');
            }
            res.send('Data saved successfully');
        });
    });
});

// receive data which update from client
app.post('/update-matches', (req, res) => {
    const updatedData = req.body;
    
    fs.writeFile('./matches.json', JSON.stringify(updatedData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).send('Error saving data');
        }

        // 讀取 reserved.json
        fs.readFile('./reserved.json', 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading file', err);
                return res.status(500).send('Error reading data');
            }

            // 將 data 轉換為物件
            let jsonData;
            try {
                jsonData = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON', parseErr);
                return res.status(500).send('Error parsing data');
            }

            // 更新 jsonData
            updatedData.forEach(item => {
                const id = item.id;
                if (!jsonData.hasOwnProperty(id)){
                    jsonData[id] = [];
                }
            });


            // 寫入更新後的 reserved.json
            fs.writeFile('./reserved.json', JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                    return res.status(500).send('Error saving data');
                }

                // 在這裡發送回應
                res.send('Data saved successfully');
            });
        });
    });
});

app.post('/pickup', (req, res) => {
    const updatedData = req.body;
    
    fs.readFile('./matches.json', 'utf8', (err, matchesData) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).send('Error reading data');
        }

        let matches;
        try{
            matches = JSON.parse(matchesData);
        } catch (parseErr) {
            console.error('Error parsing JSON', parseErr);
            return res.status(500).send('Error parsing data');
        }
        
        const result = matches.find(item => item.id === updatedData.id);

        const filename = './reserved.json';
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file', err);
                return res.status(500).send('Error reading data');
            }

            let jsonLocal;
            try {
                jsonLocal = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON', parseErr);
                return res.status(500).send('Error parsing data');
            }

            // Calculate the current total reservations (male + female)
            const currentMale = jsonLocal[updatedData.id].reduce((sum, res) => sum + res.maleNames.length, 0) || 0;
            const currentFemale = jsonLocal[updatedData.id].reduce((sum, res) => sum + res.femaleNames.length, 0) || 0;

            const newTotal = currentMale + currentFemale + updatedData.maleNames.length + updatedData.femaleNames.length;

            // If new total exceeds total_people, return an error
            if (newTotal > result.total_people + result.ready_wait) {
                return res.status(400).send(`報名人數已滿,目前總報名人數: ${result.total_people}, 請重新整理頁面.`);
            }
            
            // 找到對應的 match id  jsonLocal='id':[]
            const matchID = Object.keys(jsonLocal).findIndex(item_id => item_id === updatedData.id);

            if (matchID === -1) {
                jsonLocal[updatedData.id] = [
                    {
                        name: updatedData.name,
                        maleNames: updatedData.maleNames,
                        femaleNames: updatedData.femaleNames,
                        phone: updatedData.phone
                    }
                ]
            } else {
                jsonLocal[updatedData.id].push({
                    name: updatedData.name,
                    maleNames: updatedData.maleNames,
                    femaleNames: updatedData.femaleNames,
                    phone: updatedData.phone
                });
            }
            
            fs.writeFile(filename, JSON.stringify(jsonLocal, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                    return res.status(500).send('Error saving data');
                }
                res.send('Data saved successfully');
            });
        });
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

