import React, { useState, useEffect } from 'react';
import DateSelection from './components/DateSelection';
import styled from "styled-components";
import { Button, Form, Input, Modal } from "antd";
import MatchInfoCard from './components/MatchInfoCard';
import ReservedCheck, { ReservedModify } from './components/FormObj';

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
    const [date, setDate] = useState('all');
    const [ModalList, setModalList] = useState(false);
    const [ModalCancel, setModalCancel] = useState(null);
    const [ModalModify, setModalModify] = useState(null);
    const [formData, setFormData] = useState(null);

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
        setModalCancel(false);
        setModalModify(false);
        setModalList(id);
    }

    const ShowCheck = () => {
        setModalModify(false);
        setModalCancel(true);
    }

    const ShowModify = (values) => {
        setModalCancel(false);
        setModalModify(true);
        setFormData(values);
    }

    const handleCheckInfo = async(values, id) => {
        values.id = id;
        try {
            const response = await fetch('/check-reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                if (values.mode === 'delete') {
                    handleUpdate(values);
                }
                else if (values.mode === 'modify') {
                    ShowModify(values);
                }
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert('Error saving data:', error.message);
        }
    };

    const handleModify = (e) => {
        const newData = {...formData, ...e};
        handleUpdate(newData);
        setModalModify(false);
    };

    const handleUpdate = async(values) => {
        try {
            const response = await fetch('/modify-reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                if (values.mode === 'delete') {
                    alert('取消成功');
                }
                else if (values.mode === 'modify') {
                    alert('修改成功');
                }
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert('Error saving data:', error.message);
        }
    };

    let matchDateTime, month, day;
    return (
        <div>
            <p>註: 24小時前無法修改報名</p>
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
                                onClick = {ShowCheck}
                                type='primary'
                                style={{borderRadius:"0 0 9px 0"}}
                                disabled={matchDateTime-new Date() < 24*60*60*1000}>
                                修改報名
                            </Button>
                        </BtnDiv>
                    </MatchDiv> 
                    <Modal title="人員名單" open={ModalList===item.id} onCancel={()=>setModalList(false)} footer={null}>
                        {reserved[item.id]?.people_list.map((i, index) => (
                            <ListDiv>
                                <p>{i.name}</p>
                                <p>男生: {i.male}人</p>
                                <p>女生: {i.female}人</p>
                            </ListDiv>
                        ))}
                    </Modal>
                    <Modal title="登記資訊" open={ModalCancel} onCancel={()=>setModalCancel(false)} footer={null}>
                        <ReservedCheck 
                            handleFinish={(e)=>handleCheckInfo(e, item.id)}/>
                    </Modal>
                    <Modal title="修改人數" open={ModalModify} onCancel={()=>setModalModify(false)} footer={null}>
                        <ReservedModify 
                            handleFinish={(e)=>{handleModify(e)}}
                            returnBack = {()=>ShowCheck()}
                            data = {formData? reserved[formData.id]?.people_list.find(p => p.name === formData.name) :{male:0,female:0}}
                            maleRemain={item.ratio.male-reserved[item.id].total_male}
                            femaleRemain={item.ratio.female-reserved[item.id].total_female}/>
                    </Modal>
                </div>
            ))}
            </div>
    );
}

export default Reserved;
