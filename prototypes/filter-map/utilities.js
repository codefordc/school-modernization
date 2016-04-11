


// ======= ======= ======= ======= ======= MATH PROCESSING & DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= MATH PROCESSING & DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= MATH PROCESSING & DISPLAY ======= ======= ======= ======= =======

// ======= ======= ======= polyfill for Safari ======= ======= =======
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
           isFinite(value) &&
           Math.floor(value) === value;
};

// ======= ======= ======= initAutoComplete ======= ======= =======
function initAutoComplete(displayObj) {
    console.log('initAutoComplete');
    $(function() {
        console.log("autocomplete");
        $("#searchWindow").autocomplete({
            source: displayObj.schoolNamesArray
        });
    });
    $('#searchWindow').css('z-index', 999);
}

// ======= ======= ======= getZoneUrls ======= ======= =======
function getZoneUrls(displayObj, zonesCollectionObj) {
    console.log("getZoneUrls");

    var feederFlag = false;
    if (displayObj.displayMode == "storyMap") {
        var websitePrefix = "prototypes/filter-map/";
    } else {
        var websitePrefix = "";
    }

    if (displayObj.dataFilters.zones) {
        if (displayObj.dataFilters.zones == "Ward") {
            zonesCollectionObj.zoneA = "Ward";
            urlA = websitePrefix + "Data_Geo/Ward__2012.geojson";
            urlB = null;
        } else if (displayObj.dataFilters.zones == "FeederHS") {
            zonesCollectionObj.zoneA = "FeederHS";
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Senior_High__New.geojson";
            if (displayObj.dataFilters.levels == "MS") {
                feederFlag = true;
                urlB = websitePrefix + "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
            } else if (displayObj.dataFilters.levels == "ES") {
                feederFlag = true;
                urlB = websitePrefix + "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
            } else if (displayObj.dataFilters.levels == null) {
                urlB = null;
            }
        } else if (displayObj.dataFilters.zones == "FeederMS") {
            feederFlag = true;
            zonesCollectionObj.zoneA = "FeederMS";
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
            urlB = websitePrefix + "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
        } else if (displayObj.dataFilters.zones == "Elementary") {
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
        }
    } else {
        if (displayObj.dataFilters.levels == "HS") {
            zonesCollectionObj.zoneA = "FeederHS";
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Senior_High__New.geojson";
        } else if (displayObj.dataFilters.levels == "MS") {
            zonesCollectionObj.zoneA = "FeederMS";
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
        } else if (displayObj.dataFilters.levels == "ES") {
            zonesCollectionObj.zoneA = "Elementary";
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
        } else {
            zonesCollectionObj.zoneA = "Ward";
            urlA = websitePrefix + "Data_Geo/Ward__2012.geojson";
        }
        urlB = null;
    }
    return [urlA, urlB, feederFlag];
}

// ======= ======= ======= checkFilterSelection ======= ======= =======
function checkFilterSelection(displayObj, zonesCollectionObj, whichCategory) {
    console.log("##### checkFilterSelection #####");

    console.log("  whichCategory: ", whichCategory);
    console.log("  zoneA: ", zonesCollectionObj.zoneA);
    console.log("  * agency: ", displayObj.dataFilters.agency);
    console.log("  * levels: ", displayObj.dataFilters.levels);
    console.log("  * expend: ", displayObj.dataFilters.expend);
    console.log("  * zones: ", displayObj.dataFilters.zones);
    console.log("  * math: ", displayObj.dataFilters.math);
}

// ======= ======= ======= updateFilterItem ======= ======= =======
function updateFilterItem(displayObj, whichCategory, whichFilter, onOrOff) {
    console.log("updateFilterItem");

    var nextMenu, nextCategory;

    for (var i = 0; i < displayObj.filterMenusArray.length; i++) {
        nextMenu = displayObj.filterMenusArray[i];
        nextCategory = nextMenu[0];
        if (nextCategory == whichCategory) {
            for (var j = 1; j < nextMenu.length; j++) {
                nextFilterObject = nextMenu[j];
                if ((nextFilterObject.id == whichFilter) && (onOrOff == undefined)) {
                    $("#" + nextFilterObject.id).addClass("selected");
                } else if ((nextFilterObject.id == whichFilter) && (onOrOff == "off")) {
                    $("#" + nextFilterObject.id).addClass("deactivated");
                } else if ((nextFilterObject.id == whichFilter) && (onOrOff == "on")) {
                    $("#" + nextFilterObject.id).removeClass("deactivated");
                } else {
                    $("#" + nextFilterObject.id).removeClass("selected");
                }
            }
            break;
        }
    }
}

// ======= ======= ======= setMenuState ======= ======= =======
function setMenuState(displayObj, whichMenu, whichStates) {
    console.log("setMenuState");

    var nextState, nextFilter, nextFilterText, nextElement, checkIndex, selectedFilterText;

    // == loop through states for each filter on menu
    for (var i = 0; i < whichStates.length; i++) {
        nextState = whichStates[i];
        nextFilter = whichMenu[i+1];

        // == avoid duplicate "schools" descriptior in filter list
        if (whichMenu[0] == "agency") {
            if (displayObj.filterTitlesObject.levels) {
                nextFilterText = nextFilter.id;
                if (nextFilterText == "All") {
                    (nextFilterText = "District and Charter");
                }
            } else {
                nextFilterText = nextFilter.text;
            }
        } else if (whichMenu[0] == "levels") {
            var checkIndex = displayObj.filterTitlesObject.agency.indexOf("Schools");
            if (checkIndex > -1) {
                displayObj.filterTitlesObject.agency = displayObj.filterTitlesObject.agency.substring(0, checkIndex);
            }
            nextFilterText = nextFilter.text;
        } else {
            nextFilterText = nextFilter.text;
        }

        // == see if filter is in filter list
        nextElement = $("#" + nextFilter.id);
        checkIndex = $.inArray(nextFilterText, displayObj.filterTitlesArray);

        // == set filter menu state; leave only selected filters in filterTitlesArray
        if (nextState == "A") {
            // if (checkIndex > -1) {
            //     displayObj.filterTitlesArray.splice(checkIndex, 1);
            // }
            $(nextElement).addClass("active");
            $(nextElement).removeClass("selected");
            $(nextElement).removeClass("deactivated");
            displayObj.activateFilterLink(nextFilter);
        } else if (nextState == "D") {
            // if (checkIndex > -1) {
            //     displayObj.filterTitlesArray.splice(checkIndex, 1);
            // }
            $(nextElement).removeClass("active");
            $(nextElement).removeClass("selected");
            $(nextElement).addClass("deactivated");
            $(nextElement).off("click");

        } else if (nextState == "S") {
            // if (checkIndex == -1) {
            //     displayObj.filterTitlesArray.push(nextFilterText);
            // }
            selectedFilterText = nextFilterText;
            displayObj.filterTitlesObject[whichMenu[0]] = selectedFilterText;
            $(nextElement).removeClass("deactivated");
            $(nextElement).addClass("active");
            $(nextElement).addClass("selected");
        }
    }
    updateFilterSelections(displayObj, whichMenu, selectedFilterText);
}

