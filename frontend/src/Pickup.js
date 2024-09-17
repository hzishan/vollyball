import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Button, Modal } from "antd";
import DateSelection from "./components/DateSelection";
import MatchInfoCard from './components/MatchInfoCard';
import PickUpCard from './components/PickUpCard';

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

const today = new Date();

function Pickup() {
    const [matches, setMatches] = useState(null);
    const [reserved, setReserved] = useState(null);
    const [date, setDate] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        return <p>Loading remains...</p>;
    }

    const showForm = () => {
        setIsModalOpen(true);
    }
    const closeForm = () => {
        setIsModalOpen(false);
    };

    const handlePickup = async (values) => {
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
                // window.location.reload();
            } else {
                // throw new Error(response.)
                alert(await response.text());
            }
        } catch (error) {
            alert('Error saving data:', error.message);
        }
    };
        
    const handleFinish = (values, id, max) => {
        // if values both 0, return error
        if (!(values.male || values.female)) {
            alert('請至少報名一人');
            return;
        }
        if (values.male + values.female > max) {
            alert('報名人數超過上限');
            return;
        }

        setIsModalOpen(false);
        values.id = id;
        handlePickup(values);
    };

    let remain = 0;
    return(
        <div>
            <DateSelection onChange={(e)=>{setDate(e.split(' ')[0])}}/>
            {matches.map((item, index) => (
                remain = item.total_people - (reserved[item.id].total_male + reserved[item.id].total_female),
                (date==='all' || item.date === date) &&
                <div>
                    <MatchDiv>
                        <MatchInfoCard matchData={item} reservedData={reserved[item.id]} NeedDate={date==="all"}/>
                        <Button
                            onClick = {showForm}
                            type='primary'
                            disabled={!remain}
                        >
                            {remain? '報名' : '額滿'}
                        </Button>
                    </MatchDiv>
                    <Modal title="報名資訊" open={isModalOpen} onCancel={closeForm} footer={null}>
                        {item.limit?
                            <PickUpCard handleFinish={(e)=>handleFinish(e, item.id)} 
                                maleMax={item.ratio.male-reserved[item.id].total_male}
                                femaleMax={item.ratio.female-reserved[item.id].total_female}/> :
                            <PickUpCard handleFinish={(e)=>handleFinish(e, item.id, remain)}/>
                        }
                    </Modal>
                </div>
            ))}
        </div>
    );
}

export default Pickup;