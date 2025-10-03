import './App.css';
import { use, useState } from 'react';

export default function InputSection ({userOptions, setUserOptions}) {
    // input section for all default options (how to calculate)
    return (
        <>
            <div class="input-section-container" id="seasonSelection">
                <SeasonSelection userOptions={userOptions} setUserOptions={setUserOptions}/>
            </div>

            <div class="input-section-container" id="farmingLevelSelection">
                <FarmingLevelSelect userOptions={userOptions} setUserOptions={setUserOptions}/>
            </div>

            <div class="input-section-container" id="sprinklerSelection">
                <SprinklerSelect userOptions={userOptions} setUserOptions={setUserOptions}/>
            </div>

            <div class="input-section-container" id="professionSelection">
                <ProfessionSelection userOptions={userOptions} setUserOptions={setUserOptions}/>
            </div>

            <div class="input-section-container" id="kegspreservesSelection">
                <KegsAndPreservesSelection userOptions={userOptions} setUserOptions={setUserOptions}/>
            </div>
        </>
    );
}
function SeasonSelection ({userOptions, setUserOptions}) {
    return (
        <>
            <label htmlFor="season-select">Select Season</label>
            <select id="season-select" onChange={(e)=>{
                const tempOptionCopy = {...userOptions, season:e.target.value};
                setUserOptions(tempOptionCopy);
            }} value={userOptions.season}>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
            </select>
        </>
    );
}

function FarmingLevelSelect ({userOptions, setUserOptions}) {
    return (
        <>
            <label htmlFor="farming-level-select">Farming Level: </label>
            <input id="farming-level-select" type="range" min="1" max="10" value={userOptions.farmingLevel} step="1"
            onChange={(e) => updateFarmingLevel(parseInt(e.target.value), userOptions, setUserOptions)}/>
            <span id="farming-level-value">{userOptions.farmingLevel}</span>
        </>
    );
    function updateFarmingLevel (newFarmLevel, userOptions, setUserOptions) {
        const tempOptionCopy = {...userOptions, farmingLevel:newFarmLevel};
        setUserOptions(tempOptionCopy); // updates userOptions object
    }
}


// TODO: 
// - cannot do without access to calendar input information (FIRST DO CALENDAR)
// - need to update materials list for output object
// TEMPORARY: THE AUTOFILL BUTTON JUST SETS 100 TO SELECTED  QUALITY (needs to take total # of crops and divide by respective sprinkler water yield)
function SprinklerSelect ({userOptions, setUserOptions}) {
    const normalSprinklerYield = 4; // waters 4 plants PER sprinklers
    const qualitySprinklerYield = 8; // waters 8 plants PER sprinklers
    const iridiumSprinklerYield = 24; // waters 24 plants PER sprinklers

    return (
    <>
        <p>Number of Sprinklers Used:</p>
        <label htmlFor="normal-sprinklers">Normal: </label>
        <input id="normal-sprinklers" type="number" min="0" step="1" value={userOptions.sprinklers.normal}
        onChange={(e) => setUserOptions({...userOptions, sprinklers: {...userOptions.sprinklers, normal: parseInt(e.target.value)}})}/>

        <label htmlFor="quality-sprinklers">Quality: </label>
        <input id="quality-sprinklers" type="number" min="0" step="1" value={userOptions.sprinklers.quality}
        onChange={(e) => setUserOptions({...userOptions, sprinklers: {...userOptions.sprinklers, quality: parseInt(e.target.value)}})}/>

        <label htmlFor="iridium-sprinklers">Iridium: </label>
        <input id="iridium-sprinklers" type="number" min="0" step="1" value={userOptions.sprinklers.iridium}
        onChange={(e) => setUserOptions({...userOptions, sprinklers: {...userOptions.sprinklers, iridium: parseInt(e.target.value)}})}/>


        {/* ---------AUTO FILL BUTTON SECTION--------- */}

        <p>AutoFill Sprinkler Count?</p>
        <button value="normal" 
        onClick={()=>{
            const newSprinklerCount = 100; // TEMPORARY (BUTTON SHOULD JUST TAKE # CROPS/SPRINKLER YIELD)
            setUserOptions({...userOptions, sprinklers: {normal: newSprinklerCount, quality: 0, iridium: 0}})}
        }>
        Normal Sprinklers</button>
        <button value="quality"
        onClick={()=>{
            const newSprinklerCount = 100; // TEMPORARY (BUTTON SHOULD JUST TAKE # CROPS/SPRINKLER YIELD)
            setUserOptions({...userOptions, sprinklers: {normal: 0, quality: newSprinklerCount, iridium: 0}})}
        }>
        Quality Sprinklers</button>
        <button value="iridium"
        onClick={()=>{
            const newSprinklerCount = 100; // TEMPORARY (BUTTON SHOULD JUST TAKE # CROPS/SPRINKLER YIELD)
            setUserOptions({...userOptions, sprinklers: {normal: 0, quality: 0, iridium: newSprinklerCount}})} // sets all others to 0
        }>
        Iridium Sprinklers</button>
    </>
    );
}

// selection if user has tiller and/or artisan profession (saves into userOption object)
function ProfessionSelection ({userOptions, setUserOptions}) {
    return (
        <>
            <label htmlFor="tiller-profession">Tiller Profession (+10% Sell Value for Crops)</label>
            <input id="tiller-profession" type="checkbox" checked={userOptions.tillerProf}
            onChange={(e) => {
                setUserOptions({...userOptions, tillerProf: e.target.checked});
            }}/>

            <label htmlFor="artisan-profession">Artisan Profession (+40% Sell Value for Wine/Jam/Pickels)</label>
            <input id="artisan-profession" type="checkbox" checked={userOptions.artisanProf}
            onChange={(e) => {
                setUserOptions({...userOptions, artisanProf: e.target.checked});
            }}/>
        </>
    );
       
}

// TODO: ADD MATERIALS TO MAKE KEGS/ALCOHOL
function KegsAndPreservesSelection ({userOptions, setUserOptions}) {
    return (
        <>
            <label htmlFor="keg-count">Number of Available Kegs</label>
            <input id="keg-count" value={userOptions.kegs} type="number" min="0"
            onChange={(e) => setUserOptions({...userOptions, kegs: parseInt(e.target.value)})}/>

            <label htmlFor="preserves-count">Number of Available Preserves Jars</label>
            <input id="preserves-count" value={userOptions.preservesJars} type="number" min="0"
            onChange={(e) => setUserOptions({...userOptions, preservesJars: parseInt(e.target.value)})}/>
        </>
    );
}