// ======= ======= ======= updateFilterSelections ======= ======= =======
function updateFilterSelections(displayObj, whichMenu, filterText) {
    console.log("updateFilterSelections");

    var selectedFilterContainer = $("#filters-selections").children("h2");
    var nextFilter, checkNextFilter;

    // var filterTitlesObject = { agency:null, levels:null, expend:null, zones:null };

    var selectedFilterText = "<span class='filterLabel'>Data for: </span>";
    if (displayObj.filterTitlesObject.expend) {
        selectedFilterText += displayObj.filterTitlesObject.expend + " for";
    }
    if (displayObj.filterTitlesObject.agency) {
        selectedFilterText += " " + displayObj.filterTitlesObject.agency;
    }
    if (displayObj.filterTitlesObject.levels) {
        selectedFilterText += " " + displayObj.filterTitlesObject.levels;
    }
    if (displayObj.filterTitlesObject.zones) {
        selectedFilterText += " by " + displayObj.filterTitlesObject.zones;
    }

    $(selectedFilterContainer).addClass("filterList");
    $(selectedFilterContainer).html(selectedFilterText);
}



// ======= ======= ======= ======= ======= AGGREGATORS ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= AGGREGATORS ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= AGGREGATORS ======= ======= ======= ======= =======

// ======= ======= ======= clearZoneAggregator ======= ======= =======
function clearZoneAggregator(zonesCollectionObj) {
    console.log("clearZoneAggregator");

    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        zonesCollectionObj.aggregatorArray[i].schoolCount = 0;
        zonesCollectionObj.aggregatorArray[i].zoneAmount = 0;
        zonesCollectionObj.aggregatorArray[i].zoneSqft = 0;
        zonesCollectionObj.aggregatorArray[i].zoneEnroll = 0;
        zonesCollectionObj.aggregatorArray[i].amountMin = 0;
        zonesCollectionObj.aggregatorArray[i].amountMax = 0;
        zonesCollectionObj.aggregatorArray[i].amountAvg = 0;
        zonesCollectionObj.aggregatorArray[i].amountMed = 0;
    }
}

// ======= ======= ======= getZoneIndex ======= ======= =======
function getZoneIndex(zonesCollectionObj, displayObj, schoolData) {
    // console.log("getZoneIndex");

    var nextZone, schoolWard, nextZoneNumber, schoolZoneIndex, rootFeederHS, rootFeederMS;

    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        nextZone = zonesCollectionObj.aggregatorArray[i].zoneName;
        if (displayObj.dataFilters.zones == "Ward") {
            schoolWard = parseInt(schoolData.schoolWard);
            nextZoneNumber = parseInt(nextZone.split(" ")[1]);
            if (nextZoneNumber == schoolWard) {
                schoolZoneIndex = i;
                break;
            }
        } else if (displayObj.dataFilters.zones == "FeederHS") {
            schoolFeederHS = schoolData.schoolFeederHS;
            if ((schoolFeederHS == "NA") || (schoolFeederHS == null)) {
                schoolZoneIndex = null;
            } else {
                rootFeederHS = schoolFeederHS.split(" ")[0];
                if (nextZone == rootFeederHS) {
                    schoolZoneIndex = i;
                    break;
                }
            }
        } else if (displayObj.dataFilters.zones == "FeederMS") {
            schoolFeederMS = schoolData.schoolFeederMS;
            if ((schoolFeederMS == "NA") || (schoolFeederMS == null)) {
                schoolZoneIndex = null;
            } else {
                rootFeederMS = schoolFeederMS.split(" ")[0];
                if (nextZone == rootFeederMS) {
                    schoolZoneIndex = i;
                    break;
                }
            }
        }
    }
    return schoolZoneIndex;
}

// ======= ======= ======= makeZoneAggregator ======= ======= =======
function makeZoneAggregator(zonesCollectionObj, displayObj, whichGeojson) {
    console.log("makeZoneAggregator");

    zonesCollectionObj.aggregatorArray = [];
    if (whichGeojson) {
        var nextZoneName, splitZoneName, nextZoneObject, nextGIS_ID, startCode, nextZoneCode;
        for (var i = 0; i < whichGeojson.features.length; i++) {
            nextZoneName = whichGeojson.features[i].properties.NAME;
            // if (displayObj.dataFilters.zones != "Ward") {
            //     nextGIS_ID = whichGeojson.features[i].properties.GIS_ID;
            //     startCode = nextGIS_ID.indexOf("_");
            //     nextZoneCode = nextGIS_ID.substring(startCode + 1);
            //     console.log("  nextZoneCode: ", nextZoneCode);
            // }
            nextZoneObject = { zoneIndex:i, zoneName:nextZoneName, schoolCount:0, zoneAmount:0, zoneSqft:0, zoneEnroll:0, amountMin:0, amountMax:0, amountAvg:0, amountMed:0 }
            zonesCollectionObj.aggregatorArray.push(nextZoneObject);
        }
    } else {
        console.log("ERROR: no geojson data");
    }
    console.dir(zonesCollectionObj.aggregatorArray);
}

