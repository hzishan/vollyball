import styled from "styled-components";
import { Select } from "antd";

const MatchDiv = styled.div`
    width: 100%;
    border: 1px solid black;
    h2 {
        font-size: 20px;
        margin: 4px;
    }
    p {
        font-size: 16px;
        margin: 4px;
    }
`;
const handleChange = (value) => {
    console.log(`selected ${value}`);
};

function Pickup() {
    const dataOptions = ['a','b','c'];

    return(
        <div>
            <h1> Pick Up</h1>
            <p>本場館目前只提供三天內預約，且開打前24小時內不得取消</p>
            <p>選擇日期：
                <Select
                    defaultValue={dataOptions[0]}
                    onChange={handleChange}
                    options={dataOptions.map(item =>({value: item}))}
                />
            </p>
            <MatchDiv>
                <h2>時間</h2>
                <p>目前狀態</p>
                <p>開放人數</p>
                <p>報名人數</p>
                <p>剩餘名額</p>
            </MatchDiv>
        </div>
    );
}

export default Pickup;