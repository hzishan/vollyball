import React, { useState, useEffect } from 'react';
import DateSelection from './components/DateSelection';
import styled from "styled-components";
import { Button, Form, Input, Modal } from "antd";
import MatchInfoCard from './components/MatchInfoCard';
import ReservedCheck, { ReservedModify } from './components/ModifyFormObj';
import ReservedCard from './components/ReservedCard';

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


 
function Reserved() {
    const [matches, setMatches] = useState(null);
    const [reserved, setReserved] = useState(null);
    const [date, setDate] = useState('all');
    const [modalInfo, setModalInfo] = useState({ 
        listStatus: false,
        checkStatus: false,
        modifyStatus: false,
        currentItem: null,
        isCheck: false});
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [matchesResponse, reservedResponse] = await Promise.all([
                    fetch('/get-matches').then(res => res.json()),
                    fetch('/get-reserved').then(res => res.json())
                ]);
                setMatches(matchesResponse);
                setReserved(reservedResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    if (!matches || !reserved) return <p>Loading data...</p>;

    const handleModal = (type, item = null) => {
        setModalInfo({ listStatus: type === 'list',
            checkStatus: type === 'check',
            modifyStatus: type === 'modify',
            currentItem: item });
    };

    const handleCheckInfo = async(values, id) => {
        values.id = id;
        try {
            const response = await fetch('/check-reservation', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values),
            });
            if (response.ok) {
                const data = await response.text();
                if (values.mode === 'delete') {
                    values.userID = data;
                    handleUpdate(values);
                }
                else if (values.mode === 'modify') {
                    setUserID(data);
                    setModalInfo((prev)=>({
                        ...prev,
                        checkStatus: false,
                        modifyStatus: true,
                        isCheck: true,
                    }));
                }
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert('Error saving data:', error.message);
        }
    };

    const handleUpdate = async(values) => {
        if (values.mode === 'modify') {
            if (values.maleNames.length===0 && values.femaleNames.length===0){
                values.mode = 'delete';
            }
        }

        try {
            const response = await fetch('/modify-reservation', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values),
            });
            if (response.ok) {
                alert(values.mode === 'delete' ? '取消成功' : '修改成功');
                setModalInfo((prev)=>({
                    ...prev,
                    modifyStatus: false,
                }));
                window.location.reload();
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert('Error saving data:', error.message);
        }
    };

    return (
        <div>
            <p>註: 24小時前無法修改報名</p>
            <DateSelection onChange={(e)=>{setDate(e.split(' ')[0])}}/>
            {matches.map((item) => {
                const matchDateTime = new Date(`${new Date().getFullYear()}-${item.date.replace('/', '-')}-${item.start_time}:00`);
                const reservedData = reserved[item.id] || {};
                const canModify = matchDateTime - new Date() >= 24 * 60 * 60 * 1000 && (reservedData.total_female || reservedData.total_male);

                return (date==='all' || item.date === date) && (
                <div key={item.id}>
                    {/* {(matchDateTime - new Date()) / 60 / 60 / 1000} */}
                    <MatchDiv>
                        <MatchInfoCard matchData={item} reservedData={reservedData} NeedDate={date==="all"}/>
                        <BtnDiv>
                            <Button
                                onClick = {()=>handleModal("list",item)}
                                type='primary'
                                style={{borderRadius:"0 9px 0 0"}}
                                disabled = {!reservedData.total_female && !reservedData.total_male}
                                >
                                {(reservedData.total_female||reservedData.total_male)? "已報人員":"目前沒人"}
                            </Button>
                            <Button
                                onClick = {()=>handleModal("check",item)}
                                type='primary'
                                style={{borderRadius:"0 0 9px 0"}}
                                disabled={!canModify} >
                                修改報名
                            </Button>
                        </BtnDiv>
                    </MatchDiv>
                </div>
                );
            })}
            {modalInfo.currentItem && (
                <div>
                <Modal title="人員名單" 
                    open={modalInfo.listStatus}
                    onCancel={()=>handleModal(null)}
                    footer={null}
                >
                    <ReservedCard 
                        reservedData={reserved[modalInfo.currentItem.id]}
                        matchInfo={modalInfo.currentItem}
                    />
                </Modal>

                <Modal title="登記資訊" open={modalInfo.checkStatus} onCancel={()=>handleModal(null)} footer={null}>
                    <ReservedCheck 
                        handleFinish={(e)=>handleCheckInfo(e, modalInfo.currentItem.id)}/>
                </Modal>
                {modalInfo.isCheck && (
                    <Modal title="修改人數 (您報名的人數如下)" open={modalInfo.modifyStatus} onCancel={()=>handleModal(null)} footer={null}>
                        <ReservedModify 
                            handleFinish={(e)=>{handleUpdate(e)}}
                            returnBack={(prev) => {
                                setModalInfo((current) => ({
                                    ...current,
                                    checkStatus: true,
                                    modifyStatus: false
                                }));
                            }}
                            reservedData = {reserved[modalInfo.currentItem.id].people_list.find(p => p.userID === userID)}
                            matchData = {modalInfo.currentItem}
                            />
                    </Modal>
                )}
                </div>
            )}
        </div>
    );
}

export default Reserved;