// ======= ======= ======= aggregateZoneData ======= ======= =======
function aggregateZoneData(zonesCollectionObj, displayObj, schoolData, masterIndex) {
    // console.log("aggregateZoneData");

    var schoolWard = nextZoneIndex = nextSchoolExpend = currentAmount = aggregatedAmount = 0;
    var currentSqft = currentEnroll = aggregatedSqft = aggregatedEnroll = 0;
    var validExpendFlag = true;
    var nextZone = schoolZoneIndex = null;
    var nextSchoolSqft, nextSchoolEnroll, validExpendFlag;

    // == match school name from geojson file with school name from csv file
    if (displayObj.dataFilters.zones) {
        schoolZoneIndex = getZoneIndex(zonesCollectionObj, displayObj, schoolData);
    }

    // == identify column holding selected expend filter data
    if (schoolZoneIndex != null) {

        // == defaults to lifetime budget expenditure if no expenditure selected
        nextSchoolExpend = schoolData.spendLifetime;
        if (displayObj.dataFilters.expend == null) {
            if ((nextSchoolExpend == "NA") || (nextSchoolExpend == null)) {
                nextSchoolExpend = 0;
                validExpendFlag = false;
            } else {
                nextSchoolExpend = parseInt(schoolData.spendLifetime);
            }
        } else {
            if ((nextSchoolExpend == "NA") || (nextSchoolExpend == null)) {
                nextSchoolExpend = 0;
                validExpendFlag = false;
            } else {
                nextSchoolExpend = parseInt(schoolData[displayObj.dataFilters.expend]);
            }
        }

        nextSchoolSqft = schoolData.schoolSqft;
        if ((nextSchoolSqft == "NA") || (nextSchoolSqft == null)) {
            nextSchoolSqft = 0;
        } else {
            nextSchoolSqft = parseInt(schoolData.schoolSqft);
        }

        nextSchoolEnroll = schoolData.schoolEnroll;
        if ((nextSchoolEnroll == "NA") || (nextSchoolEnroll == null)) {
            nextSchoolEnroll = 0;
        } else {
            nextSchoolEnroll = parseInt(schoolData.schoolEnroll);
        }

        // == aggregate new value into zone total
        if (Number.isInteger(nextSchoolExpend)) {
            if (nextSchoolExpend >= 0) {
                if (validExpendFlag == true) {
                    zonesCollectionObj.aggregatorArray[schoolZoneIndex].schoolCount++;
                    currentAmount = zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneAmount;
                    aggregatedAmount = currentAmount + nextSchoolExpend;
                    zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneAmount = aggregatedAmount;
                }

                // ======= record max =======
                if (nextSchoolExpend > zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMax) {
                    zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMax = nextSchoolExpend;
                }

                // ======= record min =======
                if (zonesCollectionObj.aggregatorArray[schoolZoneIndex].schoolCount == 1) {
                    zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMin = nextSchoolExpend;
                } else {
                    if (nextSchoolExpend <= zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMin) {
                        zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMin = nextSchoolExpend;
                    }
                }

                // ======= calculate average =======
                zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountAvg = aggregatedAmount/zonesCollectionObj.aggregatorArray[schoolZoneIndex].schoolCount;

            } else {
                console.log("ERROR: negative values for " + schoolData.schoolName);
                nextSchoolExpend = 0;
            }

        } else {
            console.log("ERROR: nextSchoolExpend NaN " + schoolData.schoolName);
            nextSchoolExpend = 0;
        }

        // == aggregate new value into zone total
        if (Number.isInteger(nextSchoolSqft)) {
            if (nextSchoolSqft >= 0) {
                currentSqft = zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneSqft;
                aggregatedSqft = currentSqft + nextSchoolSqft;
                zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneSqft = aggregatedSqft;
            } else {
                console.log("ERROR: negative sqft values for " + schoolData.schoolName);
                nextSchoolSqft = 0;
            }
        } else {
            console.log("ERROR: nextSchoolSqft NaN " + schoolData.schoolName);
            nextSchoolSqft = 0;
        }

        // == aggregate new value into zone total
        if (Number.isInteger(nextSchoolEnroll)) {
            if (nextSchoolEnroll >= 0) {
                currentEnroll = zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneEnroll;
                aggregatedEnroll = currentEnroll + nextSchoolEnroll;
                zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneEnroll = aggregatedEnroll;
            } else {
                console.log("ERROR: negative enroll values for " + schoolData.schoolName);
                nextSchoolEnroll = 0;
            }
        } else {
            console.log("ERROR: nextSchoolEnroll NaN " + schoolData.schoolName);
            nextSchoolEnroll = 0;
        }
        return null;

    // == rejected schools
    } else {
        return schoolData.schoolCode;
    }
}

// ======= ======= ======= showAggratedData ======= ======= =======
function showAggratedData(schoolData, currentAmount, nextSchoolExpend, aggregatedAmount, currentSqft, nextSchoolSqft, aggregatedSqft, currentEnroll, nextSchoolEnroll, aggregatedEnroll) {
    // console.log("showAggratedData");

    console.log("*** school/index: ", schoolData.schoolName, "/", schoolZoneIndex);
    console.log("  currentAmount: ", currentAmount);
    console.log("    nextSchoolExpend: ", nextSchoolExpend);
    console.log("    aggregatedAmount: ", aggregatedAmount);
    console.log("  currentSqft: ", currentSqft);
    console.log("    nextSchoolSqft: ", nextSchoolSqft);
    console.log("    aggregatedSqft: ", aggregatedSqft);
    console.log("  currentEnroll: ", currentEnroll);
    console.log("    nextSchoolEnroll: ", nextSchoolEnroll);
    console.log("    aggregatedEnroll: ", aggregatedEnroll);

}

// ======= ======= ======= captureSchoolData ======= ======= =======
function captureSchoolData(zonesCollectionObj, displayObj, schoolData, masterIndex) {
    // console.log("captureSchoolData");

    // == match school name from geojson file with school name from csv file
    var nextSchoolZone, zoneSuffix;
    var zoneGeojson_A = zonesCollectionObj.zoneGeojson_A;
    var zoneAggregator = zonesCollectionObj.aggregatorArray;
    var checkSchoolName = processSchoolName(schoolData.schoolName)

    if (displayObj.dataFilters.levels) {
        var splitZoneName, nextZoneObject, nextDataObject, nextSchoolName, nextSchoolExpend, nextSchoolSqft, nextSchoolEnroll;
        for (var i = 0; i < zoneAggregator.length; i++) {
            nextDataObject = zoneAggregator[i];
            nextSchoolName = nextDataObject.zoneName;
            if (nextSchoolName == checkSchoolName) {
                nextSchoolExpend = parseInt(schoolData[displayObj.dataFilters.expend]);
                nextSchoolSqft = parseInt(schoolData.schoolSqft);
                nextSchoolEnroll = parseInt(schoolData.schoolEnroll);

                if (Number.isInteger(nextSchoolExpend)) {
                    if (nextSchoolExpend >= 0) {
                        currentAmount = nextDataObject.zoneAmount;
                        if (currentAmount == 0) {
                            aggregatedAmount = currentAmount + nextSchoolExpend;
                            nextDataObject.zoneAmount = aggregatedAmount;
                            nextDataObject.zoneIndex = masterIndex;
                        } else {
                            console.log("ERROR: data already captured for " + nextSchoolName);
                            break;
                        }
                    } else {
                        console.log("ERROR: negative values for " + schoolData.schoolName);
                        nextSchoolExpend = 0;
                    }
                } else {
                    nextDataObject.zoneAmount = 0;
                    nextDataObject.zoneIndex = masterIndex;
                    console.log("ERROR: non-integer amount for " + nextSchoolName);
                }

                if (Number.isInteger(nextSchoolSqft)) {
                    currentSqft = nextDataObject.zoneSqft;
                    if (currentSqft == 0) {
                        aggregatedSqft = currentSqft + nextSchoolSqft;
                        nextDataObject.zoneSqft = aggregatedSqft;
                    } else {
                        console.log("ERROR: data already captured for " + nextSchoolName);
                        break;
                    }
                } else {
                    nextDataObject.zoneSqft = 0;
                    console.log("ERROR: non-integer sqft for " + nextSchoolName);
                }

                if (Number.isInteger(nextSchoolEnroll)) {
                    currentEnroll = nextDataObject.zoneEnroll;
                    if (currentEnroll == 0) {
                        aggregatedEnroll = currentEnroll + nextSchoolEnroll;
                        nextDataObject.zoneEnroll = aggregatedEnroll;
                    } else {
                        console.log("ERROR: data already captured for " + nextSchoolName);
                        break;
                    }
                } else {
                    nextDataObject.zoneEnroll = 0;
                    console.log("ERROR: non-integer number for " + nextSchoolName);
                }
                break;
            }
        }
    }
}

