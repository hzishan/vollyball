import React, { useEffect, useState } from 'react';

export default function ReservedCard({ reservedData, matchInfo }) {
    const { male: maleLimit, female: femaleLimit } = matchInfo.ratio;

    let maleCount = 0;
    let femaleCount = 0;
    let totalCount = 0;

    const displayedMales = [];
    const displayedFemales = [];
    let waitingList = [];

    const matchDateTime = new Date(`${new Date().getFullYear()}-${matchInfo.date.replace('/', '-')}-${matchInfo.start_time}:00`);
    const limitRemove = matchDateTime - new Date() < 48 * 60 * 60 * 1000;

    console.log("limitRemove", limitRemove);
    if (matchInfo.limit){
        reservedData.people_list.forEach(person => {
            person.maleNames.forEach(name => {
                if (maleCount < maleLimit) {
                    displayedMales.push(name);
                    maleCount++;
                } else {
                    waitingList.push({ name, gender: '男' });
                }
            });
    
            person.femaleNames.forEach(name => {
                if (femaleCount < femaleLimit) {
                    displayedFemales.push(name);
                    femaleCount++;
                } else {
                    waitingList.push({ name, gender: '女' });
                }
            });
        });
        if (limitRemove){
            let newWaitingList = [];
            totalCount = displayedMales.length + displayedFemales.length;
            if (waitingList.length){
                waitingList.forEach(({name, gender})=>{
                    if (totalCount < matchInfo.total_people){
                        if (gender === '男'){
                            displayedMales.push(name);
                        } else {
                            displayedFemales.push(name);
                        }
                        totalCount++;
                    } else {
                        newWaitingList.push({name, gender});
                    }
                })
            }
            waitingList = newWaitingList;   
        }
    } else {
        reservedData.people_list.forEach(person => {
            person.maleNames.forEach(name => {
                if (totalCount < matchInfo.total_people) {
                    displayedMales.push(name);
                    totalCount++;
                } else {
                    waitingList.push({name, gender: '男'});
                }
            });
    
            person.femaleNames.forEach(name => {
                if (totalCount < matchInfo.total_people) {
                    displayedFemales.push(name);
                    totalCount++;
                } else {
                    waitingList.push({name, gender: '女'});
                }
            });
        });
    } 

    return (
        <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: '30%' }}>
                <h4>男生名單:</h4>
                {displayedMales.map(name => (
                    <p key={name}>{name}</p>
                ))}
            </div>

            <div style={{ width: '30%' }}>
                <h4>女生名單:</h4>
                {displayedFemales.map(name => (
                    <p key={name}>{name}</p>
                ))}
            </div>

            <div style={{ width: '30%' }}>
                <h4>備取名單:</h4>
                {waitingList.map(({ name, gender }) => (
                    <p key={name}>{`${name} (${gender})`}</p>
                ))}
            </div>
        </div>
    );
}
