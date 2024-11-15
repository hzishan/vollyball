import React, { useState } from "react";
import {Select, TimePicker, Switch, InputNumber, Button} from 'antd';
import styled from "styled-components";
import dayjs from 'dayjs';

const Container = styled.div`
    div{
        width: 100%;
        display: flex;
        align-items: center;
        margin-left: 16px;
        p{
            margin: 10px 2px;
            display: inline;
        }
        @media (max-width: 460px) {
            p{
                margin: 2px;
            }
        }
    }
`;

function MatchInfoCard({matchData, reservedData, NeedDate}) {
    return(
        <Container>
            {NeedDate && <div>{matchData.date}</div>}
            <div>
                {/* <p>時間:</p>
                <p>{matchData.start_time}</p>
                <p>~</p>
                <p>{matchData.end_time}</p> */}
                <p>時間:</p>
                <p>{matchData.period}</p>
                <p>場地:</p>
                <p>{matchData.location}</p>
                <p>費用:</p>
                <p>{matchData.fee}</p>
            </div>
            <div>
                <p>開放人數: </p>
                {matchData.limit ? 
                    <p>男{matchData.ratio.male} 女{matchData.ratio.female}</p> :
                    <p>{matchData.total_people}</p>
                }
                <p>備取:</p>
                <p>{matchData.ready_wait}</p>
            </div>
            <div>
                <p>報名人數:</p>
                {matchData.limit? (<p>男:{reservedData.total_male} 女:{reservedData.total_female}</p>)
                : <p>{reservedData.total_male+reservedData.total_female}</p>}
            </div>
        </Container>
    )
}

export default MatchInfoCard;