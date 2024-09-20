import React, { useState } from "react";
import {Select} from 'antd';

export const weekDays = {
    "0": "日",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六"
}
const WeekDaysOptions = () => {
    const options =[];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        options.push(nextDay.getMonth()+1 + '/' + nextDay.getDate() +" "+ weekDays[nextDay.getDay()]);
    }
    options.push("all");
    return options;
}


export default function DateSelection({onChange}) {
    const dateOptions = WeekDaysOptions();
    return (
        <div style={{display:"flex", textAlign:"center", alignItems:"center", paddingRight:"10px"}}>
            <p style={{marginRight:"10px"}}>日期:</p>
            <Select
                style={{width:"100px"}}
                defaultValue={"all"}
                onChange={onChange}
                options={dateOptions.map(item => ({value: item}))}
            />
       </div>
    )
}