// ======= ======= ======= doTheMath ======= ======= =======
function doTheMath(zonesCollectionObj, displayObj) {
    console.log("doTheMath");

    var nextSpendAmount, nextZoneValue, nextZoneSqft, nextZoneEnroll;

    // == gather all values in aggregator array
    var zoneValuesArray = [];
    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        nextSpendAmount = zonesCollectionObj.aggregatorArray[i].zoneAmount;
        if (displayObj.dataFilters.math == "spendAmount") {
            nextZoneValue = zonesCollectionObj.aggregatorArray[i].zoneAmount;
        } else if (displayObj.dataFilters.math == "spendSqFt") {
            nextZoneSqft = zonesCollectionObj.aggregatorArray[i].zoneSqft;
            if (nextZoneSqft != 0) {
                nextZoneValue = nextSpendAmount/nextZoneSqft;
            } else {
                nextZoneValue = 0;
            }
        } else if (displayObj.dataFilters.math == "spendEnroll") {
            nextZoneEnroll = zonesCollectionObj.aggregatorArray[i].zoneEnroll;
            if (nextZoneEnroll != 0) {
                nextZoneValue = nextSpendAmount/nextZoneEnroll;
            } else {
                nextZoneValue = 0;
            }
        }
        zoneValuesArray.push(nextZoneValue);
    }

    // == get lowest/highest values, divide by number of data bins
    var fillOpacity = 1;
    var maxValue = Math.max.apply(Math, zoneValuesArray);
    var minValue = Math.min.apply(Math, zoneValuesArray);
    var dataIncrement = parseFloat(maxValue/zonesCollectionObj.dataBins);
    return dataIncrement;
}

// ======= ======= ======= assignDataColors ======= ======= =======
function assignDataColors(zonesCollectionObj, displayObj, featureIndex) {
    console.log("assignDataColors");

    var nextZoneValue = zonesCollectionObj.aggregatorArray[featureIndex].zoneAmount;
    var nextExpendValue;
    if (displayObj.dataFilters.math == "spendAmount") {
        nextExpendValue = zonesCollectionObj.aggregatorArray[featureIndex].zoneAmount;
    } else if (displayObj.dataFilters.math == "spendEnroll") {
        if (zonesCollectionObj.aggregatorArray[featureIndex].zoneEnroll != 0) {
            nextExpendValue = parseFloat(nextZoneValue/(zonesCollectionObj.aggregatorArray[featureIndex].zoneEnroll));
        } else {
            nextExpendValue = 0;
        }
    } else if (displayObj.dataFilters.math == "spendSqFt") {
        if (zonesCollectionObj.aggregatorArray[featureIndex].zoneSqft != 0) {
            nextExpendValue = parseFloat(nextZoneValue/(zonesCollectionObj.aggregatorArray[featureIndex].zoneSqft));
        } else {
            nextExpendValue = 0;
        }
    }

    for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
        binMin = (zonesCollectionObj.dataIncrement * i);
        binMax = (zonesCollectionObj.dataIncrement * (i + 1));
        if ((binMin <= nextExpendValue) && (nextExpendValue <= (binMax + 1))) {
            var colorIndex = i;
            break;
        }
    }
    return colorIndex;
}

// ======= ======= ======= getZoneFormat ======= ======= =======
function getZoneFormat(zonesCollectionObj, displayObj, featureIndex, zoneName, whichLayer) {
    console.log("getZoneFormat");

    var itemColor = "white";
    var strokeColor = "purple";
    var strokeWeight = 2;
    var itemOpacity = 0.5;

    // == use indexed color if selected zone
    if (displayObj.dataFilters.selectedZone) {
        if (zoneName == displayObj.dataFilters.selectedZone) {
            itemColor = zonesCollectionObj.dataColorsArray[featureIndex];
        } else {
            itemColor = "white";
        }
    } else {
        if (whichLayer == "lower") {
            itemColor = "white";
            strokeColor = "purple";
            strokeWeight = 1;
            itemOpacity = 0.6;
        } else if (whichLayer == "upper") {
            if (displayObj.dataFilters.expend) {
                colorIndex = assignDataColors(zonesCollectionObj, displayObj, featureIndex);
                itemColor = zonesCollectionObj.dataColorsArray[colorIndex];
                strokeColor = "black";
                strokeWeight = 4;
            } else {
                itemColor = "white";
                strokeColor = "purple";
                strokeWeight = 2;
            }
            itemOpacity = 0.7;
        } else if (whichLayer == "single") {
            if ((displayObj.dataFilters.levels) || (displayObj.dataFilters.zones)) {
                if (displayObj.dataFilters.expend) {
                    colorIndex = assignDataColors(zonesCollectionObj, displayObj, featureIndex);
                    itemColor = zonesCollectionObj.dataColorsArray[colorIndex];
                    strokeColor = "black";
                    strokeWeight = 2;
                    itemOpacity = 0.8;
                } else {
                    return [itemColor, strokeColor, strokeWeight, itemOpacity];
                }
            } else {
                return [itemColor, strokeColor, strokeWeight, itemOpacity];
            }
        }
    }
    return [itemColor, strokeColor, strokeWeight, itemOpacity];
}

// ======= ======= ======= makeMapLegend ======= ======= =======
function makeMapLegend(zonesCollectionObj) {
    console.log("makeMapLegend");

    var zoneValuesArray = [];
    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        nextZoneValue = zonesCollectionObj.aggregatorArray[i].zoneAmount;
        zoneValuesArray.push(nextZoneValue);
    }

    var dataMax = Math.max.apply(Math, zoneValuesArray);
    var dataMin = Math.min.apply(Math, zoneValuesArray);
    var scaleLabels = getScaleFactor(dataMax)
    var scaleFactor = scaleLabels[0];
    var scaleLabel = scaleLabels[1];
    var nextMin = 0;
    var nextMax = 0;
    var nextColor;

    // == make legend html for color chips
    var legendHtml = "";
    legendHtml += "<table id='legend'>";
    legendHtml += "<tr><th class='amount'>data</th><th class='values'>color</th></tr>";
    for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
        nextMin = nextMax;
        nextMax += parseInt(zonesCollectionObj.dataIncrement);
        var minString = scaleLabel + (nextMin/scaleFactor).toFixed(1).toString();
        var maxString = (nextMax/scaleFactor).toFixed(1).toString();
        legendHtml += "<tr><td class='minMaxCol'><p class='minMax'>" + minString + " - " + maxString + "</p></td>";
        legendHtml += "<td class='colorChipCol'><div id='colorChip" + i + "' class='colorChip'>&nbsp;</div></td></tr>";
    }
    legendHtml += "</table>";

    // == remove previous legend, chart or profile html if any
    if ($('#profile-container').find('#profile').length) {
        $("#profile").remove();
    }
    if ($('#chart-container').find('#chart').length) {
        $("#chart").remove();
    }
    if ($('#legend-container').find('#legend').length) {
        $("#legend").remove();
        $("#legend-container").append(legendHtml);
    } else {
        $("#legend-container").append(legendHtml);
        $("#legend-container").fadeIn( "slow", function() {
            console.log("*** FADEIN legend-container ***");
        });
    }

    // == set colors on color chips
    for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
        nextChip = $("#colorChip" + i);
        nextColor = zonesCollectionObj.dataColorsArray[i];
        $("#colorChip" + i).css("background-color", nextColor);
    }
}

