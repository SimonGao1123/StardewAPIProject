import { useEffect, useState } from 'react';
import './App.css';
import Calendar from './Calendar.jsx'
import InputSection from './InputSection.jsx'
import OutputSection from './OutputSection.jsx';
import buyPrices from './extra-data/seedPrices.jsx';
import fertilizerData from './extra-data/fertilizerData.jsx';
import sprinklerData from './extra-data/sprinklerData.jsx';

const defaultOptions = {
  // default states for user options in inputSection:
    season: "spring",
    farmingLevel: 1,
    sprinklers: {
      normal: 0,
      quality: 0,
      iridium: 0
    },
    tillerProf: false,
    artisanProf: false,
    kegs: 0,
    preservesJars: 0
};

// =========TODO=========
const defaultCalendarSquare = {
  planted_crops: [],
  harvest_crops: [],
}; 


const calendarArray = Array.from({length: 28}, (_, index)=>({...defaultCalendarSquare, id: index})); // holds all 28 squares for a season
export default function App () {
  // test fetching the entire API works for: https://stardewapi.co/api/crops
  const [cropData, setCropData] = useState([]);
  
  useEffect(() => { // use effect only runs ONCE due to empty array dependency
    fetch("https://stardewapi.co/api/crops")
    .then (response => {
      // received response from the promise, first check if response is valid and then turn to json to be readable
      if (!response.ok) {
        throw new Error ("Error in obtaining Response");
      }
      return response.json(); // convert to json
    })
    .then (data => {
      // obtain response.json as data
      const combinedData = data.map((plant, index) => {
        return {...plant, seed_price: buyPrices[index+1]};
      }); // adds buy prices to seeds
      setCropData(combinedData); // set the crop data to data
      console.log(combinedData);
    })
    .catch (error => {
      console.log("Error: " + error); // catch and log any errors
    })
  }, []);

  // INPUT SECTION USESTATE
  const [userOptions, setUserOptions] = useState(() => {
    const savedOptions = localStorage.getItem("user_options");
    return savedOptions ? JSON.parse(savedOptions) : defaultOptions;
  }); // holds all the data the user selected in InputSection (takes from local storage if prev saved)
  
  useEffect(() => {
    localStorage.setItem("user_options", JSON.stringify(userOptions)); // saves user options in local storage
  }, [userOptions]); // only save if user options had changed
  // basically useEffect does:
    // it will only run the code in its body if the items in the array given as 2nd parameter had CHANGED from the LAST RENDER 
  
  
  // CALENDAR USESTATE for all seasons
  const [springCalendarSquares, setSpringSquares] = useState(() => {
    const savedCalendar = localStorage.getItem("spring_calendar_squares");
    return savedCalendar ? JSON.parse(savedCalendar) : [...calendarArray];
  }); // holds all the squares (28 in total) for the days in the month (each square is an object with data)
  
  const [summerCalendarSquares, setSummerSquares] = useState(() => {
    const savedCalendar = localStorage.getItem("summer_calendar_squares");
    return savedCalendar ? JSON.parse(savedCalendar) : [...calendarArray];
  });
  const [fallCalendarSquares, setFallSquares] = useState(() => {
    const savedCalendar = localStorage.getItem("fall_calendar_squares");
    return savedCalendar ? JSON.parse(savedCalendar) : [...calendarArray];
  });
  const [winterCalendarSquares, setWinterSquares] = useState(() => {
    const savedCalendar = localStorage.getItem("winter_calendar_squares");
    return savedCalendar ? JSON.parse(savedCalendar) : [...calendarArray];
  });

  useEffect(() => {
    localStorage.setItem("spring_calendar_squares", JSON.stringify(springCalendarSquares));
    localStorage.setItem("summer_calendar_squares", JSON.stringify(summerCalendarSquares));
    localStorage.setItem("fall_calendar_squares", JSON.stringify(fallCalendarSquares));
    localStorage.setItem("winter_calendar_squares", JSON.stringify(winterCalendarSquares));
  }, [springCalendarSquares, summerCalendarSquares, fallCalendarSquares, winterCalendarSquares]); // add to localstorage if calendar has changed  

  console.log(springCalendarSquares); // TESTING CALENDAR SECTION
  console.log(summerCalendarSquares); // TESTING CALENDAR SECTION
  console.log(fallCalendarSquares); // TESTING CALENDAR SECTION
  console.log(winterCalendarSquares); // TESTING CALENDAR SECTION

  function correctSquaresSelection () {
    switch (userOptions.season) {
      case "spring":
        return springCalendarSquares;
      case "summer":
        return summerCalendarSquares;
      case "fall":
        return fallCalendarSquares;
      case "winter":
        return winterCalendarSquares;
      default:
        console.log("Error in season selection");
    }
  }
  function correctSetSquaresSelection () {
    switch (userOptions.season) {
      case "spring":
        return setSpringSquares;
      case "summer":
        return setSummerSquares;
      case "fall":
        return setFallSquares;
      case "winter":
        return setWinterSquares;
      default:
        console.log("Error in season selection");
    }
  }
  return (
    <>
      <InputSection calendarSquares={correctSquaresSelection()} userOptions={userOptions} setUserOptions={setUserOptions}/>
      <Calendar calendarSquares={correctSquaresSelection()} setCalendarSquares={correctSetSquaresSelection()} userOptions={userOptions} cropData={cropData} sprinklerData={sprinklerData} fertilizerData={fertilizerData}/>
      <OutputSection cropData={cropData} sprinklerData={sprinklerData} fertilizerData={fertilizerData} userOptions={userOptions} calendarSquares={correctSquaresSelection()}/>
      <button onClick={()=>{
        localStorage.clear();
        window.location.reload(); // clears local storage and reloads window
        }}>RESET</button>
    </>
  );
} 
