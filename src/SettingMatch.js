import React, { useEffect, useState } from 'react';
import {Select, TimePicker, Switch, InputNumber} from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { getMatches } from './server';
import DateSelection from './components/SmallObj';


const MatchDiv = styled.div`
    border: 1px solid black;
    margin: 10px 0;
    border-radius: 10px;
    div{
        height: 30px;
        display: flex;
        align-items: center;
        padding: 4px;
        p{
            margin: 0 10px;
        }
    }
`;

const people = {
    "person": 18,
    "male": 12,
    "female": 6
}
const times = {
    "start": "12:08",
    "end": "14:08"
}

function SettingMatch() {
    const [limitValue, setLimitValue] = useState(false);
    
    const limitChange = (value) => {
        setLimitValue(value);
    };

    return (
        <div>
            <DateSelection onChange={(e)=>{console.log(e)}}/>
            <MatchDiv>
                <div>
                    <p>時間:</p>
                    <TimePicker
                        format={"HH:mm"} 
                        defaultValue={dayjs(times["start"],"HH:mm")}
                        onChange={(e)=>{console.log(e)}}/>
                    <p>~</p>
                    <TimePicker format={"HH:mm"} defaultValue={dayjs(times["end"],"HH:mm")}/>
                </div>
                <div>
                    <p>男女限制:</p>
                    <Switch
                        checkedChildren="on" 
                        unCheckedChildren="off"
                        onChange={limitChange}
                    />
                </div>
                {limitValue?
                    (<div>
                        <p>男生:</p>
                        <InputNumber min={0} defaultValue={people["male"]}/>
                        <p>女生:</p>
                        <InputNumber min={0} defaultValue={people["female"]}/>
                    </div>):
                    (<div>
                        <p>總人數:</p>
                        <InputNumber min={0} defaultValue={people["person"]}/>
                    </div>)
                }
            </MatchDiv>
        </div>
    )
}

export default SettingMatch;