// ======= ======= ======= getScaleFactor ======= ======= =======
function getScaleFactor(dataMax) {
    console.log("getScaleFactor");
    if (dataMax > 1000000) {
        scaleFactor = 1000000;
        scaleLabel = "$M ";
    } else if ((dataMax < 1000000) && (dataMax > 1000)) {
        scaleFactor = 1000;
        scaleLabel = "$K ";
    } else {
        scaleFactor = 1;
        scaleLabel = "$";
    }
    return [scaleFactor, scaleLabel];
}



// ======= ======= ======= ======= ======= CLEAR DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= CLEAR DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= CLEAR DISPLAY ======= ======= ======= ======= =======

// ======= ======= ======= clearProfileChart ======= ======= =======
function clearProfileChart() {
    console.log("clearProfileChart");

    // == remove mapLegend, profile or chart html if any
    if ($('#chart-container').find('#chart').length) {
        $("#chart-container").fadeOut( "fast", function() {
            console.log("*** FADEOUT chart-container ***");
        });
        $("#chart").remove();
    }
    if ($('#profile-container').find('#profile').length) {
        $("#profile-container").fadeOut( "fast", function() {
            console.log("*** FADEOUT profile-container ***");
        });
        $("#profile").remove();
    }
}


// ======= ======= ======= removeMarkers ======= ======= =======
function removeMarkers(schoolsCollectionObj) {
    // console.log("removeMarkers");

    // console.log("  markers_before: ", mapDataObject.schoolMarkersArray.length);
    var schoolMarkersArray = schoolsCollectionObj.schoolMarkersArray;
    if (schoolMarkersArray) {
        for(i = 0; i < schoolMarkersArray.length; i++){
            schoolMarkersArray[i].setMap(null);
            schoolMarkersArray[i] = null;
        }
    }
    schoolsCollectionObj.schoolMarkersArray = [];
}

// ======= ======= ======= de_activateZoneListeners ======= ======= =======
function de_activateZoneListeners(zonesCollectionObj) {
    console.log("de_activateZoneListeners");

    google.maps.event.clearListeners(map, 'mouseover');
    google.maps.event.clearListeners(map, 'mouseout');
    google.maps.event.clearListeners(map, 'click');

    // console.log("  listeners_before: ", zonesCollectionObj.mapListenersArray.length);
    var mapListenersArray = zonesCollectionObj.mapListenersArray;
    if (zonesCollectionObj.mapListenersArray.length > 0) {
        for (var i = 0; i < zonesCollectionObj.mapListenersArray.length; i++) {
            google.maps.event.removeListener(zonesCollectionObj.mapListenersArray[i]);
        }
    }
    zonesCollectionObj.mapListenersArray = [];
}

// ======= ======= ======= makeZoneGeometry ======= ======= =======
function makeZoneGeometry(feature) {
    // console.log("makeZoneGeometry");

    var polyCount = 0;
    var multiPolyCount = 0;
    var polygonArray = [];

    // ======= traverse geometry paths for each feature =======
    feature.getGeometry().getArray().forEach(function(path) {
        featureType = feature.getGeometry().getType();
        featureBounds = new google.maps.LatLngBounds();
        if (featureType == "Polygon") {
            polyCount++;
            polygonArray.push(path);

            path.getArray().forEach(function(latLng) {
                featureBounds.extend(latLng);
            });
        } else {
            multiPolyCount++;
            polygonArray.push(path.j[0]);

            path.j[0].getArray().forEach(function(latLng) {
                featureBounds.extend(latLng);
            });
        }
    });

    // == get center of each feature
    centerLat = featureBounds.getCenter().lat();
    centerLng = featureBounds.getCenter().lng();
    centerLatLng = new google.maps.LatLng({lat: centerLat, lng: centerLng});
    return centerLatLng;
}

// ======= ======= ======= mouseoverZone ======= ======= =======
function mouseoverZone(event, itemName) {
    console.log("mouseoverZone");
    updateHoverText(itemName);
    displayFilterMessage("Select zone or school");
    if (map.get('clickedZone')!= event.feature ) {
        map.data.overrideStyle(event.feature, {
            fillColor: "white",
            fillOpacity: 0.5,
            strokePosition: "center",
            strokeWeight: 8
        });
    }
}

// ======= ======= ======= getDataDetails ======= ======= =======
function getDataDetails(nextSchool, nextIndex) {
    // console.log("getDataDetails");

    var tempSchoolData = {
        // school identity data
        "schoolIndex": nextIndex,
        "schoolCode": nextSchool.School_ID,
        "schoolName": nextSchool.School,
        "schoolWard": nextSchool.Ward,
        "schoolFeederMS": nextSchool.FeederMS,
        "schoolFeederHS": nextSchool.FeederHS,
        "schoolAddress": nextSchool.Address,
        "schoolLAT": nextSchool.latitude,
        "schoolLON": nextSchool.longitude,
        "schoolLevel": nextSchool.Level,
        "schoolAgency": nextSchool.Agency,

        // building data: schoolProject, schoolSqft, schoolMaxOccupancy, schoolSqFtPerEnroll, unqBuilding
        "schoolProject": nextSchool.ProjectType,
        "schoolSqft": nextSchool.totalSQFT,
        "schoolMaxOccupancy": nextSchool.schoolMaxOccupancy,
        "schoolSqFtPerEnroll": nextSchool.SqFtPerEnroll,
        "unqBuilding": nextSchool.unqBuilding,
        "YrComplete": nextSchool.YrComplete,

        // student population data
        "schoolEnroll": nextSchool.Total_Enrolled,
        "studentEng": nextSchool.Limited_English,
        "studentAtRisk": nextSchool.At_Risk,
        "studentSpecEd": nextSchool.SpEd,
        "studentESLPer": nextSchool.ESLPer,
        "studentAtRiskPer": nextSchool.AtRiskPer,
        "studentSPEDPer": nextSchool.SPEDPer,

        // spending data: spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll, spendLTsqft, spendLTenroll
        "spendPast": nextSchool.MajorExp9815,
        "spendLifetime": nextSchool.LifetimeBudget,
        "spendPlanned": nextSchool.TotalAllotandPlan1621,
        "spendSqFt": nextSchool.SpentPerSqFt,           // Sqft
        "spendEnroll": nextSchool.SpentPerMaxOccupancy,       // Student
        "spendLTsqft": nextSchool.LTBudgetPerSqFt,
        "spendLTenroll": nextSchool.LTBudgetPerEnroll
    }
    return tempSchoolData;
}

