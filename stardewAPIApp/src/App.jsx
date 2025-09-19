import { useEffect, useState } from 'react';
import './App.css';

export default function App () {
  // test fetching the entire API works for: https://stardewapi.co/api/crops
  const [cropData, setCropData] = useState([]);
  
  useEffect(() => {
    fetch("https://stardewapi.co/api/crops")
    .then((response) => {
      if (!response.ok) {
        throw new Error ("Error in obtaining response");
      }
      return response.json();
    })
    .then((data) => {
      setCropData(data);
    })
    .catch(error => {
      console.log("Error: " + error);
    })
  }, []);
  console.log(cropData);
} 