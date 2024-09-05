const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());


// get data from matches.json
app.get('/get-matches', (req, res) => {
    fs.readFile('./matches.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).send('Error reading data');
        }
        res.json(JSON.parse(data));
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
        res.send('Data saved successfully');
    });
});

app.post('/pickup', (req, res) => {
    const updatedData = req.body;
    
    const filename = './tmp.json';
    // const filename = `./${updatedData.date}.json`;
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

        // 找到對應的 match
        const matchIndex = jsonLocal.findIndex(item => item.date === updatedData.date && item.start_time === updatedData.start_time);
        if (matchIndex === -1) {
            jsonLocal.push({
                date: updatedData.date,
                start_time: updatedData.start_time,
                reserved: [{
                    gender: updatedData.gender,
                    name: updatedData.name,
                    phone: updatedData.phone
                }]
            });
        } else {
            jsonLocal[matchIndex].reserved.push({
                gender: updatedData.gender,
                name: updatedData.name,
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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

