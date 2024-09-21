import React, { useEffect, useState } from 'react';
import {Button} from 'antd';
import styled from 'styled-components';
import DateSelection, {weekDays} from './components/DateSelection';
import MatchSetCard from './components/MatchSetCard';
import { FaTrashCan } from "react-icons/fa6";

const MatchDiv = styled.div`
    border: 1px solid black;
    border-radius: 10px;
    margin: 10px 0;
    height: 150px;
    width: 450px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const today = new Date();
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export function generateString(num) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < num; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


function SettingMatch() {
    const [data, setData] = useState(null);
    const [date, setDate] = useState('all');
    const initialData = {
        "id": generateString(5),
        "date": date,
        "start_time": String((today.getHours()+2)%24).padStart(2,'0') + ":" + String(today.getMinutes()).padStart(2,'0'),
        "end_time": String((today.getHours()+5)%24).padStart(2,'0') + ":" + String(today.getMinutes()).padStart(2,'0'),
        "total_people": 18,
        "ready_wait":6,
        "limit": false,
        "ratio": {
        "male": 12,
        "female": 6
        }
    }

    useEffect(() => {
        fetch('/get-matches')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch(error => console.error('Error fetching JSON:', error));
    }, []);

    if (!data) {
        return <p>Loading...</p>; // 當數據尚未加載時顯示 Loading
    }

    const handleUpdate = (new_data, index) => {
        const updatedSessions = data.map((old_data, i) =>
            i === index ? new_data : old_data
        );
        setData(updatedSessions);
    };

    const addMatch = () => {
        setData([...data, initialData]);
    }

    const removeMatch = (index) => {
        const updatedData = data.filter((session, i) => i !== index);
        setData(updatedData);
    }

    async function saveData(AllData) {
        try {
            const response = await fetch('/update-matches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(AllData)
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



    return (
        <div>
            {console.log("data",data)}
            <div style={{display:"flex", alignItems:"center"}}>
                <DateSelection onChange={(e)=>{setDate(e.split(' ')[0])}}/>
                {(date !== 'all') &&
                <Button onClick={addMatch} type='primary' >增加場次</Button>}
            </div>
            {data.map((item, index) => (
                (date==='all' || item.date === date) &&
                <MatchDiv>
                    <MatchSetCard 
                        data={item}
                        onUpdate={(new_data)=>{handleUpdate(new_data, index)}}
                        NeedDate={date==="all"}/>
                    <Button 
                        onClick={()=>removeMatch(index)}
                        type='primary'
                        style={{height: '100%', borderRadius: '0 10px 10px 0'}}
                    >
                        <FaTrashCan font-size='24px'/>
                    </Button>
                </MatchDiv>
            ))}
            <Button onClick={()=>saveData(data)} type='primary'>Save</Button>
        </div>
    )
}

export default SettingMatch;