// ======= ======= ======= makeSchoolProfile ======= ======= =======
function makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolData, schoolIndex) {
    console.log("makeSchoolProfile");
    console.log("  schoolIndex: ", schoolIndex);

    var nextValue;
    schoolsCollectionObj.selectedSchool = null;

    if ((typeof schoolIndex === 'undefined') || (typeof schoolIndex === 'null')) {
        console.log("*** SCHOOL SEARCH ***");
        var tempSchoolData = getDataDetails(schoolData, null)
        var cleanedSchoolData = cleanupSchoolData(schoolsCollectionObj, tempSchoolData);
    } else {
        var cleanedSchoolData = cleanupSchoolData(schoolsCollectionObj, schoolsCollectionObj.selectedSchoolsArray[schoolIndex]);
    }

    schoolsCollectionObj.selectedSchool = cleanedSchoolData;

    // == school sqft
    schoolSqft = cleanedSchoolData.schoolSqft;
    if (schoolSqft == "") {
        schoolSqft = "No data";
        schoolSqftSpan = "";
    } else {
        schoolSqftSpan = "<span class='value-label'>sqft</span>";
    }

    // == capacity
    schoolMaxOccupancy = cleanedSchoolData.schoolMaxOccupancy;
    if (schoolMaxOccupancy == "") {
        schoolMaxOccupancy = "No data";
        schoolMaxOccupancySpan = "";
    } else {
        schoolMaxOccupancySpan = "<span class='value-label'>students</span>";
    }

    // == enrollment
    schoolEnroll = cleanedSchoolData.schoolEnroll;
    if (schoolEnroll == "") {
        schoolEnroll = "No data";
        schoolEnrollSpan = "";
    } else {
        schoolEnrollSpan = "<span class='value-label'>students</span>";
    }

    // == sqft per enrolled student
    schoolSqFtPerEnroll = cleanedSchoolData.schoolSqFtPerEnroll;
    if (schoolSqFtPerEnroll == "") {
        schoolSqFtPerEnroll = "No data";
        schoolSqFtPerEnrollSpan = "";
    } else {
        schoolSqFtPerEnroll = parseInt(cleanedSchoolData.schoolSqFtPerEnroll);
        schoolSqFtPerEnrollSpan = "<span class='value-label'>sqft per student</span>";
    }

    // == lifetime spending
    spendLifetime = cleanedSchoolData.spendLifetime;
    if (spendLifetime == "") {
        spendLifetime = "<span class='value-label'>No data</span>";
    } else {
        spendLifetime = "$" + spendLifetime;
    }

    // == future spending
    spendPlanned = cleanedSchoolData.spendPlanned;
    if (spendPlanned == "") {
        spendPlanned = "<span class='value-label'>No data</span>";
    } else {
        spendPlanned = "$" + spendPlanned;
    }

    // == past spending
    spendPast = cleanedSchoolData.spendPast;
    if (spendPast == "") {
        spendPast = "<span class='value-label'>No data</span>";
    } else {
        spendPast = "$" + spendPast;
    }

    // == spending per student
    spendEnroll = cleanedSchoolData.spendEnroll;
    if ((spendEnroll == "") || (spendEnroll == 0)) {
        spendEnroll = "<span class='value-label'>No data</span>";
        spendEnrollSpan = "";
    } else {
        spendEnroll = "$" + parseInt(spendEnroll);
        spendEnrollSpan = " <span class='value-label'>per student</span>";
    }

    // == spending per sqft
    spendSqFt = parseInt(cleanedSchoolData.spendSqFt);
    if ((spendSqFt == "") || (spendSqFt == 0)) {
        spendSqFt = "<span class='value-label'>No data</span>";
        spendSqFtSpan = "";
    } else {
        spendSqFt = "$" + parseInt(spendSqFt);
        spendSqFtSpan = " <span class='value-label'>per sqft</span>";
    }

    var itemName = cleanedSchoolData.schoolName;
    if (itemName.length > 35) {
        var checkName = itemName.indexOf(", ");
        if (checkName > -1) {
            splitZoneName = itemName.split(", ");
            if (splitZoneName.length > 2) {
                itemName = splitZoneName[0] + ", " + splitZoneName[1];
            } else {
                itemName = splitZoneName[0];
            }
        }
        if (itemName.length > 38) {
            itemName = itemName.substring(0, 35) + "...";
        }
    }

    var htmlString = "<table id='profile'>";
    htmlString += "<tr><td class='profile-banner' colspan=2>";
    htmlString += "<div id='close-X'><p>X</p></div>";
    htmlString += "<p class='profile-title'>" + itemName + "</p>";
    htmlString += "<p class='profile-subtitle'>" + cleanedSchoolData.schoolAddress + "</p>";
    htmlString += "<p class='profile-subtitle2'>Ward " + cleanedSchoolData.schoolWard + " / " + cleanedSchoolData.schoolLevel + " / ";
    htmlString += "HS Feeder: " + cleanedSchoolData.schoolFeederHS +  "</p>";
    htmlString += displayObj.makeMathSelect(displayObj.expendMathMenu, "profile");
    htmlString += "</td></tr>";

    htmlString += "<tr><td class='data-key'><p class='key-text'>Enrollment (2014-15)</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + schoolEnroll + " " + schoolEnrollSpan + "</p></td></tr>";

    htmlString += "<tr><td class='data-key'><p class='key-text'>Bldg sq ft 2016</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + schoolSqft + " " + schoolSqftSpan + "</p></td></tr>";

    htmlString += "<tr><td class='data-key'><p class='key-text'>Bldg capacity 2016</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + schoolMaxOccupancy + " " + schoolMaxOccupancySpan + "</p></td></tr>";

    htmlString += "<tr><td class='data-key'><p class='key-text'>Past spending (FY1998-2015)</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPast' class='value-text'>&nbsp;</p></td></tr>";

    htmlString += "<tr><td class='data-key'><p class='key-text'>Past facilities improvements</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolProject + "</p></td></tr>";

    htmlString += "<tr><td class='data-key'><p class='key-text'>Year completed</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.YrComplete + "</p></td></tr>";

    htmlString += "<tr><td class='data-key'><p class='key-text'>Future spending (FY2016-2022)</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>&nbsp;</p></td></tr>";

    htmlString += "<tr><td class='data-key'><p class='key-text'>Future facilities improvements</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>&nbsp;</p></td></tr>";

    htmlString += "<tr><td class='data-key'><p class='key-text'>Projected completion</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>&nbsp;</p></td></tr>";

    htmlString += "<tr><td class='data-key'><p class='key-text'>Lifetime budget authority 1998-2022</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendLifetime' class='value-text'>&nbsp;</p></td></tr>";

    htmlString += "</table>";

    // == remove previous chart or profile html if any
    if ($('#chart-container').find('#chart').length) {
        $("#chart-container").fadeOut( "fast", function() {
            console.log("*** FADEOUT chart-container ***");
        });
    }
    if ($('#legend-container').find('#legend').length) {
        $("#legend").remove();
    }
    if ($('#profile-container').find('#profile').length) {
        $("#profile").remove();
        $("#profile-container").append(htmlString);
    } else {
        $("#profile-container").append(htmlString);
        $("#profile-container").fadeIn( "slow", function() {
            console.log("*** FADEIN profile-container ***");
        });
    }

    nextMath = $("select[name='expendMath'] option:selected").val()
    if (nextMath == "spendEnroll") {
        $("#profileSpendLifetime").html(spendEnroll + spendEnrollSpan);
        $("#profileSpendPlanned").html("<span class='value-label'>no future per student data</span>");
        $("#profileSpendPast").html("<span class='value-label'>no past per student data</span>");
    } else if (nextMath == "spendSqFt") {
        $("#profileSpendLifetime").html(spendSqFt + spendSqFtSpan);
        $("#profileSpendPlanned").html("<span class='value-label'>no future per sqft data</span>");
        $("#profileSpendPast").html("<span class='value-label'>no past per sqft data</span>");
    } else if (nextMath == "spendAmount") {
        $("#profileSpendLifetime").html(spendLifetime);
        $("#profileSpendPlanned").html(spendPlanned);
        $("#profileSpendPast").html(spendPast);
    } else {
        $("#profileSpendLifetime").html(spendLifetime);
        $("#profileSpendPlanned").html(spendPlanned);
        $("#profileSpendPast").html(spendPast);
    }

    displayObj.activateCloseButton();
    activateProfileSubmenu(displayObj, zonesCollectionObj, schoolsCollectionObj);
}

