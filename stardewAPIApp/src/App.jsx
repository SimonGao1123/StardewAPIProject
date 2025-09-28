import { useEffect, useState } from 'react';
import './App.css';
import Calendar from './Calendar.jsx'
import InputSection from './InputSection.jsx'
import OutputSection from './OutputSection.jsx';


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
      setCropData(data); // set the crop data to data
    })
    .catch (error => {
      console.log("Error: " + error); // catch and log any errors
    })
  }, []);
  console.log(cropData); // testing purposes


  const [userOptions, setUserOptions] = useState({}); // holds all the data the user selected in InputSection 
  const [calendarSquares, setCalendarSquares] = useState([]); // holds all the squares (28 in total) for the days in the month (each square is an object with data)
  const [currentOutputData, setOutputData] = useState({}); // holds all relevent output data to be displayed in output section (altered throughout calendar section)
  return (
    <>
      <InputSection userOptions={userOptions} setUserOptions={setUserOptions}/>
      <Calendar/>
      <OutputSection/>
    </>
  );
} 