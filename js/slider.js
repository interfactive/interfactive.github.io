var slider = document.getElementById("portionChanger");

var nutrients = [
    "numCalories",
    "numFat",
    "numSaturated-Fat",
    "numTrans-Fat",
    "numMonounsaturated-Fat",
    "numCholesterol",
    "numSodium",
    "numCarbs",
    "numFiber",
    "numSugars",
    "numAdded-Sugars",
    "numProtein",
    "numVitamin-D",
    "numCalcium",
    "numIron",
    "numPotassium",
];

var nutrientVars = {};
addNewNutrientValue("numCups");

console.log(nutrientVars["numCups"]["value"]);

nutrients.forEach((nutrient) => {
    addNewNutrientValue(nutrient);
});

// Source: https://www.myfooddata.com/articles/recommended-daily-intakes.php
// Note: Fooducate seems to have a lower addede sugar threshold? need to check

updateThresholds("numCalories", 2000, -1, -1, -1, -1, true);

updateThresholds("numFat", 78, -1, -1, -1, -1, false);
updateThresholds("numSaturated-Fat", 20, 0, 23, 23, -1, false);
updateThresholds("numTrans-Fat", -1, 0, -1, 0, -1, false);
updateThresholds("numCholesterol", 300, -1, -1, -1, -1, false);      
updateThresholds("numSodium", 2300, 200, 765, 766, -1, false); // 200, 349, 350
updateThresholds("numCarbs", 300, -1, -1, -1, -1, true);   
updateThresholds("numFiber", 28, 3, -1, 2, 23, true); 
updateThresholds("numSugars", 50, -1, -1, -1, -1, false);
updateThresholds("numAdded-Sugars", -1, -1, -1, 4.8, -1, false);   //20% DV or more of added sugars per serving is considered high; 5% DV or less of added sugars per serving is considered low



updateThresholds("numVitamin-D", 20, -1, -1, 1, 1333, true);        // 4000 / 3
updateThresholds("numCalcium", 1300, -1, -1, 100, 500, true);    // no more than 500 in a single dose
updateThresholds("numIron", 18, -1, -1, 0.9, 20, true);          // 20mg (~70/3) is considered a high dose at once (NHS UK - https://www.nhs.uk/conditions/vitamins-and-minerals/iron/)
updateThresholds("numPotassium", 4700, -1, -1, 200, -1, true);    //A food that is considered “high-potassium” generally has 200 mg or more potassium per serving    


// Set default numCups as slider's value (and use two decimal places)
nutrientVars["numCups"]["element"].innerHTML = (Math.round(slider.value * 100) / 100).toFixed(2);

// update background color for portion
// updateColor("numCups", nutrientVars["numCups"]["value"], 1, -1, 1);

// update background color for each nutrient
nutrients.forEach((nutrient) => {
    updateColorNutrient(nutrient);    
});

updateGuidanceBox()


function addNewNutrientValue(nutrientName){    
    let nutrientElement = document.getElementById(nutrientName);
    let nutrientVal = nutrientElement.innerHTML;
    
    nutrientVars[nutrientName] = {
        "element": nutrientElement,
        "value": nutrientVal,           // value for 1 cup

        "actualValue": nutrientVal,     // current adjusted value

        // affects background color via updateColor().
        "min": -1,
        "mid": -1,
        "max": -1,
        "upperMax": -1,

        "isHealthy": true
    };
}

function updateThresholds(nutrientName, newDailyMax, newMin, newMid, newMax, newUpperMax, newIsHealthy){
    // Daily Percent Max
    nutrientVars[nutrientName]["dailyMax"] = newDailyMax;

    // Background Color Thresholds
    nutrientVars[nutrientName]["min"] = newMin;
    nutrientVars[nutrientName]["mid"] = newMid;
    nutrientVars[nutrientName]["max"] = newMax;
    nutrientVars[nutrientName]["upperMax"] = newUpperMax;
    nutrientVars[nutrientName]["isHealthy"] = newIsHealthy;
}