// ======= ======= ======= multiSchoolProfile ======= ======= =======
function multiSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolData, schoolIndex) {
    console.log("multiSchoolProfile");

    var checkSchool, checkAddress, multiSchool, schoolIndex, schoolName, listIndex;
    var selectedSchoolData = schoolsCollectionObj.selectedSchoolsArray[schoolIndex];
    var schoolAddress = selectedSchoolData.schoolAddress;
    var multiSchoolsArray = [];
    var schoolNamesString = "";

    for (var i = 0; i < schoolsCollectionObj.selectedSchoolsArray.length; i++) {
        checkSchool = schoolsCollectionObj.selectedSchoolsArray[i];
        checkAddress = checkSchool.schoolAddress;
        if (checkAddress == schoolAddress) {
            multiSchoolsArray.push(checkSchool);
        }
    }

    for (var i = 0; i < multiSchoolsArray.length; i++) {
        multiSchool = multiSchoolsArray[i];
        schoolIndex = multiSchool.schoolIndex;
        schoolName = multiSchool.schoolName;
        listIndex = i + 1;

        schoolNamesString += "<tr><td class='data-key'><p class='key-text'>school " + listIndex + "</p></td>";
        schoolNamesString += "<td class='data-value'><a id='" + schoolIndex + "' class='value-text' href='#'>" + schoolName + "</a></td></tr>";
    }

    var htmlString = "<table id='profile'>";
    htmlString += "<tr><td class='profile-banner' colspan=2>";
    htmlString += "<div id='close-X'><p>X</p></div>";
    htmlString += "<p class='profile-title'>Shared address schools</p>";
    htmlString += "<p class='profile-subtitle'>" + schoolAddress + "</p>";
    htmlString += "<p class='profile-subtitle2'>&nbsp;</p>";
    htmlString += "</td></tr>";
    htmlString += schoolNamesString;
    htmlString += "</table>";

    // == remove previous chart or profile html if any
    if ($('#chart-container').find('#chart').length) {
        $("#chart-container").fadeOut( "fast", function() {
            console.log("*** FADEOUT chart-container ***");
        });
    }
    if ($('#legend-container').find('#legend').length) {
        $("#legend").remove();
    }
    if ($('#profile-container').find('#profile').length) {
        $("#profile").remove();
        $("#profile-container").append(htmlString);
    } else {
        $("#profile-container").append(htmlString);
        $("#profile-container").fadeIn( "slow", function() {
            console.log("*** FADEIN profile-container ***");
        });
    }

    for (var i = 0; i < multiSchoolsArray.length; i++) {
        multiSchool = multiSchoolsArray[i];
        schoolIndex = multiSchool.schoolIndex;
        activateMultiSchoolLink(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolIndex);
    }
}

// ======= ======= ======= activateMultiSchoolLink ======= ======= =======
function activateMultiSchoolLink(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolId) {
    console.log("activateMultiSchoolLink");

    // ======= selectSchool =======
    $("#" + schoolId).off("mouseover").on("mouseover", function(event){
        console.log("\n======= mouseover =======");
        console.log("  this: ", this);

    });

    // ======= selectSchool =======
    $("#" + schoolId).off("click").on("click", function(event){
        console.log("\n======= click =======");
        console.log("  this.id: ", this.id);
        schoolData = schoolsCollectionObj.selectedSchoolsArray[this.id];
        makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolData, this.id);
    });
}

// ======= ======= ======= activateProfileSubmenu ======= ======= =======
function activateProfileSubmenu(displayObj, zonesCollectionObj, schoolsCollectionObj) {
    console.log("activateProfileSubmenu");

    $('#expendMathP').on({
        change: function() {
            console.log("\n------- setSubMenu -------");
            nextMath = $("select[name='expendMath'] option:selected").val()
            console.log("  event: ", event);
            console.log("  nextMath: ", nextMath);
            displayObj.dataFilters.math = nextMath;
            checkFilterSelection(displayObj, zonesCollectionObj, "math");

            getSubProfileData(schoolsCollectionObj, nextMath);
        }
    });
}

