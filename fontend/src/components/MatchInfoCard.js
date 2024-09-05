import React, { useState } from "react";
import {Select, TimePicker, Switch, InputNumber, Button} from 'antd';
import styled from "styled-components";
import dayjs from 'dayjs';

const Container = styled.div`
    div{
        // height: 30px;
        display: flex;
        align-items: center;
        margin-left: 16px;
        p{
            margin: 10px 2px;
            display: inline;
        }
    }
`;

function MatchInfoCard({matchData, reservedPerson}) {
    return(
        <Container>
            <div>
                <p>時間:</p>
                <p>{matchData.start_time}</p>
                <p>~</p>
                <p>{matchData.end_time}</p>
            </div>
            <div>
                <p>開放人數:</p>
                {matchData.limit ? 
                    // <p>男:</p>:
                    <p>男{matchData.ratio.male} 女{matchData.ratio.female}</p> :
                    <p>{matchData.total_people}</p>
                }           
            </div>
            <div>
                <p>剩餘名額:</p>
                <p>{matchData.total_people}</p>
            </div>
        </Container>
    )
}

export default MatchInfoCard;