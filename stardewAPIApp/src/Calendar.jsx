import './App.css';
import { useEffect, useState } from "react";
export default function Calendar ({currCalendar, wholeCalendar, setWholeCalendar, userOptions, cropData, fertilizerData, seasonIndex}) {
    const [dayNumberSelected, setDaySelected] = useState(null); // for determining which day cropadd will target, if it is null then no day selected and popup should disappear
    const CalendarDisplay = [];
    const [cropEdit, setCropEdit] = useState(null); // holds the plantedHarvest id for crop that is being edited (exact id of crop edited)
    for (let i = 0; i < 28; i++) {
        CalendarDisplay.push(<CalendarSquare key={i} setDaySelected={setDaySelected} dayNumberSelected={dayNumberSelected} dayNumber={i+1} calendarInfo={currCalendar[i]}/>);
    }

    return (
    <>
        {dayNumberSelected ? <AddCropPopUp seasonIndex = {seasonIndex} cropEdit={cropEdit} setCropEdit={setCropEdit} setDaySelected={setDaySelected} dayNumber={dayNumberSelected} season={userOptions.season} cropData={cropData} calendarSquares={wholeCalendar} setCalendarSquares={setWholeCalendar} fertilizerData={fertilizerData} userOptions={userOptions}/> 
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

function possibleSellMethods (crop) {
    // determines possible methods of selling (either keg/preserve) and also determines what it will be (Wine/Juice or Pickel/Jam)
    if (crop.cropType === "flower") return []; // no possible 
    const kegOnly = ["hops", "coffee_bean"];
    if (kegOnly.includes(crop.name)) {
        return <option key={"keg"} value={"keg"}>Keg</option>;
    }
    return <><option key={"keg"} value={"keg"}>Keg</option><option key={"preserves"} value={"preserves"}>Preserves</option></>;
}


// popup display
function AddCropPopUp ({seasonIndex, cropEdit, setCropEdit, setDaySelected, dayNumber, season, cropData, calendarSquares, setCalendarSquares, fertilizerData, userOptions}) {
    const [cropSelected, setCropSelected] = useState(0); // CROP ID, makes searching cropData much faster
    const [numberOfCrops, setNumCrops] = useState(1);
    const [fertSelected, setFertSelected] = useState(0); // FERTILIZER ID, auto chooses no fertilizer (if select value == 0 then none was chosen)
    const [prepMethod, setPrepMethod] = useState("normal"); // "normal"/"keg"/"preserves"
    
    useEffect (() => {
        if (cropEdit) {  // add cropEditData if it exists
            setCropSelected(cropEdit.crop.id);
            setNumCrops(cropEdit.numberPlanted);
            setFertSelected(cropEdit.fertilizer?.id);    
        }

    }, [cropEdit]);

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
                <input id="number_of_crops" type="number" min="1" step="1" value={numberOfCrops} onChange={(e) => setNumCrops(parseInt(e.target.value) || 1)}/> 

                <select id="fertilizer-select" value={fertSelected} onChange={(e) => setFertSelected(parseInt(e.target.value))}>
                    <option key={"none"} value={0}>None</option>
                    {fertilizerOptions}
                </select>

                <select id="sell-type-select" value={prepMethod} onChange={(e) => setPrepMethod(e.target.value)}>
                    <option key={"normal"} value={"normal"}>Normal</option>
                    {cropSelected ? possibleSellMethods(cropData.find(crop=>{return crop.id===cropSelected})) : <></>}
                </select>

                
                <button id="add-crop-btn" onClick ={() => {
                // reset prep UI immediately
                setPrepMethod("normal");

                
                    // shallow-copy seasons/days and inner arrays so we mutate safely
                addAndEditFunctions(dayNumber, 
                    cropData.find(c => c.id===cropSelected), 
                    numberOfCrops, 
                    fertilizerData.find(f => f.id === fertSelected), 
                    prepMethod, 
                    calendarSquares, 
                    userOptions, 
                    seasonIndex, 
                    cropEdit,
                    setCalendarSquares);
                    
                 

                // reset UI state after update
                setCropEdit(null);
                setCropSelected(0);
                setNumCrops(1);
                setFertSelected(0);
                setDaySelected(null);
                }}>
                    
                {cropEdit ? "Save Edit" : "Add Crop"}
                
                </button>
            </div>

            <div id="existing-crops-popup">
                <p>Planted Crops:</p>
                <table id="planted-table-popup">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th># Planted</th>
                            <th>Fertilizer/Speed Gro</th>
                            <th>Total Cost</th>
                            <th>Time to Grow</th>
                            <th># of harvests</th> 
                            <th>Processing Method</th>
                            <th>Processing Time</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {DisplayPlantedCrops(setCalendarSquares, setCropSelected, setNumCrops, setFertSelected, cropEdit, setCropEdit, calendarSquares, seasonIndex, dayNumber, userOptions)}
                    </tbody>
                </table>
                <p>Harvested Crops:</p>
                <table id="harvest-table-popup">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th># Yield</th>
                                <th>$ Earned</th>
                                <th>$ Profit</th>
                                <th>Fertilizer</th>
                                <th>Time to Regrow</th>
                                <th>Processing Method</th>
                                <th>Processing Time</th>
                            </tr>
                        </thead>

                        <tbody>
                            {DisplayHarvestedCrops(calendarSquares[seasonIndex], dayNumber, userOptions)}
                        </tbody>
                </table>

            </div>

        </div>
    </>

    // IMPLEMENT METHOD OF SELLING LATER
    );
}

// Returns a new version of the calendarsquares given (applies edit AND delete crop on same version of newSquares)
function addAndEditFunctions (dayNumber, crop, numberOfCrops, fertilizerType, prepType, calendarSquares, userOptions, seasonIndex, cropEdit, setCalendarSquares) {
    let newSquares = [...calendarSquares];

    if (cropEdit) { // delete crop selected first if editing
        newSquares=newSquares.map((season) => {
            return season.map(square => {
                const newPlanted = square.planted_crops.filter((crop) => crop.plant_harvest_id !== cropEdit.plant_harvest_id);
                const newHarvest = square.harvest_crops.filter((crop) => crop.plant_harvest_id !== cropEdit.plant_harvest_id);

                return {...square, planted_crops: newPlanted, harvest_crops: newHarvest};
            });
        })
    }

    const BaseSell = calculatePrepTypeSellVal(crop, prepType, userOptions);
    const newPlantAdd = {
        crop: crop,
        dayPlanted: dayNumber,
        numberPlanted: numberOfCrops,
        fertilizer: fertilizerType,
        id: `${seasonIndex}-plant-${dayNumber}-${calendarSquares[seasonIndex][dayNumber-1].planted_crops.length}-${plantPairID}`,
        plant_harvest_id: plantPairID,
        prepType: prepType,
        processingTime: BaseSell.time
    }; // data for new plant added (planting)
    const {farmingLevel, tillerProf} = userOptions;
    const sellValue = prepType !== "normal" ? BaseSell.sellPrice * numberOfCrops : Math.floor(priceCalculate(BaseSell.sellPrice, numberOfCrops, farmingLevel, fertilizerType, tillerProf));
    const newHarvestAdd = {
        crop: crop,
        numberPlanted: numberOfCrops,
        dayPlanted: dayNumber,
        fertilizer: fertilizerType,
        total_earned: sellValue,
        profit: sellValue-crop.seed_price*numberOfCrops,
        id: `${seasonIndex}-harvest-${dayNumber}-${calendarSquares[seasonIndex][dayNumber-1].planted_crops.length}-${plantPairID}`,
        plant_harvest_id: plantPairID,
        prepType: prepType,
        cropType: BaseSell.name,
        processingTime: BaseSell.time
    }; // to be displayed in popup
    plantPairID++; 

    // Add crop section
    const seasons = ["spring", "summer", "fall", "winter"];
    let currSeasonIndex = seasonIndex;
    // INSTEAD OF CREATING NEW SQUARES HERE USE PAST USESQUARES WHERE THE CROP WAS DELETED
    const newPlantSquare = {...newSquares[currSeasonIndex][dayNumber-1]}; // first day to plant
    newPlantSquare.planted_crops = [...newPlantSquare.planted_crops, newPlantAdd];
    newSquares[currSeasonIndex][dayNumber-1] = newPlantSquare;

    const {daysToGrow, regrowth} = newPlantAdd.crop;
    const {season} = crop; // all seasons crop can grow in
    
    const availableSeasons = season.slice(season.indexOf(seasons[seasonIndex]));
    
    let daysToFirstGrow = daysToGrow;
    if (fertilizerType && fertilizerType.type === "speed_grow") {
        daysToFirstGrow = Math.floor(daysToFirstGrow*fertilizerType.multiplier);
    }

    if (userOptions.agricProf) {
        daysToFirstGrow = Math.floor(daysToFirstGrow*0.9);
    }

    let dayCounter = daysToFirstGrow + dayNumber - 1;

    if (dayCounter > 27 && availableSeasons.length < 2) {
        setCalendarSquares(newSquares);
        return;
    }

    if (dayCounter > 27) {
        currSeasonIndex++;
        availableSeasons.shift(); // shift focus on next season
    }

    dayCounter = dayCounter % 28; // ensure not out of bounds

    const newHarvestSquare = {...newSquares[currSeasonIndex][dayCounter]};
    newHarvestSquare.harvest_crops = [...newHarvestSquare.harvest_crops, newHarvestAdd];
    newSquares[currSeasonIndex][dayCounter] = newHarvestSquare;

    if (regrowth) {
        dayCounter += regrowth;
        while (dayCounter <= 27) {
            const regrowthSquare = {...newSquares[currSeasonIndex][dayCounter]};
            regrowthSquare.harvest_crops = [...regrowthSquare.harvest_crops, newHarvestAdd];
            newSquares[currSeasonIndex][dayCounter] = regrowthSquare;
            dayCounter += regrowth;
            if (dayCounter > 27 && availableSeasons.length > 1) {
                // available season to go into
                currSeasonIndex++;
                dayCounter = dayCounter % 28;
                availableSeasons.shift();
            }
        }
    }
    setCalendarSquares(newSquares);
}
// to be added within the table
function DisplayPlantedCrops (setCalendarSquares, setCropSelected, setNumCrops, setFertSelected, cropEdit, setCropEdit, calendarSquares, seasonIndex, dayNumber, userOptions) {
    const displayRows = [];

    const dayData = calendarSquares[seasonIndex][dayNumber - 1].planted_crops;
    for (const cropData of dayData) {
        const totalPrice = `$${cropData.numberPlanted * cropData.crop.seed_price}`; // for that speicifc crop, will do output calculations in output calcution
        let newDaysToGrow = cropData.crop.daysToGrow;
        if (cropData.fertilizer && cropData.fertilizer.type ==="speed_grow") {
            // speed gro
            const {multiplier} = cropData.fertilizer;
            newDaysToGrow = Math.floor(newDaysToGrow*multiplier);
        }
        if (userOptions.agricProf) {
            newDaysToGrow = Math.floor(newDaysToGrow*0.9);
        }
        let harvests = calculateRegrowthDays(cropData, dayNumber);
        
        displayRows.push(
            <tr id="plant-data-popup" key={`planted-${dayNumber}-${cropData.id}-0`}>
                <td>{nameNormalizer(cropData.crop.name)}</td>
                <td>{cropData.numberPlanted}</td>
                <td>{cropData.fertilizer?nameNormalizer(cropData.fertilizer.name):"None"}</td>
                <td>{Math.round(totalPrice)}</td>
                <td>{newDaysToGrow}</td>
                <td>{harvests}</td>
                <td>{nameNormalizer(cropData.prepType)}</td>
                <td>{cropData.processingTime ? `${cropData.processingTime} Days` : "None"}</td>
                <td><button onClick={() => {
                    deletePlant(cropData.plant_harvest_id, setCalendarSquares, setCropEdit)
                    // reset local state if needed
                    setCropSelected(0);
                    setNumCrops(1);
                    setFertSelected(0);
                    setCropEdit(null);
                    }} key={`delete-btn-${cropData.id}`}>DELETE</button></td>
                <td><button onClick={() => cropEdit ? setCropEdit(null) : setCropEdit(cropData)} key={`edit-btn-${cropData.id}`}>{cropEdit ? "STOP EDIT" : "EDIT"}</button></td>
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
// DELETE BUTTON FUNCTION (CAN MAKE MORE EFFICIENT)
function deletePlant(plantHarvestId, setCalendarSquares, setCropEdit) {
    setCropEdit(null); // stop editing crop if delete
    

    setCalendarSquares(prev => {
        const newCalendar = prev.map(season =>
            season.map(square => {
                const newPlanted = square.planted_crops.filter(plant => plant.plant_harvest_id !== plantHarvestId);
                const newHarvested = square.harvest_crops.filter(plant => plant.plant_harvest_id !== plantHarvestId);
            // If nothing changed, return same square reference to avoid over-rendering

                return {...square, planted_crops:newPlanted, harvest_crops:newHarvested};
            })
            
        );
        return [...newCalendar];
    });
}

function DisplayHarvestedCrops (calendarSquares, dayNumber, userOptions) {
    const displayRows = [];
    const dayData = calendarSquares[dayNumber - 1].harvest_crops;
    for (const cropData of dayData) {
        displayRows.push(
            <tr key={`harvested-${dayNumber}-${cropData.id}-0`}>
                <td>{nameNormalizer(cropData.cropType)}</td>
                <td>{cropData.numberPlanted}</td>
                <td>{Math.round(cropData.total_earned)}</td>
                <td>{Math.round(cropData.profit)}</td>
                <td>{cropData.fertilizer ? nameNormalizer(cropData.fertilizer.name) : "None"}</td>
                <td>{cropData.crop.regrowth?cropData.crop.regrowth:"N/A"}</td>
                <td>{nameNormalizer(cropData.prepType)}</td>
                <td>{cropData.processingTime ? `${cropData.processingTime} Days` : "None"}</td>
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
let plantPairID = 0; // for delete function, to be able to delete planted/harvest groups quickly

// Returns new object containing information about the price and what type of artisan good it will become
function calculatePrepTypeSellVal (crop, prepType, userOptions) {
    const {name, sellPrices:{default:price}, cropType} = crop;
    const {artisanProf} = userOptions; // +40% to artisan goods
    const mul = artisanProf ? 1.4 : 1;
    if (prepType === "normal") {
        return {sellPrice: price, name: name, time: 0};
    }
    
    // Special crops
    if (prepType==="keg" && name==="wheat") {
        return {sellPrice: 200, name: "beer", time: 2};
    }
    if (prepType==="keg" && name==="hops") {
        return {sellPrice: 300, name: "pale_ale", time: 2};
    }
    if (prepType==="keg" && name==="coffee_bean") {
        return {sellPrice: 150, name: "coffee", time: 0};
    }

    if (prepType==="keg" && cropType==="fruit") {
        // wine
        return {sellPrice: price*3*mul, name: `${name}_wine`, time: 6};
    }
    if (prepType==="keg" && cropType==="vegetable") {
        return {sellPrice: price*2.25*mul, name: `${name}_juice`, time: 4}; 
    }
    if (prepType==="preserves") {
        return {sellPrice: (2*price+50)*mul, name: `${name}_${cropType==="fruit" ? "jelly" : "pickel"}`, time: 2}; 
    }

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