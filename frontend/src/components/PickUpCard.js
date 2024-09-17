import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";


export default function PickUpCard({handleFinish, maleMax, femaleMax}) {
    const handleFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const initialValues = {
        male: 0,
        female: 0,
    };

    return (
        <Form
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            initialValues={initialValues}>
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
