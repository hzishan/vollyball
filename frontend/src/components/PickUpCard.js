import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";

const PersonDiv = styled.div`
    display: flex;
    align-items: center;
    width: 180px;
`;

export default function PickUpCard({handleFinish, maleMax, femaleMax}) {
    const [maleNames, setMaleNames] = useState(['']);
    const [femaleNames, setFemaleNames] = useState(['']);
    const handleFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const initialValues = {
        male: 0,
        female: 0,
    };

    const rmMale = (index) => {
        setMaleNames(maleNames.filter((_, i) => i !== index));
    }
    
    const rmFemale = (index) => {
        setFemaleNames(femaleNames.filter((_, i) => i !== index));
    }

    return (
        <Form
            onFinish={(values)=>{
                const filteredMaleNames = maleNames.filter(name => name !== '');
                const filteredFemaleNames = femaleNames.filter(name => name !== '');
                const formDate = {...values, 
                    maleNames: filteredMaleNames,
                    femaleNames: filteredFemaleNames};
                handleFinish(formDate);
            }}
            onFinishFailed={handleFinishFailed}
            >
            <Form.Item
                label="報名人"
                name="name"
                rules={[
                    {
                        required: true,
                        message: '請輸入姓名!',
                    },
                ]}
            >
                <Input type="text" />
            </Form.Item>
            {/* <Form.Item 
                style={{width:120, display:'flex'}} 
                label="性別"
                required>
                <div style={{height:30 ,width:150, display:'flex', alignItems:'center'}}>
                    <p style={{marginRight:'4px'}}>男:</p>
                    <Form.Item name="male" noStyle>
                    <InputNumber min={0} max={maleMax} style={{marginRight:'4px'}}/>
                    </Form.Item>
                    <p style={{marginRight:'4px'}}>女:</p>
                    <Form.Item name="female" noStyle>
                    <InputNumber min={0} max={femaleMax} style={{marginRight:'4px'}}/>
                    </Form.Item>
                </div>
            </Form.Item> */}
            <Form.Item
                style={{ width: '100%', display: 'flex' }} 
                label="新增人員">
                <div style={{height:30, width: '100%', display:'flex'}}>
                    <PersonDiv style={{marginRight:'4px'}}>
                        <p style={{marginRight:'4px'}}>男生</p>
                        <Button onClick={() => {setMaleNames([...maleNames, ''])}}>+</Button>
                    </PersonDiv>
                    <PersonDiv>
                        <p style={{marginRight:'4px'}}>女生</p>
                        <Button onClick={() => {setFemaleNames([...femaleNames, ''])}}>+</Button>
                    </PersonDiv>
                </div>
                <div style={{width: '100%', display: 'flex'}}>
                    <div style={{marginRight:'4px'}}>
                    {maleNames.map((name, index) => (
                        <PersonDiv>
                            <Input
                                value={name}
                                onChange={(e) => {
                                    const newMaleNames = [...maleNames];
                                    newMaleNames[index] = e.target.value;
                                    setMaleNames(newMaleNames);
                                }}
                            />
                            <Button onClick={()=>rmMale(index)}
                                disabled={maleNames.length<=1? true:false}>x</Button>
                        </PersonDiv>
                    ))}
                    </div>
                    <div>
                    {femaleNames.map((name, index) => (
                        <PersonDiv >
                            <Input key={index} type="text"
                                onChange={(e) => {
                                    const newFemaleNames = [...femaleNames];
                                    newFemaleNames[index] = e.target.value;
                                    setFemaleNames(newFemaleNames);
                                }} 
                            />
                            <Button onClick={()=>rmFemale(index)}
                                disabled={femaleNames.length<=1? true:false}>x</Button>
                        </PersonDiv>
                    ))}
                    </div>
                </div>
            </Form.Item>
            <Form.Item
                label="手機"
                name="phone"
                rules={[
                    {
                        required: true,
                        message: '請輸入手機號碼!',
                    },
                    {
                        pattern: /^09\d{8}$/,
                        message: '手機號碼格式不正確，請輸入 09xx-xxx-xxx 格式!',
                    },
                ]}
            >
                <Input type="text" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" 
                    htmlType="submit"
                    style={{ width: '100%'}}
                    >
                    完成
                </Button>
            </Form.Item>
        </Form>
    );
}
