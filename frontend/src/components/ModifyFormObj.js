import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber} from "antd";
import { useForm } from 'antd/lib/form/Form';
import styled from "styled-components";

export default function ReservedCheck({handleFinish}){
    const [form] = useForm();

    const handleCancel = () => {
        const values = form.getFieldValue();
        values.mode = "delete";
        handleFinish(values);
    }

    const handleModify = () => {
        const values = form.getFieldValue();
        values.mode = "modify";
        handleFinish(values);
    }
    
    return(
        <Form form={form}> 
            <Form.Item
                label="姓名"
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
            <Button type="primary" className='form-btn-2'
                onClick={handleCancel}
                htmlType='button'
                >
                取消整筆
            </Button>
            <Button type="primary" className='form-btn-2'
                onClick={handleModify}
                htmlType='button'>
                修改名單
            </Button>
        </Form>
    );
}

const PersonDiv = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;
export function ReservedModify({handleFinish, returnBack, reservedData, matchData}) {
    const [maleNames, setMaleNames] = useState(reservedData.maleNames || []);
    const [femaleNames, setFemaleNames] = useState(reservedData.femaleNames || []);
    useEffect(() => {
        if (reservedData.maleNames) {
            setMaleNames(reservedData.maleNames);
        }
        if (reservedData.femaleNames) {
            setFemaleNames(reservedData.femaleNames);
        }
    }, [reservedData]);

    const handleFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const rmMale = (index) => {
        setMaleNames(maleNames.filter((_, i) => i !== index));
    }
    
    const rmFemale = (index) => {
        setFemaleNames(femaleNames.filter((_, i) => i !== index));
    }

    const handleModify = (values) =>{
        const newReservedData = {
            ...reservedData,
            id: matchData.id,
            maleNames: values.maleNames,
            femaleNames: values.femaleNames,
            mode: 'modify'
        };
        handleFinish(newReservedData);
    }

    return(
        <Form 
            onFinish={(values)=>{
                const filteredMaleNames = maleNames.filter(name => name !== '');
                const filteredFemaleNames = femaleNames.filter(name => name !== '');
                const formDate = {
                    ...values, 
                    maleNames: filteredMaleNames,
                    femaleNames: filteredFemaleNames};
                handleModify(formDate);
            }}
            onFinishFailed={handleFinishFailed}>
            <Form.Item style={{ width: '100%', display: 'flex' }} >
                <div style={{height:30, display:'flex'}}>
                    <PersonDiv>
                        <p>男生:{reservedData.maleNames.length}</p>
                    </PersonDiv>
                    <PersonDiv>
                        <p>女生:{reservedData.femaleNames.length}</p>
                        {/* <Button onClick={() => {setFemaleNames([...femaleNames, ''])}}>+</Button> */}
                    </PersonDiv>
                </div>
                <div style={{width:'520px', display: 'flex'}}>
                    <div style={{width:'43%', paddingRight:'12px'}}>
                    <PersonDiv></PersonDiv>
                    {maleNames.map((name, index) => (
                        <PersonDiv key={index}>
                            <Input
                                value={name}
                                onChange={(e) => {
                                    const newMaleNames = [...maleNames];
                                    newMaleNames[index] = e.target.value;
                                    setMaleNames(newMaleNames);
                                }}
                            />
                            <Button onClick={()=>rmMale(index)}>x</Button>
                        </PersonDiv>
                    ))}
                    </div>
                    <div style={{width:'45%'}}>
                        {femaleNames.map((name, index) => (
                            <PersonDiv key={index}>
                                <Input
                                    value={name}
                                    onChange={(e) => {
                                        const newFemaleNames = [...femaleNames];
                                        newFemaleNames[index] = e.target.value;
                                        setFemaleNames(newFemaleNames);
                                    }}
                                />
                                <Button onClick={() => rmFemale(index)}>x</Button>
                            </PersonDiv>
                        ))}
                    </div>
                </div>
            </Form.Item>
            
            <Button type="primary" className = "form-btn-2" htmlType='button' onClick={returnBack}
                >
                返回
            </Button>
            <Button type="primary" className = "form-btn-2" htmlType='submit'>
                修改
            </Button>
        </Form>
    );
}