import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";


export default function PickUpLimit({handleFinish}) {
    const handleFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}>
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
            <Form.Item style={{width:120}} label="性別" name="gender" required>
                <Select>
                    <Select.Option value="男">男</Select.Option>
                    <Select.Option value="女">女</Select.Option>
                </Select>
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

export function PickupUnlimit({handleFinish, remain}) {
    const handleFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return(
        <Form
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}>
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
            {/* <Form.Item style={{width:120}} label="性別" name="gender" required>
                <Select>
                    <Select.Option value="男">男</Select.Option>
                    <Select.Option value="女">女</Select.Option>
                </Select>
            </Form.Item>
             */}
            <Form.Item
                label="人數"
                name="people"
                rules={[
                    {
                        required: true,
                        message: '請輸入人數!',
                    },
                ]}                    
            >
                <InputNumber min={0} max={remain}/>
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
