import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Button, Form, Input, Modal, Select } from "antd";
import DateSelection from "./components/DateSelection";
import MatchInfoCard from './components/MatchInfoCard';
import PickUpLimit, {PickupUnlimit} from './components/PickUpCard';

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

const today = new Date();

function Pickup() {
    const [matches, setMatches] = useState(null);
    const [date, setDate] = useState(today.getMonth()+1 + '/' + today.getDate());
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch('/get-matches')
            .then((response) => response.json())
            .then((data) => setMatches(data))
            .catch(error => console.error('Error fetching JSON:', error));        
    }, []);
    
    if (!matches) {
        return <p>Loading...</p>;
    }

    const showForm = () => {
        setIsModalOpen(true);
    }
    const closeForm = () => {
        setIsModalOpen(false);
    };

    const handlePickup = async (values) => {
        console.log('Forma Values:', values);
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
                alert('伺服器錯誤，請稍後再試');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };
        

    const handleFinish = (values) => {
        setIsModalOpen(false);
        values.date = "9/8";
        values.start_time = "17:30";        
        handlePickup(values);
    };

    return(
        <div>
            註:男女限制只能報自己的電話姓名
            無限制可以報多人
            <DateSelection onChange={(e)=>{setDate(e.split(' ')[0])}}/>
            {matches.map((item, index) => (
                (date==='all' || item.date === date) &&
                    <div>
                    <MatchDiv>
                        <div>
                            <MatchInfoCard matchData={item}/>
                        </div>
                        <Button
                            onClick = {showForm}
                            type='primary'
                            style={{height: '100%', borderRadius: '0 10px 10px 0'}}
                        >
                            報名
                        </Button>
                    </MatchDiv>
                    <Modal title="報名資訊" open={isModalOpen} onCancel={closeForm} footer={null}>
                        { item.limit?
                            <PickUpLimit handleFinish={handleFinish}/>:
                            (

                                <PickupUnlimit handleFinish={handleFinish}/>
                            )
                        }
                    </Modal>
                </div>
            ))}
        </div>
    );
}

export default Pickup;