function updateValueforPortion(nutrientName, newNumCups){    
    let nutrientVal = nutrientVars[nutrientName]["value"];
    let oldNumCups = nutrientVars["numCups"]["value"];

    console.log("nutrient val:" + nutrientVal);
    console.log("old num cups:" + oldNumCups);

    let newNutritionValue = (nutrientVal / oldNumCups) * newNumCups;    
    let roundedResult = Math.round((newNutritionValue + Number.EPSILON) * 100) / 100;

    nutrientVars[nutrientName]["actualValue"] = roundedResult;
    nutrientVars[nutrientName]["element"].innerHTML = roundedResult;   
}

function updatePercentforPortion(nutrientName){
    let dailyMax = nutrientVars[nutrientName]["dailyMax"];   
    if (dailyMax != -1){
        let nutrientElement = document.getElementById(nutrientName);
        let nutrientVal = nutrientElement.innerHTML;         
    
        let newPercent = Math.round(100 * nutrientVal / dailyMax);    
                
        let nutrientPercentElement = document.getElementById("percent" + nutrientName.substring(3));    
        if (nutrientPercentElement != null){
            nutrientPercentElement.innerHTML = newPercent;
        }        
    }
    else{
        console.log("Error: tried to update daily % for nutrient without specified daily % max.");
    }

}

/* 
    If nutrientVal < min, background = green
    else if nutrientVal < mid, background = yellow
    else if nutrientVal >= max, background = pink
*/

function updateColor(nutrientName, nutrientVal, min, mid, max, upperMax, isHealthy){        
    let recommendationElement = document.getElementById("recommendation" + nutrientName.substring(3));
    let newColor = "#fff";
    let newRecommendation = "blank";

    if (min != -1 && nutrientVal <= min) {        
        if (isHealthy){
            newColor = "pink";
            newRecommendation = "warning";  
        } else {
            newColor = "lightgreen";
            newRecommendation = "checkmark";                        
        }
    }   
    else if (mid != -1 && nutrientVal <= mid){        
        newColor = "yellow";
    }
    else if (upperMax != -1 && nutrientVal >= upperMax){
        newColor = "pink";
        newRecommendation = "warning";  
    }
    else if (max != -1 && nutrientVal >= max){        
        if (isHealthy){
            newColor = "lightgreen";  
            newRecommendation = "checkmark";                                 
        } else {
            newColor = "pink";   
            newRecommendation = "warning";                        
        }        
    }

    nutrientVars[nutrientName]["element"].style.backgroundColor = newColor;

    if (recommendationElement != null){
        recommendationElement.innerHTML = "<span class='recommendation-" + newRecommendation + "'></span>";        
    } 
}

function updateColorNutrient(nutrient){
    updateColor(
        nutrient, 
        nutrientVars[nutrient]["element"].innerHTML, 
        nutrientVars[nutrient]["min"], 
        nutrientVars[nutrient]["mid"], 
        nutrientVars[nutrient]["max"],
        nutrientVars[nutrient]["upperMax"],
        nutrientVars[nutrient]["isHealthy"],
    );           
}

function updatePortionVisualCue(newNumCups){
    let description = "";
    let visual = "";    
    
    let numFists = newNumCups;
    let fistFraction = numFists - Math.floor(numFists);
    let fistFractionPercent = 100 - (fistFraction * 100);

    description = "Size of <b style='background:#fff; padding:4px 4px;'>" + numFists + "</b> of your fists";
    
    // let currentFistID = 0;
    let currentFistID = 1;
    // for (currentFistID = 0; currentFistID <= numFists; currentFistID++){               
    for (currentFistID = 1; currentFistID <= numFists; currentFistID++){               
        visual += "<span id='fist-" + currentFistID + "' class='fistful'>✊</span>";  //✊      
    }
    
    if (numFists == 0.5){
        description = "Size of <b style='background:#fff; padding:4px 4px;'>half</b> of your fist"
    }    

    let portionDescription = document.getElementById("portion-description");
    let portionVisual = document.getElementById("portion-visual-cue");
    portionDescription.innerHTML = description;
    portionVisual.innerHTML = visual;

    let lastFist = document.getElementById("fist-" + (currentFistID-1));
    // lastFist.style = "mask-image: linear-gradient(to left, transparent "+ Math.round(fistFractionPercent)+"%, #fff); webkit-mask-image: linear-gradient(to left, transparent "+ Math.round(fistFractionPercent)+"%, #fff);";    
    // lastFist.style["mask-image"] = "linear-gradient(to left, transparent "+ Math.round(fistFractionPercent)+"%, #fff);" 
    // lastFist.style["webkit-mask-image"] = "linear-gradient(to left, transparent "+ Math.round(fistFractionPercent)+"%, #fff);";    
}


