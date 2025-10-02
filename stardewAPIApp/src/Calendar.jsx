import './App.css';

export default function Calendar ({calendarSquares, setCalendarSquares, userOptions, setUserOptions, cropData}) {
    return <SelectCropType season={userOptions.season} cropData={cropData}/>
}

// overlay when clicked on a calendar square
function CalendarDayOverlay () {

}
function SelectCropType ({season, cropData}) {
    // return all crops with correct season
    const possiblePlants = cropData.filter((crop) => {
        return crop.season.includes(season);
    });
    console.log("POSSIBLE PLANS");
    console.log(possiblePlants);

    
    const nameNormalizer = (name) => {
        return name.split("_").map((word) => {
            return word.toUpperCase();
        }).join(" ");
    }
    const listOfPossible = [];
    for (const plant of possiblePlants) {
        listOfPossible.push(<option value={plant.name} key={plant.name}>{nameNormalizer(plant.name)}</option>);
    }
    return (
        <select id="crop_selection">
            {listOfPossible}
        </select>
    )

}
