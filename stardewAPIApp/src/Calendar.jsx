import './App.css';
import { useEffect, useState } from "react";
export default function Calendar ({calendarSquares, setCalendarSquares, userOptions, cropData, sprinklerData, fertilizerData}) {
    const [dayNumberSelected, setDaySelected] = useState(null); // for determining which day cropadd will target, if it is null then no day selected and popup should disappear
    const CalendarDisplay = [];
    for (let i = 0; i < calendarSquares.length; i++) {
        CalendarDisplay.push(<CalendarSquare key={i} setDaySelected={setDaySelected} dayNumberSelected={dayNumberSelected} dayNumber={i+1} calendarInfo={calendarSquares[i]}/>);
    }
    return (
    <>
        {dayNumberSelected ? <AddCropPopUp setDaySelected={setDaySelected} dayNumber={dayNumberSelected} season={userOptions.season} cropData={cropData} calendarSquares={calendarSquares} setCalendarSquares={setCalendarSquares} fertilizerData={fertilizerData} userOptions={userOptions}/> 
        : <p>No Day Selected</p>}
        {CalendarDisplay}
    </>
    );
    // TEST ONLY FOR DAY 1 CALENDAR SQUARE SO FAR

    
}

// Information in each day on the calendar
function CalendarSquare ({setDaySelected, dayNumberSelected, dayNumber, calendarInfo}) {
    // Takes dayNumber, int and calendarInfo, object
    const {planted_crops, harvest_crops} = calendarInfo;
    const plantedCrops = [];
    const harvestedCrops = [];

    for (const cropData of planted_crops) {
        plantedCrops.push(
            <li key={`planted-${cropData.id}`}>
                {nameNormalizer(cropData.crop.name)} x {cropData.numberPlanted}
            </li>
        );
    }
    
    for (const cropData of harvest_crops) {
        harvestedCrops.push(
            <li key={`harvested-${cropData.id}`}>
                {nameNormalizer(cropData.crop.name)} x {cropData.numberPlanted}
            </li>
        );
    }
    // if click on the square twice will deselect the day
    return (
        <div onClick={()=>dayNumberSelected===dayNumber ? setDaySelected(null) : setDaySelected(dayNumber)} className={dayNumberSelected === dayNumber ? "calendar-square selected-day" : "calendar-square"}>

            <p>DAY: {dayNumber}</p>
            <label>Planted Crops</label>
            <ul className="calendar-square-plantedCrops">
                {plantedCrops}
            </ul>

            <label>Harvested Crops</label>
            <ul className="calendar-square-harvestedCrops">
                {harvestedCrops}
            </ul>
        </div>
    );
}

// popup display
function AddCropPopUp ({setDaySelected, dayNumber, season, cropData, calendarSquares, setCalendarSquares, fertilizerData, userOptions}) {
    const [cropSelected, setCropSelected] = useState(0); // CROP ID, makes searching cropData much faster
    const [numberOfCrops, setNumCrops] = useState(1);
    const [fertSelected, setFertSelected] = useState(0); // FERTILIZER ID, auto chooses no fertilizer (if select value == 0 then none was chosen)

    const fertilizerOptions = [];
    for (const fertilizer of fertilizerData) {
        fertilizerOptions.push(
            <option key={fertilizer.id} value={fertilizer.id}>{nameNormalizer(fertilizer.name)}</option>
        );
    }
    return (
    <>
        <div id="add-crop-popup">
            <div id="top-section-popup">
                <p>For Day: {dayNumber}</p>
                <button id="exit-popup" onClick={()=>setDaySelected(null)}>X</button>
            </div>
            <div id="crop-query-popup">
                <SelectCropType season={season} cropData={cropData} setCropSelected={setCropSelected} cropSelected={cropSelected}/>
                <label htmlFor="number_of_crops">Number of Crops</label>
                <input id="number_of_crops" type="number" min="1" step="1" value={numberOfCrops} onChange={(e) => setNumCrops(parseInt(e.target.value))}/> 

                <select id="fertilizer-select" value={fertSelected} onChange={(e) => setFertSelected(parseInt(e.target.value))}>
                    <option key={"none"} value={0}>None</option>
                    {fertilizerOptions}
                </select>

                <button id="add-crop-btn" onClick ={() => updateCalendarData(
                    dayNumber, 
                    cropData.find(c => c.id===cropSelected), 
                    numberOfCrops, 
                    fertSelected ? fertilizerData.find(f=>f.id===fertSelected) : null, 
                    null, 
                    calendarSquares, 
                    setCalendarSquares,
                    userOptions)}>
                    Add Crop
                </button>
            </div>

            <div id="existing-crops-popup">
                <p>Planted Crops:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th># Planted</th>
                            <th>Fertilizer/Speed Gro</th>
                            <th>Total Cost</th>
                            <th>Time to Grow</th>
                            <th># of harvests</th>
                        </tr>
                    </thead>

                    <tbody>
                        {DisplayPlantedCrops(calendarSquares, dayNumber)}
                    </tbody>
                    </table>
                <p>Harvested Crops:</p>
                <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th># Yield</th>
                                <th>$ Earned</th>
                                <th>$ Profit</th>
                                <th>Time to Regrow</th>
                            </tr>
                        </thead>

                        <tbody>
                            {DisplayHarvestedCrops(calendarSquares, dayNumber, userOptions)}
                        </tbody>
                </table>
            </div>

        </div>
    </>

    // IMPLEMENT METHOD OF SELLING LATER
    );
}

