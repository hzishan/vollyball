import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { getMatches } from './server';

function Reaerved() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('matches.json')
            .then(res => res.json())
            .then(data => setData(data));
        getMatches().then(data => console.log(data));
    }, []);


    const saveToLocalStorage = () => {
        localStorage.setItem(
            data[0],
            JSON.stringify()
        );
    };
 
    const getFromLocalStorage = () => {
        if (data !== undefined) {
            this.setState(JSON.parse(data));
        }
    };

    return (
    <h1>
        <Button onClick={saveToLocalStorage}>Save</Button>
    </h1>
    );
}

export default Reaerved;