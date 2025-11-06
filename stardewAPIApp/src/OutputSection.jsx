import { useState, useEffect } from 'react';
import './App.css';

export default function OutputSection ({cropData, sprinklerData, fertilizerData, userOptions, currCalendar, wholeCalendar}) {
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalEarned, setTotalEarned] = useState(0);
    const [totalCrops, setTotalCrops] = useState(0);
    return (
        <>
            <div id="total-crops-section">
                <TotalCropsDisplay calendarSquares={currCalendar} setTotalCrops={setTotalCrops}/>
            </div>

            <div id="profit-section">
                <TotalProfit totalProfit={totalEarned-totalSpent}/>
            </div>

            <div id="earned-section">
                <TotalEarned calendarSquares={currCalendar} setTotalEarned={setTotalEarned}/>
            </div>

            <div id="spent-section">
                <TotalSpent calendarSquares={currCalendar} setTotalSpent={setTotalSpent}/>
            </div>

            <div id="unwatered-section">
                <CropsUnwatered userOptions={userOptions} totalCrops={totalCrops}/>
            </div>
            <div id="total-time-processing">
                <TotalProcessingTime userOptions={userOptions} currCalendar={currCalendar}/>
            </div>
            
        </>
    );
}
function TotalProcessingTime ({userOptions, currCalendar}) {
    const {kegs, preservesJars} = userOptions; // available preserves

    let KegTwoDay = 0;
    let KegFourDay = 0;
    let KegSixDay = 0; // holds # of processes for kegs that takes certain # of days
    for (const day of currCalendar) {
        for (const crop of day.harvest_crops) {
            if (crop.prepType === "keg") {
                switch (crop.processingTime) {
                    case 6:
                        KegSixDay+=crop.numberPlanted;
                        break;
                    case 4:
                        KegFourDay+=crop.numberPlanted;
                        break;
                    case 2:
                        KegTwoDay+=crop.numberPlanted;
                        break;
                    default:
                        if (crop.crop.id !== 4) console.log("ERROR, INVALID TIME FOUND");
                }
            }
        }
    }
    function calculateKegProcessingTime (KegTwoDay, KegFourDay, KegSixDay, kegs) {
        if (kegs <= 0) return 0;
        const kegAvailability = new Array(kegs).fill(0); // times for each machine
        const processes = [...new Array(KegSixDay).fill(6), ...new Array(KegFourDay).fill(4), ...new Array(KegTwoDay).fill(2)];
        
        for (let process of processes) {
            let minIndex = 0;
            for (let i = 1; i < kegAvailability.length; i++) {
                if (kegAvailability[i] < kegAvailability[minIndex]) {
                    minIndex = i;
                }
            }
            kegAvailability[minIndex]+=process;
        }

        return Math.max(...kegAvailability);
    }

    const preservesProcesses = currCalendar.reduce((acc, curr) => {
        return acc + curr.harvest_crops.reduce((acc2, currCrop) => {
            if (currCrop.prepType === "preserves") return acc2+currCrop.numberPlanted;
            return acc2;
        }, 0);
    }, 0);
    if ((preservesProcesses > 0 && !preservesJars) || (KegTwoDay+KegFourDay+KegSixDay > 0 && !kegs)) {
        return (
        <>
            <label htmlFor="total-processing-time-output">Total Processing Time: </label>
            <input id="total-processing-time-output" value={"Missing Kegs/Preserves"} readOnly />

            <label htmlFor="total-plants-kegs">Total Plants In Kegs: </label>
            <input id="total-plants-kegs" value={KegTwoDay+KegFourDay+KegSixDay} readOnly />

            <label htmlFor="total-plants-preserves">Total Plants In Preserves Jars: </label>
            <input id="total-plants-preserves" value={preservesProcesses} readOnly />
        </>
        );
    }

    const preservesTime = preservesJars ? Math.ceil(preservesProcesses/preservesJars) * 2 : 0;
    const kegTime = kegs ? calculateKegProcessingTime(KegTwoDay, KegFourDay, KegSixDay, kegs) : 0;
    return (
        <>
            <label htmlFor="total-processing-time-output">Total Processing Time: </label>
            <input id="total-processing-time-output" value={Math.max(kegTime, preservesTime) + " Days"} readOnly />

            <label htmlFor="total-plants-kegs">Total Plants In Kegs: </label>
            <input id="total-plants-kegs" value={KegTwoDay+KegFourDay+KegSixDay} readOnly />

            <label htmlFor="total-plants-preserves">Total Plants In Preserves Jars: </label>
            <input id="total-plants-preserves" value={preservesProcesses} readOnly />
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