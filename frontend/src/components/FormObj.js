import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber} from "antd";
import { useForm } from 'antd/lib/form/Form';

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
                修改
            </Button>
        </Form>
    );
}

export function ReservedModify({handleFinish, returnBack, data, maleRemain, femaleRemain}) {
    const [form] = useForm();
    
    const initialValues = {
        male: data.male,
        female: data.female,
    };

    const handleModify = () => {
        const values = form.getFieldValue();
        if (values.male === data.male && values.female === data.female){
            alert("未修改人數");
            return;
        }
        else if (!(values.male || values.female)){
            values.mode = "delete";
        }
        else{
            values.mode = "modify";
        }
        handleFinish(values);
    }
    return(
        <Form form={form} initialValues={initialValues}>
            {console.log("data",data)}
            <Form.Item 
                style={{width:120, display:'flex'}}
                label="人數"
                required>
                <div style={{height:30 ,width:150, display:'flex', alignItems:'center'}}>
                    <p style={{marginRight:'4px'}}>男:</p>
                    <Form.Item name="male" noStyle>
                    <InputNumber min={0} max={data.male + maleRemain} style={{marginRight:'4px'}}/>
                    </Form.Item>
                    <p style={{marginRight:'4px'}}>女:</p>
                    <Form.Item name="female" noStyle>
                    <InputNumber min={0} max={data.female + femaleRemain} style={{marginRight:'4px'}}/>
                    </Form.Item>
                </div>
            </Form.Item>
            <Button type="primary" className = "form-btn-2"
                htmlType='button'
                onClick={returnBack}
                >
                返回
            </Button>
            <Button type="primary"
                className = "form-btn-2"
                htmlType='button'
                onClick={handleModify}>
                送出
            </Button>
        </Form>
    );
}