// to be added within the table
function DisplayPlantedCrops (calendarSquares, dayNumber) {
    const displayRows = [];

    const dayData = calendarSquares[dayNumber - 1].planted_crops;
    for (const cropData of dayData) {
        const totalPrice = `$${cropData.numberPlanted * cropData.crop.seed_price}`; // for that speicifc crop, will do output calculations in output calcution
        let newDaysToGrow = cropData.crop.daysToGrow;
        if (cropData.fertilizer && cropData.fertilizer ==="speed_grow") {
            // speed gro
            const {multiplier} = cropData.fertilizer;
            newDaysToGrow = Math.floor(newDaysToGrow*multiplier);
        }
        let harvests = calculateRegrowthDays(cropData, dayNumber);
        
        displayRows.push(
            <tr key={`planted-${dayNumber}-${cropData.id}-0`}>
                <td>{nameNormalizer(cropData.crop.name)}</td>
                <td>{cropData.numberPlanted}</td>
                <td>{cropData.fertilizer?nameNormalizer(cropData.fertilizer.name):"None"}</td>
                <td>{totalPrice}</td>
                <td>{newDaysToGrow}</td>
                <td>{harvests}</td>
            </tr>
        );
    }
    function calculateRegrowthDays(cropData, dayNumber) {
        const daysLeft = 28-dayNumber;
        const {daysToGrow, regrowth} = cropData.crop;
        let newDaysToGrow = daysToGrow;
        if (cropData.fertilizer && cropData.fertilizer.type ==="speed_grow") {
            // speed gro
            const {multiplier} = cropData.fertilizer;
            newDaysToGrow = Math.floor(newDaysToGrow*multiplier);
        }
        if (daysLeft < newDaysToGrow) {
            return 0;
        }

        if (regrowth && regrowth > 0) {
            // crops who regrow after first harvest

            const remainingDays = daysLeft-newDaysToGrow;
            const extraHarvests = Math.floor(remainingDays / regrowth);
            return 1 + extraHarvests;
        }

        else {
            return 1; // single harvests
        }
    }
    return displayRows;
}
function DisplayHarvestedCrops (calendarSquares, dayNumber, userOptions) {
    const displayRows = [];
    const dayData = calendarSquares[dayNumber - 1].harvest_crops;
    for (const cropData of dayData) {
        displayRows.push(
            <tr key={`harvested-${dayNumber}-${cropData.id}-0`}>
                <td>{nameNormalizer(cropData.crop.name)}</td>
                <td>{cropData.numberPlanted}</td>
                <td>${cropData.total_earned}</td>
                <td>${cropData.profit}</td>
                <td>{cropData.crop.regrowth?cropData.crop.regrowth:"N/A"}</td>
            </tr>
        );
    }
    return displayRows;
}
function priceCalculate (cropPrice, numberPlanted, farmingLevel, fertilizer, tillerProf) {
    let price = cropPrice * numberPlanted;

    price *= (((0.02*farmingLevel))+1);

    if (fertilizer && fertilizer.type==="fertilizer") {
        const {multiplier} = fertilizer;
        price *= multiplier
    }
    if (tillerProf) {
        price *= 1.1;
    }
    return price;
}
const updateCalendarData = (dayNumber, crop, numberOfCrops, fertilizerType, prepType, calendarSquares, setCalendarSquares, userOptions) => {
    // WILL ADD PREP TIME LATER
    const newPlantAdd = {
        crop: crop,
        dayPlanted: dayNumber,
        numberPlanted: numberOfCrops,
        fertilizer: fertilizerType,
        id: `plant-${dayNumber}-${calendarSquares[dayNumber-1].planted_crops.length}`
    }; // data for new plant added (planting)
    const {farmingLevel, tillerProf} = userOptions;
    const sellValue = Math.floor(priceCalculate(crop.sellPrices.default, numberOfCrops, farmingLevel, fertilizerType, tillerProf));
    const newHarvestAdd = {
        crop: crop,
        numberPlanted: numberOfCrops,
        dayPlanted: dayNumber,
        total_earned: sellValue,
        profit: sellValue-crop.seed_price*numberOfCrops,
        id: `harvest-${dayNumber}-${calendarSquares[dayNumber-1].planted_crops.length}`
    }; // to be displayed in popup
    setCalendarSquares (prev => {
        // TODO: OPTIMIZE SET CALENDAR SQUARES SECTION
        const newSquares = [...prev];
        const newPlantSquare = {...newSquares[dayNumber-1]}; // copies of object/whole array
        
        newPlantSquare.planted_crops = [...newPlantSquare.planted_crops, newPlantAdd];
        newSquares[dayNumber-1] = newPlantSquare;
        // adds to planted crops 

        const {daysToGrow, regrowth} = newPlantAdd.crop;
        let newDaysToGrow = daysToGrow;
        if(fertilizerType && fertilizerType.type==="speed_grow") {
            newDaysToGrow= Math.floor(newDaysToGrow*fertilizerType.multiplier)
        }

        let dayCounter = newDaysToGrow + dayNumber - 1; // looks at 0 index, so minus 1
        if (dayCounter > 27) {
            return newSquares;
        }
        const newHarvestSquare = {...newSquares[dayCounter]};
        newHarvestSquare.harvest_crops = [...newHarvestSquare.harvest_crops, newHarvestAdd];
        newSquares[dayCounter] = newHarvestSquare;

        if (regrowth) {
            dayCounter += regrowth;
            while (dayCounter <= 27) {
                const newRegrowthSquare = {...newSquares[dayCounter]};
                newRegrowthSquare.harvest_crops = [...newRegrowthSquare.harvest_crops, newHarvestAdd];
                newSquares[dayCounter] = newRegrowthSquare;
                dayCounter+=regrowth;
            }
        }
        

        return newSquares;
    });

}
function SelectCropType ({season, cropData, setCropSelected, cropSelected}) {
    // return all crops with correct season
    const possiblePlants = cropData.filter((crop) => {
        return crop.season.includes(season);
    });
    
    useEffect(() => {
        if (!cropSelected && possiblePlants.length > 0) {
            setCropSelected(possiblePlants[0].id);
        }
    }, [cropSelected, possiblePlants, setCropSelected]);
    // will ONLY run if the crop selected changes or the the array of possible plants changes

    
    const listOfPossible = [];
    for (const plant of possiblePlants) {
        listOfPossible.push(<option value={plant.id} key={plant.id}>{nameNormalizer(plant.name)}</option>);
        // HOLDS THE PLANT ID AS IT'S VALUE, 
    }
    return (
        <select id="crop_selection" onChange={(e) => setCropSelected(parseInt(e.target.value))} value={cropSelected}>
            {listOfPossible}
        </select>
    )
}
const nameNormalizer = (name) => {
    return name.split("_").map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(" ");
}