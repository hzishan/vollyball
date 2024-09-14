import React, { useState, useEffect } from 'react';
import DateSelection from './components/DateSelection';
import styled from "styled-components";
import { Button, Form, Input, Modal } from "antd";
import MatchInfoCard from './components/MatchInfoCard';

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
const BtnDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    button {
        height: 100%;
    }
`;

const ListDiv = styled.div`
    display: flex;
    p {
        margin-right: 4px;
    }
`;

const today = new Date();
 
function Reserved() {
    const [matches, setMatches] = useState(null);
    const [reserved, setReserved] = useState(null);
    const [date, setDate] = useState(today.getMonth()+1 + '/' + today.getDate());
    const [ModalList, setModalList] = useState(false);
    const [ModalCancel, setModalCancel] = useState(null);

    useEffect(() => {
        fetch('/get-matches')
            .then((response) => response.json())
            .then((data) => setMatches(data))
            .catch(error => console.error('Error fetching JSON:', error));        
    }, []);

    useEffect(() => {
        fetch('/get-reserved')
            .then((response) => response.json())
            .then((data) => setReserved(data))
            .catch(error => console.error('Error fetching JSON:', error));
    }, []);

    if (!matches) {
        return <p>Loading matches...</p>;
    }

    if (!reserved) {
        return <p>Loading reservedData...</p>;
    }

    const ShowList = (id) => {
        setModalList(id);
    }

    const ShowCancel = () => {
        setModalCancel(true);
    }

    const handleCancel = async(values) => {
        try {
            const response = await fetch('/cancel-reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                alert('已取消報名');
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert('Error saving data:', error.message);
        }
    };

    const handleFinish = (values, id) => {
        values.id = id;
        // console.log('Received values:', values);
        handleCancel(values);
        setModalCancel(false);
    };

    let matchDateTime, month, day;
    
    return (
        <div>
            <p>註: 24小時前無法取消報名</p>
            <DateSelection onChange={(e)=>{setDate(e.split(' ')[0])}}/>
            {matches.map((item, index) => (
                [month, day] = item.date.split('/'),
                matchDateTime = new Date(`${new Date().getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${item.start_time}:00`),
                (date==='all' || item.date === date) &&
                <div>
                    <MatchDiv>
                        <MatchInfoCard matchData={item} reservedData={reserved[item.id]} NeedDate={date==="all"}/>
                        <BtnDiv>
                            <Button
                                onClick = {()=>ShowList(item.id)}
                                type='primary'
                                style={{borderRadius:"0 9px 0 0"}}>
                                人員名單
                            </Button>
                            <Button
                                onClick = {ShowCancel}
                                type='primary'
                                style={{borderRadius:"0 0 9px 0"}}
                                disabled={matchDateTime-new Date() < 24*60*60*1000}>
                                取消報名
                            </Button>
                        </BtnDiv>
                    </MatchDiv>
                    <Modal title="人員名單" open={ModalList===item.id} onCancel={(e)=>setModalList(false)} footer={null}>
                        {reserved[item.id]?.people_list.map((i, index) => (
                            <ListDiv>
                                {console.log(i)}
                                <p>{i.name}</p>
                                <p>男生: {i.male}人</p>
                                <p>女生: {i.female}人</p>
                            </ListDiv>
                        ))}
                    </Modal>
                    <Modal title="取消報名" open={ModalCancel} onCancel={(e)=>setModalCancel(false)} footer={null}>
                        <Form onFinish={(e)=>handleFinish(e, item.id)}>
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
                            <Button type="primary" 
                                htmlType="submit"
                                style={{ width: '100%'}}
                                >
                                    送出
                            </Button>
                        </Form>
                    </Modal>
                </div>
            ))}
            </div>
    );
}

export default Reserved;
