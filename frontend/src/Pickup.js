import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Button, Modal } from "antd";
import DateSelection from "./components/DateSelection";
import MatchInfoCard from './components/MatchInfoCard';
import PickUpForm from './components/PickUpForm';
import { generateString } from './SettingMatch';

const MatchDiv = styled.div`
    border: 1px solid black;
    border-radius: 10px;
    margin: 10px 0;
    height: 150px;
    width: 450px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    button {
        height: 100%;
        border-radius: 0 10px 10px 0;
    }
`;

function Pickup() {
    const [matches, setMatches] = useState(null);
    const [reserved, setReserved] = useState(null);
    const [date, setDate] = useState('all');
    const [modalInfo, setModalInfo] = useState({ isOpen: false, currentItem: null }); // 控制每個比賽的 modal 狀態

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

    const showForm = (item) => {
        setModalInfo({ isOpen: true, currentItem: item });
    };

    const closeForm = () => {
        setModalInfo({ isOpen: false, currentItem: null });
    };

    const handlePickup = async (values) => {
        values.userID = generateString(4);
        try {
            const response = await fetch('/pickup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });
            if (response.ok) {
                alert('報名成功');
            } else {
                alert(await response.text());
            }
        } catch (error) {
            alert('Error saving data:', error.message);
        }
    };

    const handleFinish = (values, id, max, ready_wait) => {
        const total = values.maleNames.length + values.femaleNames.length;
        
        if (total === 0) {
            alert('請至少報名一人');
            return;
        }
        else if (total > max + ready_wait) {
            alert('報名人數超過上限');
            return;
        }

        closeForm();
        handlePickup({ ...values, id });
    };

    return (
        <div>
            <DateSelection onChange={(e) => setDate(e.split(' ')[0])} />
            {matches.map((item) => {
                const reservedItem = reserved[item.id];
                const remain = item.total_people - (reservedItem.total_male + reservedItem.total_female);
                const totalReserved = reservedItem.total_male + reservedItem.total_female;
                const totalCapacity = item.total_people + item.ready_wait;

                return (date === 'all' || item.date === date) && (
                    <div key={item.id}>
                        <MatchDiv>
                            <MatchInfoCard matchData={item} reservedData={reservedItem} NeedDate={date === "all"} />
                            <Button
                                onClick={() => showForm(item)}
                                type = 'primary'
                                disabled={totalReserved >= totalCapacity}
                                danger = {remain>0? false : true}
                            >
                                {remain > 0 ? '報名' : totalReserved < totalCapacity ? '備取' : '額滿'}
                            </Button>
                        </MatchDiv>
                    </div>
                );
            })}
            {modalInfo.isOpen && (
                <Modal
                    title="報名資訊"
                    open={modalInfo.isOpen}
                    onCancel={closeForm}
                    footer={null}
                >
                    {modalInfo.currentItem?.limit ? (
                        <PickUpForm
                            handleFinish={(values) => handleFinish(values,
                                modalInfo.currentItem.id,
                                modalInfo.currentItem.total_people - (reserved[modalInfo.currentItem.id].total_male + reserved[modalInfo.currentItem.id].total_female),
                                modalInfo.currentItem.ready_wait)}
                            maleMax={modalInfo.currentItem.ratio.male + modalInfo.currentItem.ready_wait - reserved[modalInfo.currentItem.id].total_male}
                            femaleMax={modalInfo.currentItem.ratio.female + modalInfo.currentItem.ready_wait - reserved[modalInfo.currentItem.id].total_female}
                        />
                    ) : (
                        <PickUpForm
                            handleFinish={(values) => handleFinish(values,
                                modalInfo.currentItem.id,
                                modalInfo.currentItem.total_people - (reserved[modalInfo.currentItem.id].total_male + reserved[modalInfo.currentItem.id].total_female),
                                modalInfo.currentItem.ready_wait)}
                        />
                    )}
                </Modal>
            )}
        </div>
    );
}


export default Pickup;