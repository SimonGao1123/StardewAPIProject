import './App.css';
import { useEffect, useState } from "react";
export default function Calendar ({calendarSquares, setCalendarSquares, userOptions, setUserOptions, cropData, sprinklerData, fertilizerData}) {

    return <AddCropPopUp dayNumber={1} season={userOptions.season} cropData={cropData} fertilizerData={fertilizerData}/>
    // TEST ONLY FOR DAY 1 CALENDAR SQUARE SO FAR
}

// overlay when clicked on a calendar square
function CalendarDayOverlay () {

}

function AddCropPopUp ({dayNumber, season, cropData, calendarSquares, setCalendarSquares, fertilizerData}) {
    const [cropSelected, setCropSelected] = useState(0); // CROP ID, makes searching cropData much faster
    const [numberOfCrops, setNumCrops] = useState(1);
    const [fertSelected, setFertSelected] = useState(0); // FERTILIZER ID, auto chooses no fertilizer (if select value == 0 then none was chosen)

    const fertilizerOptions = [];
    for (const fertilizer of fertilizerData) {
        fertilizerOptions.push(
            <option key={fertilizer.name} value={fertilizer.id}>{nameNormalizer(fertilizer.name)}</option>
        );
    }
    return (
    <>
        <div id="add-crop-popup">
            <SelectCropType season={season} cropData={cropData} setCropSelected={setCropSelected} cropSelected={cropSelected}/>
            <label htmlFor="number_of_crops">Number of Crops</label>
            <input id="number_of_crops" type="number" min="1" step="1" value={numberOfCrops} onChange={(e) => setNumCrops(parseInt(e.target.value))}/> 

            <select id="fertilizer-select" value={fertSelected} onChange={(e) => setFertSelected(parseInt(e.target.value))}>
                <option key={"null"} value={0}>None</option>
                {fertilizerOptions}
            </select>

            <button id="add-crop-btn" onClick ={() => addCropCalendarSquare(
                dayNumber, 
                cropData[cropSelected-1], 
                numberOfCrops, 
                fertSelected ? fertilizerData[fertSelected-1] : null, 
                null, 
                calendarSquares, 
                setCalendarSquares)}>Add Crop</button>
        </div>
    </>

    // IMPLEMENT METHOD OF SELLING LATER
    );
}
const addCropCalendarSquare = (dayNumber, crop, numberOfCrops, fertilizerType, prepType, calendarSquares, setCalendarSquares) => {
    // WILL ADD PREP TIME LATER
    const newPlantAdd = {
        crop: crop,
        dayPlanted: dayNumber,
        numberPlanted: numberOfCrops,
        fertilizer: fertilizerType
    }; // data for new plant added (planting)
    /*
    crop = object, from cropData 
    dayPlanted = integer (day crop was initially planted)
    numberPlanted = integer (# of crops planted)
    fertilizer = object, from fertilizerData
    */  

    
    console.log (newPlantAdd); // TESTING, add calendar square representing day 1 

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
        listOfPossible.push(<option value={plant.id} key={plant.name}>{nameNormalizer(plant.name)}</option>);
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