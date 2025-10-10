import './App.css';

export default function OutputSection ({cropData, sprinklerData, fertilizerData, userOptions, calendarSquares}) {
    return (
        <>
            <div id="output-section">
                <TotalCropsDisplay calendarSquares={calendarSquares}/>
            </div>

            <div id="profit-section">
                <TotalProfit calendarSquares={calendarSquares}/>
            </div>
        </>
    );
}
function TotalCropsDisplay ({calendarSquares}) {
    let totalCrops = calendarSquares.reduce((acc, currSquare) => {
        return acc + currSquare.planted_crops.reduce((crops, crop) =>{
            return crops + crop.numberPlanted;
        }, 0);
    }, 0);
    return (
        <>
            <label for="total-num-crops-output">Total Number of Crops: </label>
            <input id="total-num-crops-output" value={totalCrops} readOnly/>
        </>
    );
}
function TotalProfit ({calendarSquares}) {
    let totalProfit = calendarSquares.reduce((acc, currSquare) => {
        return acc + currSquare.harvest_crops.reduce((profitAcc, crop) => {
            return profitAcc + crop.profit;
        }, 0);
    }, 0);
    return (
        <>
            <label for="total-profit-output">Total Profit: </label>
            <input id="total-profit-output" value={totalProfit} readOnly/>
        </>
    );
}