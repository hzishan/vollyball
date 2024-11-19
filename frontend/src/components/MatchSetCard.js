import React, { useState } from "react";
import {Select, TimePicker, Switch, InputNumber, Button} from 'antd';
import styled from "styled-components";
import dayjs from 'dayjs';

const Container = styled.div`
    div{
        display: flex;
        align-items: center;
        padding: 4px;
        p{
            margin: 0 10px;
        }
        input{
            height: 12px;
        }
        div{
            width: 80px;
        }
    }
`;

function MatchSetCard({data, onUpdate, NeedDate, weekend}) {

    const handleChange = (key, value) => {
        const updatedData = { ...data, [key]: value };
        if (key === "total_people") {
            updatedData.ratio.male = value;
            updatedData.ratio.female = 0;
        }
        onUpdate(updatedData);
    };

    const handleRatioChange = (key, value) => {
        const updatedData = { ...data, ratio: {...data.ratio, [key]: value} };
        updatedData.total_people = updatedData.ratio.male + updatedData.ratio.female;
        onUpdate(updatedData);
    }

    const myPeriod = {
        "1": "9:00~13:00",
        "2": "13:30~17:30",
        "3": weekend? "18:00~22:00":"18:30~22:00",
        "4": "22:15~01:15"
    }

    return (
        <Container>
            {NeedDate && <div>{data.date}</div>}
            <div>
                <p>時間:</p>
                <Select
                    defaultValue={data.period}
                    style={{ width: 150 }}
                    onChange={(e)=>handleChange('period', myPeriod[e])}
                    >
                        {
                            Object.keys(myPeriod).map((key) => (
                                <Select.Option key={key} >{myPeriod[key]}</Select.Option>
                            ))
                        }
                </Select>
                <p>場地:</p>
                <Select defaultValue={data.location} style={{ width: 70 }} onChange={(e)=>handleChange('location', e)}>
                    <Select.Option value="左">左</Select.Option>
                    <Select.Option value="右">右</Select.Option>
                </Select>
                {/* <TimePicker
                    format={"HH:mm"} 
                    defaultValue={dayjs(data["start_time"],"HH:mm")}
                    onChange={(e)=>handleChange('start_time', e.format("HH:mm"))}
                    allowClear={false}/>
                <p>~</p>
                <TimePicker
                    format={"HH:mm"}
                    defaultValue={dayjs(data["end_time"],"HH:mm")}
                    onChange={(e)=>handleChange('end_time', e.format("HH:mm"))}
                    allowClear={false}/> */}
            </div>
            <div>
                <p>男女限制:</p>
                <Switch
                    checkedChildren="on"
                    unCheckedChildren="off"
                    defaultChecked={data["limit"]}
                    onChange={(e)=>handleChange('limit', e)}
                />
                <p>費用:</p>
                <InputNumber min={0} defaultValue={data["fee"]} onChange={(e)=>handleChange('fee', e)}/>
            </div>
            {data["limit"]?
                (<div>
                    <p>男:</p>
                    <InputNumber min={0} defaultValue={data.ratio["male"]}
                        onChange={(e)=>handleRatioChange("male",e)}/>
                    <p>女:</p>
                    <InputNumber min={0} defaultValue={data.ratio["female"]}
                        onChange={(e)=>handleRatioChange("female",e)}/>
                    <p>備:</p>
                    <InputNumber min={0} defaultValue={data["ready_wait"]}
                        onChange={(e)=>handleChange("ready_wait",e)}/>
                </div>):
                (<div>
                    <p>總人數:</p>
                    <InputNumber min={0} defaultValue={data["total_people"]}
                        onChange={(e)=>handleChange("total_people",e)}/>
                    <p>備取:</p>
                    <InputNumber min={0} defaultValue={data["ready_wait"]}
                        onChange={(e)=>handleChange("ready_wait",e)}/>
                </div>)
            }
        </Container>
    )
}

export default MatchSetCard;