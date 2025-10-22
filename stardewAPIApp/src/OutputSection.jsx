import { useState, useEffect } from 'react';
import './App.css';

export default function OutputSection ({cropData, sprinklerData, fertilizerData, userOptions, calendarSquares}) {
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalEarned, setTotalEarned] = useState(0);
    const [totalCrops, setTotalCrops] = useState(0);
    return (
        <>
            <div id="total-crops-section">
                <TotalCropsDisplay calendarSquares={calendarSquares} setTotalCrops={setTotalCrops}/>
            </div>

            <div id="profit-section">
                <TotalProfit totalProfit={totalEarned-totalSpent}/>
            </div>

            <div id="earned-section">
                <TotalEarned calendarSquares={calendarSquares} setTotalEarned={setTotalEarned}/>
            </div>

            <div id="spent-section">
                <TotalSpent calendarSquares={calendarSquares} setTotalSpent={setTotalSpent}/>
            </div>

            <div id="unwatered-section">
                <CropsUnwatered userOptions={userOptions} totalCrops={totalCrops}/>
            </div>
        </>
    );
}
function CropsUnwatered ({userOptions, totalCrops}) {
    const {normal, quality, iridium} = userOptions.sprinklers;
    const unwateredCrops = totalCrops-(normal*4 + quality*8 + iridium*24);

    return (
        <>
            <label htmlFor="unwatered-output">Total Unwatered Crops: </label>
            <input id="unwatered-output" value={`${unwateredCrops < 0 ? 0 : unwateredCrops}`} readOnly />
        </>
    );
}
function TotalSpent ({calendarSquares, setTotalSpent}) {
    const [localTotalSpent, setlocalTotalSpent] = useState(0);

    useEffect(() => {
        const total = calendarSquares.reduce((acc, curr) => {
        return acc + curr.planted_crops.reduce((acc2, currCrop) => {
            return acc2 + (currCrop.numberPlanted*currCrop.crop.seed_price);
            }, 0);
        }, 0);

        setlocalTotalSpent(total); // update this component's state
        setTotalSpent(total);      // inform the parent component
    }, [calendarSquares, setTotalSpent]);

    return (
        <>
            <label htmlFor="total-earned-output">Total Spent: </label>
            <input id="total-earned-output" value={`$${localTotalSpent}`} readOnly />
        </>
    );
}

function TotalEarned({ calendarSquares, setTotalEarned }) {
    const [localTotalEarned, setLocalTotalEarned] = useState(0);

    useEffect(() => {
        const total = calendarSquares.reduce((acc, curr) => {
        return acc + curr.harvest_crops.reduce((acc2, currCrop) => {
            return acc2 + currCrop.total_earned;
            }, 0);
        }, 0);

        setLocalTotalEarned(total); // update this component's state
        setTotalEarned(total);      // inform the parent component
    }, [calendarSquares, setTotalEarned]);

    return (
        <>
            <label htmlFor="total-earned-output">Total Earned: </label>
            <input id="total-earned-output" value={`$${localTotalEarned}`} readOnly />
        </>
    );
}
function TotalCropsDisplay ({calendarSquares, setTotalCrops}) {
    let totalCrops = calendarSquares.reduce((acc, currSquare) => {
        return acc + currSquare.planted_crops.reduce((crops, crop) =>{
            return crops + crop.numberPlanted;
        }, 0);
    }, 0);
    useEffect(() => {
        setTotalCrops(totalCrops);
    }, [totalCrops, setTotalCrops]);
    return (
        <>
            <label htmlFor="total-num-crops-output">Total Number of Crops: </label>
            <input id="total-num-crops-output" value={totalCrops} readOnly/>
        </>
    );
}
function TotalProfit ({totalProfit}) {
    return (
        <>
            <label htmlFor="total-profit-output">Total Profit: </label>
            <input id="total-profit-output" value={`$${totalProfit}`} readOnly/>
        </>
    );
}