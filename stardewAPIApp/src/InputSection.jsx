import './App.css';
import { use, useEffect, useState } from 'react';

export default function InputSection ({currCalendar, wholeCalendar, userOptions, setUserOptions}) {
    // input section for all default options (how to calculate)
    return (
        <>
            <div className="input-section-container" id="seasonSelection">
                <SeasonSelection userOptions={userOptions} setUserOptions={setUserOptions}/>
            </div>

            <div className="input-section-container" id="farmingLevelSelection">
                <FarmingLevelSelect userOptions={userOptions} setUserOptions={setUserOptions}/>
            </div>

            <div className="input-section-container" id="professionSelection">
                <ProfessionSelection userOptions={userOptions} setUserOptions={setUserOptions}/>
            </div>

            <div className="input-section-container" id="sprinklerSelection">
                <SprinklerSelect currCalendar={currCalendar} userOptions={userOptions} setUserOptions={setUserOptions}/>
            </div>

            <div className="input-section-container" id="kegspreservesSelection">
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
function SprinklerSelect ({currCalendar, userOptions, setUserOptions}) {
    function calculateTotalCrops(currCalendar) {
        if (!currCalendar || !Array.isArray(currCalendar)) return 0;
        return currCalendar.reduce((acc, currSquare) => {
            return acc + (currSquare.planted_crops?.reduce((crops, crop) => crops + (crop.numberPlanted || 0), 0) || 0);
        }, 0);
    }
    const totalCrops = calculateTotalCrops(currCalendar);

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
            setUserOptions({...userOptions, sprinklers: {normal: Math.ceil(totalCrops/4), quality: 0, iridium: 0}})}
        }>
        Normal Sprinklers</button>
        <button value="quality"
        onClick={()=>{
            setUserOptions({...userOptions, sprinklers: {normal: 0, quality: Math.ceil(totalCrops/8), iridium: 0}})}
        }>
        Quality Sprinklers</button>
        <button value="iridium"
        onClick={()=>{
            setUserOptions({...userOptions, sprinklers: {normal: 0, quality: 0, iridium: Math.ceil(totalCrops/24)}})} // sets all others to 0
        }>
        Iridium Sprinklers</button>
    </>
    );
}

// selection if user has tiller and/or artisan profession (saves into userOption object)
function ProfessionSelection ({userOptions, setUserOptions}) {
    if (userOptions.farmingLevel < 5 && userOptions.tillerProf) {
        setUserOptions({...userOptions, tillerProf: false});
    }
    if (userOptions.farmingLevel < 10 && (userOptions.agricProf || userOptions.artisanProf)) {
        setUserOptions({...userOptions, agricProf: false, artisanProf: false});
    }

    return (
        <>
            {userOptions.farmingLevel >= 5 && (
                <div className="profession-option">
                    <input id="tiller-profession" type="checkbox" checked={userOptions.tillerProf}
                    onChange={(e) => {
                        setUserOptions({...userOptions, tillerProf: e.target.checked});
                    }}/>
                    <label htmlFor="tiller-profession">Tiller Profession (+10% Sell Value for Crops)</label>
                </div>
            )}
            
            {userOptions.farmingLevel === 10 && (
                <>
                    <div className="profession-option">
                        <input id="artisan-profession" type="radio" name="artisan-or-agriculture" checked={userOptions.artisanProf}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setUserOptions({...userOptions, agricProf: false, artisanProf: true});
                            }
                        }}/>
                        <label htmlFor="artisan-profession">Artisan Profession (+40% Sell Value for Wine/Jam/Pickels)</label>
                    </div>

                    <div className="profession-option">
                        <input id="agriculture-profession" type="radio" name="artisan-or-agriculture" checked={userOptions.agricProf}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setUserOptions({...userOptions, agricProf: true, artisanProf: false});
                            }
                        }}/>
                        <label htmlFor="agriculture-profession">Agriculturist Profession (-10% growth time)</label>
                    </div>

                    <div className="profession-option">
                        <input id="none-profession" type="radio" name="artisan-or-agriculture" checked={!userOptions.agricProf && !userOptions.artisanProf}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setUserOptions({...userOptions, agricProf: false, artisanProf: false});
                            }
                        }}/>
                        <label htmlFor="none-profession">None</label>
                    </div>
                </>
            )}
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