const express = require('express');
const fs = require('fs');
const cron = require('node-cron');
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
                // let maskedName = j.name.slice(0, 1) + 'O' + j.name.slice(2); // 如果要遮蔽名字
                peoplelist.push({
                    userID: j.userID,
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

app.post('/check-reservation', (req, res) => {
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
        const matchingNames = jsonLocal[updatedData.id].filter(item => item.name === updatedData.name);
        if (matchingNames.length === 0) {
            return res.status(400).send('尚未有您的預約資料');
        }

        // 檢查電話是否匹配
        const matchedRecord = matchingNames.find(item => item.phone === updatedData.phone);
        if (!matchedRecord) {
            return res.status(400).send('電話號碼不符合');
        }

        // 返回 userID
        res.send(matchedRecord.userID);
    });
});

app.post('/modify-reservation', (req, res) => {
    const updatedData = req.body;
    const matchFile = './matches.json';
    fs.readFile(matchFile, 'utf8', (err, matchesData) => {
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
        const now = new Date();
        const match = matches.find(item => item.id === updatedData.id);

        if (!match) {
            return res.status(404).send('Match not found');
        }
    
        const [matchMonth, matchDay] = match.date.split('/');
        // const [matchHour, matchMinute] = match.start_time.split(':');
        const [matchHour, matchMinute] = match.period.split('~')[0].split(':');
        
        // 創建比賽開始時間的 Date 對象
        const matchDateTime = new Date(now.getFullYear(), matchMonth - 1, matchDay, matchHour, matchMinute);
    
        // 計算時間差
        const timeDifference = matchDateTime - now;
    
        // 檢查是否小於24小時
        if (timeDifference < 24 * 60 * 60 * 1000) { // 小於24小時
            return res.status(400).send('小於24H不能更改預約資料');
        }
        else{
            const filename = './reserved.json';
            fs.readFile(filename, 'utf8', (err, data) => {
                let jsonLocal;
                try {
                    jsonLocal = JSON.parse(data);
                } catch (parseErr) {
                    console.error('Error parsing JSON', parseErr);
                    return res.status(500).send('Error parsing data');
                }
                const result = jsonLocal[updatedData.id].findIndex(item => item.userID === updatedData.userID);
                if (result === -1) {
                    return res.status(400).send('尚未有您的預約資料');
                }
                else {
                    if (updatedData.mode==='modify') {
                        jsonLocal[updatedData.id][result].maleNames = updatedData.maleNames;
                        jsonLocal[updatedData.id][result].femaleNames = updatedData.femaleNames;
                    }
                    else if (updatedData.mode==='delete') {
                        jsonLocal[updatedData.id].splice(result, 1);
                    }
                }
                fs.writeFile(filename, JSON.stringify(jsonLocal, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to file', err);
                        return res.status(500).send('Error saving data');
                    }
                    res.send('已更新預約');
                });
            });
        }
    });
});

// receive data which update from client
app.post('/update-matches', (req, res) => {
    const updatedData = req.body;

    // 更新 matches.json
    fs.writeFile('./matches.json', JSON.stringify(updatedData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to matches.json', err);
            return res.status(500).send('Error saving matches data');
        }

        // 讀取 reserved.json
        fs.readFile('./reserved.json', 'utf-8', (err, reservedData) => {
            if (err) {
                console.error('Error reading reserved.json', err);
                return res.status(500).send('Error reading reserved data');
            }

            // 將 reservedData 轉換為物件
            let reservedJson;
            try {
                reservedJson = JSON.parse(reservedData);
            } catch (parseErr) {
                console.error('Error parsing reserved.json', parseErr);
                return res.status(500).send('Error parsing reserved data');
            }

            // 獲取更新後的 matches 的所有 id
            const updatedIds = updatedData.map(item => item.id);

            // 遍歷 reserved.json，移除不在 updatedIds 中的 id
            for (const id in reservedJson) {
                if (!updatedIds.includes(id)) {
                    delete reservedJson[id];
                }
            }

            // 確保更新 matches.json 中新增的 id 存在於 reserved.json
            updatedIds.forEach(id => {
                if (!reservedJson.hasOwnProperty(id)) {
                    reservedJson[id] = [];
                }
            });

            // 寫入更新後的 reserved.json
            fs.writeFile('./reserved.json', JSON.stringify(reservedJson, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to reserved.json', err);
                    return res.status(500).send('Error saving reserved data');
                }

                // 成功回應
                res.send('Data saved successfully and cleaned up.');
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

            // check you haven't reserved
            const result = jsonLocal[updatedData.id].findIndex(item => (item.name === updatedData.name && item.phone === updatedData.phone));
            if (result !== -1) {
                return res.status(400).send('您已經預約過了，請勿重複預約');
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
                        phone: updatedData.phone,
                        userID: updatedData.userID,
                        maleNames: updatedData.maleNames,
                        femaleNames: updatedData.femaleNames
                    }
                ]
            } else {
                jsonLocal[updatedData.id].push({
                    name: updatedData.name,
                    phone: updatedData.phone,
                    userID: updatedData.userID,
                    maleNames: updatedData.maleNames,
                    femaleNames: updatedData.femaleNames
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


// 讀取 matches.json 和 reserved.json 檔案
let matches = JSON.parse(fs.readFileSync('matches.json', 'utf8'));
let reserved = JSON.parse(fs.readFileSync('reserved.json', 'utf8'));

// 定期檢查並刪除過期的資料
cron.schedule('0 0 * * *', () => { // 每天午夜 00:00 執行
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
  
    // 檢查 matches 資料
    matches = matches.filter(match => {
      const [month, day] = match.date.split('/').map(x => parseInt(x));
      const matchDate = new Date(currentYear, month - 1, day);
  
      // 處理跨年問題
      if (month === 1 && currentDate.getMonth() === 11) {
        matchDate.setFullYear(currentYear + 1);
      }
  
      return matchDate.getTime() >= currentDate.getTime();
    });
    fs.writeFileSync('matches.json', JSON.stringify(matches, null, 2), 'utf8');
  
    // 檢查 reserved 資料
    Object.keys(reserved).forEach(matchId => {
      if (!matches.find(match => match.id === matchId)) {
        delete reserved[matchId];
      }
    });
    fs.writeFileSync('reserved.json', JSON.stringify(reserved, null, 2), 'utf8');
  
    console.log('資料更新完成');
  });
  
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

