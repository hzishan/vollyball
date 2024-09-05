import { Button } from 'antd';
import React, { useState, useEffect } from 'react';

async function saveData(updatedData) {
    try {
        const response = await fetch('/update-matches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
 
        if (response.ok) {
            alert('Data saved successfully');
        } else {
            alert('Failed to save data');
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}
 
function Reserved() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/get-matches')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch(error => console.error('Error fetching JSON:', error));
    }, []);

    const updatedData = {
        "場次": [
            {
                "開始時間": "12:08",
                "結束時間": "14:08",
                "限制": {
                    "人數": 18,
                    "男生": 12,
                    "女生": 6
                }
            }
        ]
    };
    return (
        <div>
            {JSON.stringify(data, null, 2)}
            {console.log(data)}
            <h1>
                <Button onClick={()=>saveData(updatedData)}>Save</Button>
            </h1>
        </div>
    );
}

export default Reserved;