function updatePortionVisualCueOld(newNumCups){
    let description = "";
    let visual = "";
    let handfulImage =  "✋";
    // let handfulImage =  "<img src='/assets/handful.png' width=50px>";

    let numHandfuls = newNumCups / 0.5; 
    let numFists = newNumCups;

    description = numHandfuls + " handfuls";
    
    for (let i=1; i<=numHandfuls; i++){
        visual += handfulImage;
    }

    if (numHandfuls <=1 ){
        description = description.slice(0,-1);
        visual = handfulImage;
    }
    
    if (numHandfuls == 0.5){
        description = "Half of a handful"
    }    

    let portionDescription = document.getElementById("portion-description");
    let portionVisual = document.getElementById("portion-visual-cue");
    portionDescription.innerHTML = description;
    portionVisual.innerHTML = visual;
}

function fixNutrientName(nutrient){
    return nutrient.substring(3).replace("-", " ");
}
function updateGuidanceBox(){    
    let guidanceElement = document.getElementById("guidance-box");
    let advice = "<ul>";    

    let newNumCups = (Math.round(slider.value * 100) / 100).toFixed(2);
//     if (newNumCups > 1){
//         advice += "<li><span class='recommendation-warning'></span> Portion size is <b>higher than expected</b>.</li>";
//     }
//     else{
//         advice += "<li>Portion size is reasonable.</li>";
//     }


    nutrients.forEach((nutrient) => {
        let nutrientName = fixNutrientName(nutrient);
        let nutrientActualValue = nutrientVars[nutrient]["actualValue"];

        let nutrientMin = nutrientVars[nutrient]["min"];
        let nutrientMax = nutrientVars[nutrient]["max"];
        let nutrientUpperMax = nutrientVars[nutrient]["upperMax"];        

        if (nutrientVars[nutrient]["isHealthy"]){
            
            if (nutrientMin != -1 && nutrientActualValue < nutrientMin){
                advice += "<li><span class='recommendation-warning'></span> " + nutrientName + " is <b>low</b>.</li>";
            }
            else if (nutrientUpperMax != -1 && nutrientActualValue > nutrientUpperMax){
                advice += "<li><span class='recommendation-warning'></span> " + nutrientName + " is <b>high</b>.</li>";
            }
        }        
        else{
            if (nutrientMax != -1 && nutrientActualValue > nutrientMax){
                advice += "<li><span class='recommendation-warning'></span> " + nutrientName + " is <b>high</b>.</li>";
            }
        }
    });

    advice += "</ul>"

    guidanceElement.innerHTML = advice;

    if (advice.length <= 9){
        document.getElementById("guidance-box-container").style.display = 'none';
    }
    else{
        document.getElementById("guidance-box-container").style.display = 'block';
    }
}

slider.oninput = function() {
    // Change portion.
    let newNumCups = (Math.round(this.value * 100) / 100).toFixed(2);
    
    nutrientVars["numCups"]["element"].innerHTML = newNumCups;
//     updateColor("numCups", newNumCups, 1, -1, 1);

    updatePortionVisualCue(newNumCups);

    // Change other values.        
    nutrients.forEach((nutrient) => {
        updateValueforPortion(nutrient, newNumCups);

        
        // change Daily Value percentage
        let currentDailyMax = nutrientVars[nutrient]["dailyMax"];
        if (currentDailyMax != -1){
            updatePercentforPortion(nutrient);
        }        

        // update background color
        updateColorNutrient(nutrient); 

    });          

    // update summary of warnings for user
    updateGuidanceBox();

}
