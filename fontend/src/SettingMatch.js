import React, { useEffect, useState } from 'react';
import {Select, TimePicker, Switch, InputNumber, Button} from 'antd';
import dayjs from 'dayjs';
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

function SettingMatch() {
    const [data, setData] = useState(null);
    const [date, setDate] = useState(today.getMonth()+1 + '/' + today.getDate());
    const initialData = {
        "date": date,
        "start_time": today.getHours()+2 + ":" + today.getMinutes(),
        "end_time": today.getHours()+5 + ":" + today.getMinutes(),
        "total_people": 18,
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
            <div style={{display:"flex", alignItems:"center"}}>
                <DateSelection onChange={(e)=>{setDate(e.split(' ')[0])}}/>
                <Button onClick={addMatch} type='primary'>增加場次</Button>
            </div>
            {data.map((item, index) => (
                (date==='all' || item.date === date) &&
                <MatchDiv>
                    <MatchSetCard data={item} onUpdate={(new_data)=>{handleUpdate(new_data, index)}}/>
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