// ======= ======= ======= getSubProfileData ======= ======= =======
function getSubProfileData(schoolsCollectionObj, nextMath) {
    console.log("getSubProfileData");

    var cleanedSchoolData = schoolsCollectionObj.selectedSchool;
    console.dir(cleanedSchoolData);

    // == lifetime spending
    spendLifetime = cleanedSchoolData.spendLifetime;
    if (spendLifetime == "") {
        spendLifetime = "<span class='value-label'>No data for lifetime spending</span>";
    } else {
        spendLifetime = "$" + spendLifetime;
    }

    // == future spending
    spendPlanned = cleanedSchoolData.spendPlanned;
    if (spendPlanned == "") {
        spendPlanned = "<span class='value-label'>No data for future spending</span>";
    } else {
        spendPlanned = "$" + spendPlanned;
    }

    // == past spending
    spendPast = cleanedSchoolData.spendPast;
    if (spendPast == "") {
        spendPast = "<span class='value-label'>No data for past spending</span>";
    } else {
        spendPast = "$" + spendPast;
    }

    // == spending per student
    spendEnroll = cleanedSchoolData.spendEnroll;
    if ((spendEnroll == "") || (spendEnroll == 0)) {
        spendEnroll = "<span class='value-label'>No spending per student data</span>";
        spendEnrollSpan = "";
    } else {
        spendEnroll = "$" + parseInt(spendEnroll);
        spendEnrollSpan = " <span class='value-label'>per student</span>";
    }

    // == spending per sqft
    spendSqFt = parseInt(cleanedSchoolData.spendSqFt);
    if ((spendSqFt == "") || (spendSqFt == 0)) {
        spendSqFt = "<span class='value-label'>No spending per sqft data</span>";
        spendSqFtSpan = "";
    } else {
        spendSqFt = "$" + parseInt(spendSqFt);
        spendSqFtSpan = " <span class='value-label'>per sqft</span>";
    }

    if (nextMath == "spendEnroll") {
        $("#profileSpendLifetime").html(spendEnroll + spendEnrollSpan);
        $("#profileSpendPlanned").html("<span class='value-label'>no future per student data</span>");
        $("#profileSpendPast").html("<span class='value-label'>no past per student data</span>");
    } else if (nextMath == "spendSqFt") {
        $("#profileSpendLifetime").html(spendSqFt + spendSqFtSpan);
        $("#profileSpendPlanned").html("<span class='value-label'>no future per sqft data</span>");
        $("#profileSpendPast").html("<span class='value-label'>no past per sqft data</span>");
    } else if (nextMath == "spendAmount") {
        $("#profileSpendLifetime").html(spendLifetime);
        $("#profileSpendPlanned").html(spendPlanned);
        $("#profileSpendPast").html(spendPast);
    } else {
        $("#profileSpendLifetime").html(spendLifetime);
        $("#profileSpendPlanned").html(spendPlanned);
        $("#profileSpendPast").html(spendPast);
    }
}

// ======= ======= ======= checkSchoolData ======= ======= =======
function checkSchoolData(zonesCollectionObj, schoolsCollectionObj, selectedSchoolsArray, selectedCodesArray, rejectedCodesArray, rejectedAggregatorArray) {
    console.log("checkSchoolData");

    // ======= check aggregated numbers =======
    var zoneAmountArray = [];
    var zoneEnrollArray = [];
    var zoneSqftArray = [];
    var amountTotal = 0;
    var enrollTotal = 0;
    var sqftTotal = 0;

    // ======= min/max/avg/med for each individual zone =======
    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        nextZoneObject = zonesCollectionObj.aggregatorArray[i];
        zoneAmountArray.push(nextZoneObject.zoneAmount);
        zoneEnrollArray.push(nextZoneObject.zoneEnroll);
        zoneSqftArray.push(nextZoneObject.zoneSqft);
        amountTotal = amountTotal + nextZoneObject.zoneAmount;
        enrollTotal = enrollTotal + nextZoneObject.zoneEnroll;
        sqftTotal = sqftTotal + nextZoneObject.zoneSqft;
        console.log("******* min/max/avg/med for: ", nextZoneObject.zoneName);
        console.log("  schoolCount: ", nextZoneObject.schoolCount);
        console.log("  zoneAmount: ", nextZoneObject.zoneAmount);
        console.log("  zoneSqft:   ", nextZoneObject.zoneSqft);
        console.log("  zoneEnroll: ", nextZoneObject.zoneEnroll);
        console.log("  amountMin: ", nextZoneObject.amountMin);
        console.log("  amountMax: ", nextZoneObject.amountMax);
        console.log("  amountAvg: ", nextZoneObject.amountAvg);
        console.log("  amountMed: ", nextZoneObject.amountMed);
    }
    var minAmount = Math.min.apply(Math, zoneAmountArray);
    var maxAmount = Math.max.apply(Math, zoneAmountArray);
    var avgAmount = amountTotal/zonesCollectionObj.aggregatorArray.length;
    var incAmount = maxAmount/zonesCollectionObj.aggregatorArray.length;
    var minEnroll = Math.min.apply(Math, zoneEnrollArray);
    var maxEnroll = Math.max.apply(Math, zoneEnrollArray);
    var avgEnroll = enrollTotal/zonesCollectionObj.aggregatorArray.length;
    var incEnroll = maxEnroll/zonesCollectionObj.aggregatorArray.length;
    var minSqft = Math.min.apply(Math, zoneSqftArray);
    var maxSqft = Math.max.apply(Math, zoneSqftArray);
    var avgSqft = sqftTotal/zonesCollectionObj.aggregatorArray.length;
    var incSqft = maxSqft/zonesCollectionObj.aggregatorArray.length;

    // ======= min/max/avg/med for each all zones =======
    console.log("*** all zone amounts ***");
    console.log("  zoneAmountArray: ", zoneAmountArray);
    console.log("  minAmount: ", minAmount);
    console.log("  maxAmount: ", maxAmount);
    console.log("  avgAmount: ", avgAmount);
    console.log("  incAmount: ", incAmount);
    console.log("*** all zone enroll ***");
    console.log("  zoneEnrollArray: ", zoneEnrollArray);
    console.log("  minEnroll: ", minEnroll);
    console.log("  maxEnroll: ", maxEnroll);
    console.log("  avgEnroll: ", avgEnroll);
    console.log("  incEnroll: ", incEnroll);
    console.log("*** all zone sqft ***");
    console.log("  zoneSqftArray: ", zoneSqftArray);
    console.log("  minSqft: ", minSqft);
    console.log("  maxSqft: ", maxSqft);
    console.log("  avgSqft: ", avgSqft);
    console.log("  incSqft: ", incSqft);

    // == check arrays for consistency or errors
    console.log("*** all schools count: ", schoolsCollectionObj.jsonData.length);
    console.log("  selectedSchoolsCt: ", selectedSchoolsArray.length);
    console.log("  selectedCodesCt: ", selectedCodesArray.length);
    console.log("  rejectedCodesCt: ", rejectedCodesArray.length);
    console.log("  aggregatorArray: ", zonesCollectionObj.aggregatorArray.length);
    console.log("  rejectedAggCt: ", rejectedAggregatorArray.length);
}

// ======= ======= ======= floating windows ======= ======= =======
function initFloatingWindows() {
    console.log("initFloatingWindows");

    var popup = document.getElementById("filter-container");
    var drag_bar = document.getElementById("drag_bar");
    var offset = { x: 0, y: 0 };

    drag_bar.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    function mouseDown(e){
        console.log("mouseDown");
        offset.x = e.clientX - popup.offsetLeft;
        offset.y = e.clientY - popup.offsetTop;
        window.addEventListener('mousemove', popupMove, true);
    }
    function popupMove(e){
        console.log("popupMove");
        popup.style.position = 'absolute';
        var top = e.clientY - offset.y;
        var left = e.clientX - offset.x;
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    }
    function mouseUp() {
        console.log("mouseUp");
        window.removeEventListener('mousemove', popupMove, true);
    }
}
