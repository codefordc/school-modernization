
function initApp(presetMode) {
    console.log('initApp');

    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======

    var schoolsCollectionObj;
    var zonesCollectionObj;
    var displayObj;

    // ======= ======= ======= initMenuObjects ======= ======= =======
    function initMenuObjects() {
        console.log("initMenuObjects");

        // == filter object properties: id, category, text, callback
        filterMenu = new Menu("filterMenu");

        // == District, Charter
        filterMenu.District = { id:"District", category:"schools", label:"DCPS Schools", text:"District Schools", column:"Agency", value:"DCPS" };
        filterMenu.Charter = { id:"Charter", category:"schools", label:"Charter Schools", text:"Public Charter Schools", column:"Agency", value:"PCS" };
        filterMenu.All = { id:"All", category:"schools", label:"All Schools", text:"District and Charter Schools", column:"Agency", value:"Both" };

        // == PK_K, Elem, Middle, High, ES_MS, MS_HS, Alt, SPED
        filterMenu.EMH = { id:"EMH", category:"schools", label:"All Levels", text:"All Grade Levels", column:"Level", value:"EMH" };
        filterMenu.Elem = { id:"Elem", category:"schools", label:"Elementary Schools", text:"Elementary, Elem/Middle, Early Childhood Schools", column:"Level", value:"ES" };
        filterMenu.Middle = { id:"Middle", category:"schools", label:"Middle Schools", text:"Middle Schools, Special Ed", column:"Level", value:"MS" };
        filterMenu.High = { id:"High", category:"schools", label:"High Schools", text:"High Schools, 6-12 MS/HS, Adult, Alternative Schools", column:"Level", value:"HS" };

        // == MajorExp9815, spendLifetime, spendPlanned
        filterMenu.MajorExp9815 = { id:"MajorExp9815", category:"expenditures", label:"Past Spending", text:"Past facility spending (1998-2015)", column:"MajorExp9815", value:null };
        filterMenu.spendPlanned = { id:"spendPlanned", category:"expenditures", label:"Future Spend", text:"Planned facility spending (2016-2021)", column:"TotalAllotandPlan1621", value:null };
        filterMenu.spendLifetime = { id:"spendLifetime", category:"expenditures", label:"Total Spend", text:"Total facility spending (1998-2021)", column:"LifetimeBudget", value:null };

        // == spendSqFt, spendEnroll
        filterMenu.spendSqFt = { id:"spendSqFt", category:"expenditures", label:"/sqft", text:"per sqFt", column:"SpentPerSqFt", value:null };
        filterMenu.spendEnroll = { id:"spendEnroll", category:"expenditures", label:"/student", text:"per student", column:"SpentPerMaxOccupancy", value:null };
        filterMenu.spendAmount = { id:"spendAmount", category:"expenditures", label:"", text:"dollar amount", column:null, value:null };

        // == zones
        filterMenu.Ward = { id:"Ward", category:"zone", label:"Wards", text:"Ward", column:"Ward", value:null };
        filterMenu.FeederHS = { id:"FeederHS", category:"zone", label:"HSfeeders", text:"High School Feeder Pattern", column:"FeederHS", value:null };
        filterMenu.FeederMS = { id:"FeederMS", category:"zone", label:"MSfeeders", text:"Middle School Boundary", column:"FeederMS", value:null };
        filterMenu.Elementary = { id:"Elementary", category:"zone", label:"Elementary zones", text:"Elementary zones", column:null, value:null };

    }
    function Display() {
        console.log("Display");
        this.displayMode = null;
        this.agencyMenu = ["agency", filterMenu.District, filterMenu.Charter, filterMenu.All];
        this.levelsMenu = ["levels", filterMenu.High, filterMenu.Middle, filterMenu.Elem];
        this.expendMenu = ["expend", filterMenu.spendLifetime, filterMenu.MajorExp9815, filterMenu.spendPlanned];
        // this.zonesMenu = ["zones", filterMenu.Ward, filterMenu.FeederHS, filterMenu.FeederMS, filterMenu.Elementary];
        this.zonesMenu = ["zones", filterMenu.Ward, filterMenu.FeederHS];
        this.expendMathMenu = ["expendMath", filterMenu.spendAmount, filterMenu.spendEnroll, filterMenu.spendSqFt];
        this.filterMenusArray = [this.agencyMenu, this.levelsMenu, this.zonesMenu, this.expendMenu];
        this.filterTitlesObject = { "agency":"All", "levels":null, "expend":null, "zones": "Ward" };
        this.filterTitlesArray = [];
        this.schoolNamesArray = [];
        this.categoryLabels = ["sector", "schools", "spending", "location"];
        this.groupLabels = ["who", "what", "when", "where"];
        this.dataFilters = { agency: "All", levels: null, expend: null, zones: "Ward", math: "spendAmount", selectedZone: null  };
    }
    function ZonesCollection() {
        console.log("ZonesCollection");
        this.zoneA = "Ward";
        this.zoneGeojson_A = null;
        this.zoneGeojson_B = null;
        this.zoneGeojson_AB = null;
        this.mapBounds = null;
        this.aggregator = {};
        this.aggregatorArray = [];
        this.mapListenersArray = [];
        this.zoneFeaturesArray = [];
        this.indexColorsArray = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];
        this.dataColorsArray = ["#b2bdc7", "#99a8b5", "#7f92a2", "#667c90", "#4c677d", "#32516a", "#193b58", "#002646"];
        this.defaultColor = "white";
        this.dataIncrement = 0;
        this.dataBins = 8;
    }
    function SchoolsCollection() {
        console.log("SchoolsCollection");
        this.dataSource = null;
        this.schoolColorsArray = [];
        this.sharedAddressArray = [];
        this.schoolMarkersArray = [];
        this.selectedSchoolsArray = [];
        this.closedSchoolsArray = [];
        this.selectedMarker = null;
        this.selectedSchool = null;
        this.jsonData = null;
        this.active = false;
    }
    function Menu() {
        console.log("Menu");
    }

    // ======= ======= ======= initDataObjects ======= ======= =======
    function initDataObjects() {
        console.log("initDataObjects");
        schoolsCollectionObj = new SchoolsCollection();
        zonesCollectionObj = new ZonesCollection();
        displayObj = new Display();
    }



    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======


    // ======= ======= ======= makeSearchAndHoverDisplay ======= ======= =======
    Display.prototype.makeSearchAndHoverDisplay = function() {
        console.log("makeSearchAndHoverDisplay");

        var filterContainer = ("#filter-container ");
        var menuHtml = "";
        this.makeColorLegend();
        menuHtml += this.makeSearchDisplay();
        menuHtml += this.makeHoverDisplay();
        $(filterContainer).append(menuHtml);
        this.activateSearchButton("searchButton");
        this.activateSearchWindow("searchWindow");
    }

    // ======= ======= ======= makeColorLegend ======= ======= =======
    Display.prototype.makeColorLegend = function() {
        console.log("makeColorLegend");
        var legendHtml = "<div id='legend'>";
        legendHtml += "<div><p class='legend-text'>District Schools</p><div class=legend-color-dcps>&nbsp;</div></div>";
        legendHtml += "<div><p class='legend-text'>Charter Schools</p><div class=legend-color-pcs>&nbsp;</div></div>";
        legendHtml += "</div>";
        $("body").append(legendHtml);
    }

    // ======= ======= ======= makeSelectBox ======= ======= =======
    Display.prototype.makeSelectBox = function(jsonData) {
        console.log("makeSelectBox");

        var selectBox = null
        var selectHtml = "<select id='school-select'>";
        var nextSchool, nextSchoolName;
        for (var i = 0; i < jsonData.length; i++ ) {
            nextSchool = jsonData[i];
            nextSchoolName = nextSchool.School;
            selectHtml += "<option value='" + nextSchoolName + "'>" + nextSchoolName + "</option>";
        }
        selectHtml += "</select>";

        var filterContainer = ("#filter-container ");
        selectBox = $("#filter-container").children("select");
        if (selectBox) {
            $(filterContainer).append(selectHtml);
            this.activateSelectBox();
        }

    }

    // ======= ======= ======= makeSearchDisplay ======= ======= =======
    Display.prototype.makeSearchDisplay = function() {
        // console.log("makeSearchDisplay");
        var searchHtml = "<div id='search' class='category'>";
        searchHtml += "<input id='searchWindow' type='text' placeholder='  school name'/ >";
        searchHtml += "<input type='button' id='searchButton' value='search'/ ></div>";
        return searchHtml;
    }

    // ======= ======= ======= makeHoverDisplay ======= ======= =======
    Display.prototype.makeHoverDisplay = function() {
        // console.log("makeHoverDisplay");
        var hoverHtml = "<div id='mouseover-text'><h2>&nbsp;</h2></div>";
        return hoverHtml;
    }

    // ======= ======= ======= makeMathSelect ======= ======= =======
    Display.prototype.makeMathSelect = function(whichMenu, chartOrProfile) {
        console.log("makeMathSelect");

        // == filter-container  bar container
        var subMenuContainer = $("#sub-nav-container");

        // == build sub-menu; attach to chart or profile div
        var nextCategory = whichMenu[0];
        if (chartOrProfile == "chart") {
            var subMenuHtml = "<select id='expendMathC' name='expendMath'>";
        } else if (chartOrProfile == "profile") {
            var subMenuHtml = "<select id='expendMathP' name='expendMath'>";
        }

        var nextItem, nextId, nextText;
        for (var i = 1; i < whichMenu.length; i++) {
            nextItem = whichMenu[i];
            nextId = nextItem.id;
            nextText = nextItem.text;
            if (displayObj.dataFilters.math == nextId) {
                subMenuHtml += "<option selected='selected' value='" + nextId + "'>" + nextText + "</option>";
            } else {
                subMenuHtml += "<option value='" + nextId + "'>" + nextText + "</option>";
            }
        }
        subMenuHtml += "</select>";
        return subMenuHtml;
    }

    // ======= ======= ======= activateClearButton ======= ======= =======
    Display.prototype.activateClearButton = function() {
        console.log("activateClearButton");

        var self = this;
        $("#clear-button").fadeIn( "slow", function() {
            // console.log("*** FADEIN ***");
        });

        // ======= ======= ======= selectFilter ======= ======= =======
        $("#clear-button").off("click").on("click", function(event){
            console.log("\n======= clear ======= ");

            // == clear menus (html) and filters (displayObj)
            checkFilterSelection();
            clearFilterSelctions(displayObj, zonesCollectionObj);
            clearProfileChart();
            checkFilterSelection();
            $("#searchWindow").val('');
            updateHoverText(null);

            // == load default map
            zonesCollectionObj.importZoneDataA();
            if (schoolsCollectionObj.selectedMarker) {
                resetMarker(schoolsCollectionObj.selectedMarker);
            }
        });
    }

    // ======= ======= ======= activateFilterMenus ======= ======= =======
    Display.prototype.activateFilterMenus = function() {
        console.log("activateFilterMenus");

        var nextMenu, nextFilter;

        for (var i = 0; i < this.filterMenusArray.length; i++) {
            nextMenu = this.filterMenusArray[i];
            for (var j = 1; j < nextMenu.length; j++) {
                nextFilter = nextMenu[j];
                activateFilterLink(nextFilter);
            }
        }
    }

    // ======= ======= ======= activateSearchWindow ======= ======= =======
    Display.prototype.activateSearchWindow = function(windowId) {
        console.log("activateSearchWindow");

        $("#" + windowId).on('input',function(e){
            console.log("input");
            clearProfileChart();
        });
    }

    // ======= ======= ======= activateSearchButton ======= ======= =======
    Display.prototype.activateSearchButton = function(buttonId) {
        console.log("activateSearchButton");

        var self = this;
        var buttonElement = $("#" + buttonId);

        // ======= selectFilter =======
        $(buttonElement).off("click").on("click", function(event){
            console.log("\n======= search =======");
            findSearchSchool();
        });
        // ======= selectFilter =======
        $( window ).bind('keypress', function(event){
            if ( event.keyCode == 13 ) {
                console.log("\n======= search =======");
                findSearchSchool();
            }
        });
    }

    // ======= ======= ======= activateCloseButton ======= ======= =======
    Display.prototype.activateCloseButton = function(buttonId) {
        console.log("activateCloseButton");

        var self = this;
        var buttonElement = $("#close-X");

        // ======= selectFilter =======
        $(buttonElement).off("click").on("click", function(event){
            console.log("\n======= close =======");

            // == remove previous chart or profile html if any
            $("#profile-container").fadeOut( "fast", function() {
                    console.log("*** FADEOUT profile-container ***");
                    $("#profile").remove();
            });
            if ($('#chart-container').find('#chart').length) {
                $("#chart-container").fadeIn( "slow", function() {
                    console.log("*** FADEIN chart-container ***");
                });
            }
            if ($('#legend-container').find('#legend').length) {
                $("#legend").remove();
            }
            resetMarker(schoolsCollectionObj.selectedMarker);
        });
    }

    // ======= ======= ======= ======= ======= FILTERS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= FILTERS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= FILTERS ======= ======= ======= ======= =======

    // ======= ======= ======= checkFilterSelection ======= ======= =======
    function checkFilterSelection(whichCategory) {
        console.log("##### checkFilterSelection");

        console.log("  whichCategory: ", whichCategory);
        console.log("  zoneA: ", zonesCollectionObj.zoneA);
        console.log("  * agency: ", displayObj.dataFilters.agency);
        console.log("  * levels: ", displayObj.dataFilters.levels);
        console.log("  * expend: ", displayObj.dataFilters.expend);
        console.log("  * zones: ", displayObj.dataFilters.zones);
        console.log("  * math: ", displayObj.dataFilters.math);
    }

    // ======= ======= ======= activateFilterLink ======= ======= =======
    function activateFilterLink(nextItem) {
        console.log("activateFilterLink");

        // == id ties DOM element to menu object
        var self = displayObj;
        if (nextItem) {
            var nextId = nextItem.id;
            var nextElement = $("#" + nextId);
        }

        // ======= ======= ======= mouseover ======= ======= =======
        $(nextElement).off("mouseover").on("mouseover", function(event){
            // console.log("\n======= mouseover ======= ");
            var whichFilter = this.id;
            var menuObject = filterMenu[whichFilter];
            var whichText = menuObject.text;
            updateHoverText(whichText);
        });

        // ======= ======= ======= mouseout ======= ======= =======
        $(nextElement).off("mouseout").on("mouseout", function(event){
            // console.log("\n======= mouseout ======= ");
            updateHoverText("");
        });

        // ======= ======= ======= selectFilter ======= ======= =======
        $(nextElement).off("click").on("click", function(event){
            console.log("\n======= selectFilter ======= ");

            var whichFilter = nextElement.data("filter");
            var whichCategory = nextElement.data("category");
            var whichState = nextElement.data("state");
            console.log("  whichFilter: ", whichFilter);
            console.log("  whichCategory: ", whichCategory);

            // var classList = $(this).attr('class').split(/\s+/);
            // var whichCategory = classList[1];
            // var whichFilter = this.id;
            var menuObject = filterMenu[whichFilter];
            var whichValue = menuObject.value;
            var whichText = menuObject.text;
            event.stopImmediatePropagation();

            // == store selected filter value  (agency, levels, expend, zone) on display object
            switch(whichCategory) {

                // == agency filter (all, district, charter)
                case "agency":
                    self.dataFilters.agency = whichFilter;
                    zonesCollectionObj.aggregatorArray = [];
                    if (whichFilter == "All") {
                        setMenuState(self.agencyMenu, ["A", "A", "S"]);
                        resetMenuState("zones");
                    } else if (whichFilter == "District") {
                        setMenuState(self.agencyMenu, ["S", "A", "A"]);
                        resetMenuState("zones");
                    } else if (whichFilter == "Charter") {
                        self.dataFilters.zones = "Ward";
                        zonesCollectionObj.zoneA = "Ward";
                        zonesCollectionObj.zoneGeojson_AB = null;
                        zonesCollectionObj.aggregatorArray = [];
                        if (self.dataFilters.levels == "HS") {
                            setMenuState(self.levelsMenu, ["S", "A", "A"]);
                        } else if (self.dataFilters.levels == "MS") {
                            setMenuState(self.levelsMenu, ["A", "S", "A"]);
                        } else if (self.dataFilters.levels == "ES") {
                            setMenuState(self.levelsMenu, ["A", "A", "S"]);
                        }
                        setMenuState(self.agencyMenu, ["A", "S", "A"]);
                        setMenuState(self.zonesMenu, ["S", "D"]);
                    }
                    break;

                // == levels filter (ES, MS, HS)
                case "levels":
                    self.dataFilters.levels = whichValue;
                    zonesCollectionObj.aggregatorArray = [];
                    if (whichValue == "HS") {
                        setMenuState(self.levelsMenu, ["S", "A", "A"]);
                        zonesCollectionObj.zoneA = "FeederHS";
                    } else if (whichValue == "MS") {
                        setMenuState(self.levelsMenu, ["A", "S", "A"]);
                        zonesCollectionObj.zoneA = "FeederMS";
                    } else if (whichValue == "ES") {
                        setMenuState(self.levelsMenu, ["A", "A", "S"]);
                        zonesCollectionObj.zoneA = "Elementary";
                    } else {
                        zonesCollectionObj.zoneA = "Ward";
                    }
                    break;

                // == expenditures filter (past, present, planed, etc.)
                case "expend":
                    self.dataFilters.expend = whichFilter;
                    console.log("  whichFilter: ", whichFilter);
                    if (whichFilter == "spendLifetime") {
                        setMenuState(self.expendMenu, ["S", "A", "A"]);
                    } else if (whichFilter == "MajorExp9815") {
                        setMenuState(self.expendMenu, ["A", "S", "A"]);
                    } else if (whichFilter == "spendPlanned") {
                        setMenuState(self.expendMenu, ["A", "A", "S"]);
                    }
                    zonesCollectionObj.aggregatorArray = [];
                    break;

                // == wards or feeder zones for map
                case "zones":
                    self.dataFilters.zones = whichFilter;
                    zonesCollectionObj.zoneA = whichFilter;
                    zonesCollectionObj.zoneGeojson_AB = null;
                    zonesCollectionObj.aggregatorArray = [];
                    var tempAgency = self.dataFilters.agency;
                    var tempLevels = self.dataFilters.levels;
                    console.log("  whichFilter: ", whichFilter);
                    console.log("  tempAgency: ", tempAgency);
                    console.log("  tempLevels: ", tempLevels);

                    // == high school feeder zone selected
                    if (whichFilter == "FeederHS") {
                        self.dataFilters.agency = "District";
                        setMenuState(self.agencyMenu, ["S", "D", "D"]);
                        setMenuState(self.zonesMenu, ["A", "S"]);

                        // == high school feeder zones apply to middle or elem schools
                        if (tempLevels == "ES") {
                            self.dataFilters.levels = "ES";
                            setMenuState(self.levelsMenu, ["A", "A", "S"]);
                            levelObject = filterMenu["Elem"];
                        } else if (tempLevels == "MS") {
                            self.dataFilters.levels = "MS";
                            setMenuState(self.levelsMenu, ["A", "S", "A"]);
                            levelObject = filterMenu["Middle"];
                        } else if (tempLevels == "HS") {
                            self.dataFilters.levels = "HS";
                            setMenuState(self.levelsMenu, ["S", "A", "A"]);
                            levelObject = filterMenu["High"];
                        } else if (tempLevels == null) {
                            self.dataFilters.levels = null;
                            setMenuState(self.levelsMenu, ["A", "A", "A"]);
                            levelObject = filterMenu[null];
                        }

                    // == middle school feeder zone selected
                    } else if (whichFilter == "FeederMS") {
                        self.dataFilters.agency = "District";
                        setMenuState(self.agencyMenu, ["S", "D", "D"]);
                        setMenuState(self.zonesMenu, ["A", "A"]);

                        // == high school feeder zones apply to middle or elem schools
                        if (tempLevels == "ES") {
                            self.dataFilters.levels = "ES";
                            setMenuState(self.levelsMenu, ["A", "A", "S"]);
                            levelObject = filterMenu["Elem"];
                        } else if (tempLevels == "MS") {
                            self.dataFilters.levels = "MS";
                            setMenuState(self.levelsMenu, ["A", "S", "A"]);
                            levelObject = filterMenu["Middle"];
                        } else if (tempLevels == "HS") {
                            self.dataFilters.levels = "HS";
                            setMenuState(self.levelsMenu, ["S", "A", "A"]);
                            levelObject = filterMenu["High"];
                        } else if (tempLevels == null) {
                            self.dataFilters.levels = null;
                            setMenuState(self.levelsMenu, ["A", "A", "A"]);
                            levelObject = filterMenu[null];
                        }

                        // == middle school feeder zones apply to elementary schools only
                        // self.dataFilters.levels = "ES";
                        // setMenuState(self.zonesMenu, ["A", "A", "S"]);
                        // setMenuState(self.levelsMenu, ["D", "D", "S"]);
                        // levelObject = filterMenu["Elem"];

                    // == elementary zone selected
                    } else if (whichFilter == "Elementary") {
                        self.dataFilters.levels = "ES";
                        setMenuState(self.zonesMenu, ["A", "A"]);
                        setMenuState(self.levelsMenu, ["A", "A", "A"]);

                    // == no zone or Ward selected
                    } else {
                        if (displayObj.dataFilters.levels == "HS") {
                            setMenuState(self.levelsMenu, ["S", "A", "A"]);
                        } else if (displayObj.dataFilters.levels == "MS") {
                            setMenuState(self.levelsMenu, ["A", "S", "A"]);
                        } else if (displayObj.dataFilters.levels == "ES") {
                            setMenuState(self.levelsMenu, ["A", "A", "S"]);
                        } else {
                            setMenuState(self.levelsMenu, ["A", "A", "A"]);
                        }
                        if (displayObj.dataFilters.agency == "District") {
                            setMenuState(self.agencyMenu, ["S", "A", "A"]);
                        } else if (displayObj.dataFilters.agency == "Charter") {
                            setMenuState(self.agencyMenu, ["A", "S", "A"]);
                        } else if (displayObj.dataFilters.agency == "All") {
                            setMenuState(self.agencyMenu, ["A", "A", "S"]);
                        } else {
                            setMenuState(self.agencyMenu, ["A", "A", "A"]);
                        }
                        setMenuState(self.zonesMenu, ["S", "A"]);
                    }
                    break;
            }

            if (self.dataFilters.expend == null) {
                clearProfileChart();
            }

            updateHoverText(null);
            zonesCollectionObj.importZoneDataA();
        });
    }

    // ======= ======= ======= setMenuState ======= ======= =======
    function setMenuState(whichMenu, whichStates) {
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
            // checkIndex = $.inArray(nextFilterText, displayObj.filterTitlesArray);

            // == set filter menu state; leave only selected filters in filterTitlesArray
            if (nextState == "A") {
                $(nextElement).addClass("active");
                $(nextElement).removeClass("selected");
                $(nextElement).removeClass("deactivated");
                activateFilterLink(nextFilter);
            } else if (nextState == "D") {
                $(nextElement).removeClass("active");
                $(nextElement).removeClass("selected");
                $(nextElement).addClass("deactivated");
                $(nextElement).off("click");
            } else if (nextState == "S") {
                selectedFilterText = nextFilterText;
                displayObj.filterTitlesObject[whichMenu[0]] = selectedFilterText;
                $(nextElement).removeClass("deactivated");
                $(nextElement).addClass("active");
                $(nextElement).addClass("selected");
            }
        }
        updateFilterText(displayObj, whichMenu, selectedFilterText);
    }

    // ======= ======= ======= resetMenuState ======= ======= =======
    function resetMenuState(whichMenu) {
        console.log("resetMenuState");
        console.log("  displayObj.dataFilters.zones: ", displayObj.dataFilters.zones);

        // == restore levels menu for new zones selection (e.g. deactivate HS for feeders)
        if (whichMenu == "zones") {
            if (displayObj.dataFilters.zones == "Ward") {
                setMenuState(displayObj.zonesMenu, ["S", "A"]);
            } else if (displayObj.dataFilters.zones == "FeederHS") {
                if ((displayObj.dataFilters.levels == "HS") || (displayObj.dataFilters.levels == "MS")) {
                    // setMenuState(displayObj.levelsMenu, ["D", "S", "A"]);
                } else if (displayObj.dataFilters.levels == "ES") {
                    // setMenuState(displayObj.levelsMenu, ["D", "A", "S"]);
                }
                setMenuState(displayObj.zonesMenu, ["A", "S"]);
            } else if (displayObj.dataFilters.zones == "FeederMS") {
                // setMenuState(displayObj.levelsMenu, ["D", "D", "S"]);
                setMenuState(displayObj.zonesMenu, ["A", "A"]);
            } else {
                setMenuState(displayObj.zonesMenu, ["A", "A"]);
            }

        // == set levels menu according to zones selection (e.g. deactivate HS for feeders)
        } else if (whichMenu == "levels") {
            if (displayObj.dataFilters.levels == "HS") {
                if (displayObj.dataFilters.zones == "Ward") {
                    setMenuState(displayObj.levelsMenu, ["S", "A", "A"]);
                } else if ((displayObj.dataFilters.zones == "FeederHS") || (displayObj.dataFilters.zones == "FeederMS")) {
                    setMenuState(displayObj.levelsMenu, ["D", "S", "A"]);
                }
            } else if (displayObj.dataFilters.levels == "MS") {
                if (displayObj.dataFilters.zones == "Ward") {
                    setMenuState(displayObj.levelsMenu, ["A", "S", "A"]);
                } else if ((displayObj.dataFilters.zones == "FeederHS") || (displayObj.dataFilters.zones == "FeederMS")) {
                    setMenuState(displayObj.levelsMenu, ["D", "S", "A"]);
                }
            } else if (displayObj.dataFilters.levels == "ES") {
                if (displayObj.dataFilters.zones == "Ward") {
                    setMenuState(displayObj.levelsMenu, ["A", "A", "S"]);
                } else if (displayObj.dataFilters.zones == "FeederHS") {
                    setMenuState(displayObj.levelsMenu, ["D", "A", "S"]);
                } else if (displayObj.dataFilters.zones == "FeederMS") {
                    setMenuState(displayObj.levelsMenu, ["D", "D", "S"]);
                }
            }
        }
    }

    // ======= ======= ======= updateFilterText ======= ======= =======
    function updateFilterText(displayObj, whichMenu, filterText) {
        console.log("updateFilterText");

        // == displays current user filter selections as string in #filters-selections div
        var selectedFilterContainer = $("#filters-selections").children("h2");
        var nextFilter, checkNextFilter;

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

    // ======= ======= ======= clearFilterSelctions ======= ======= =======
    function clearFilterSelctions(displayObj, zonesCollectionObj) {
        console.log("clearFilterSelctions");

        displayObj.filterTitlesArray = [];
        displayObj.dataFilters.agency = "All";
        displayObj.dataFilters.levels = null;
        displayObj.dataFilters.zones = "Ward";
        displayObj.dataFilters.expend = null;
        displayObj.dataFilters.math = "spendAmount";
        zonesCollectionObj.zoneGeojson_A = null;
        zonesCollectionObj.zoneGeojson_B = null;
        zonesCollectionObj.zoneGeojson_AB = null;
        zonesCollectionObj.aggregatorArray = [];
        zonesCollectionObj.zoneA = "Ward";
        displayObj.filterTitlesObject = { "agency":"District and Charter Schools", "levels":null, "expend":null, "zones": "Ward" };
        displayObj.filterTitlesArray = [displayObj.agencyMenu[1].text, displayObj.zonesMenu[1].text];
        setMenuState(displayObj.agencyMenu, ["A", "A", "S"]);
        setMenuState(displayObj.levelsMenu, ["A", "A", "A"]);
        setMenuState(displayObj.zonesMenu, ["S", "A"]);
        setMenuState(displayObj.expendMenu, ["A", "A", "A"]);
        updateFilterText(displayObj);
    }

    // ======= ======= ======= activateSelectBox ======= ======= =======
    Display.prototype.activateSelectBox = function(windowId) {
        console.log("activateSelectBox");

        var self = this;
        $("#school-select").on('change',function(e){
            console.log("\nschool-select");

            // == clear previously hilited marker
            if (schoolsCollectionObj.selectedMarker) {
                resetMarker(schoolsCollectionObj.selectedMarker);
                schoolsCollectionObj.selectedMarker = null;
            }
            schoolsCollectionObj.selectedSchool = null;

            // == clear profile chart
            $("#searchWindow").val("");
            if ($('#profile-container').find('#profile').length) {
                $("#profile-container").fadeIn( "fast", function() {
                    console.log("*** FADEIN profile-container ***");
                });
            } else {
                clearProfileChart();
            };
            findSearchSchool();
        });
    }

    // ======= ======= ======= ======= ======= SEARCH ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= SEARCH ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= SEARCH ======= ======= ======= ======= =======

    // ======= ======= ======= findSearchSchool ======= ======= =======
    function findSearchSchool() {
        console.log("findSearchSchool");

        var searchSchoolName = null;
        updateHoverText(null);
        updateFilterText(displayObj);

        // == find school based on search window or select
        if ($("#searchWindow").val()) {
            searchSchoolName = $("#searchWindow").val();
        } else {
            searchSchoolName = $("#school-select").val();
        }
        console.log("  searchSchoolName: ", searchSchoolName);

        // == allow for multiple schools by adding to array
        var filterTitleContainer = $("#filters-selections").children("h2");
        var jsonData = schoolsCollectionObj.jsonData;
        var schoolCodeArray = buildSearchArray(jsonData, searchSchoolName);
        var tempSchoolText = displayFoundSchool(schoolCodeArray);
        var schoolText = tempSchoolText.substring(0, tempSchoolText.length - 2);
        $(filterTitleContainer).html(schoolText);
        $("#searchWindow").val("");
    }

    // ======= ======= ======= buildSearchArray ======= ======= =======
    function buildSearchArray(jsonData, searchSchoolName) {
        console.log("buildSearchArray");

        var nextSchool, schoolName;
        var schoolCodeArray = [];

        // ======= search school data by name =======
        for (var i = 0; i < jsonData.length; i++) {
            nextSchool = jsonData[i];
            schoolName = nextSchool.School;
            schoolCode = nextSchool.School_ID;
            if (schoolName) {
                var checkSchool = schoolName.indexOf(searchSchoolName);
                if (checkSchool > -1) {
                    console.log("  schoolCode: ", schoolCode);
                    schoolCodeArray.push([schoolCode, nextSchool]);
                }
            }
        }
        return schoolCodeArray;
    }

    // ======= ======= ======= displayFoundSchool ======= ======= =======
    function displayFoundSchool(schoolCodeArray) {
        console.log("displayFoundSchool");

        var filterTitleContainer = $("#filters-selections").children("h2");
        var schoolText, hoverText, nextSchool, nextSchoolName;

        // == display found school name or "no data" message
        if (schoolCodeArray.length > 0) {

            // == more than one school matches search
            if (schoolCodeArray.length > 1) {
                $(filterTitleContainer).css("font-size", "14px");
                schoolText = "<span class='filterLabel'>Multiple schools: </span>";
                hoverText = "<span class='filterLabel'>Multiple schools found. </span>Re-enter choice from options above map.";
                updateHoverText(hoverText);

            // == single school matches search
            } else {
                displayObj.activateClearButton();
                makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolCodeArray[0][1]);
                console.log("  schoolCodeArray: ", schoolCodeArray);
                updateHoverText(null);
                $(filterTitleContainer).css("font-size", "16px");
                schoolText = "<span class='filterLabel'>Your school: </span>";
                $("#profile-container").css("display", "table");
            }

            // == change to display mode
            $(filterTitleContainer).addClass("filterList");

            // == create autoComplete array, save on display object
            var schoolNamesArray = [];
            for (var i = 0; i < schoolCodeArray.length; i++) {
                nextSchool = schoolCodeArray[i][1];
                nextSchoolName = nextSchool.School;
                schoolText += nextSchoolName + ", ";
                schoolNamesArray.push(nextSchoolName);
            }
            displayObj.dataFilters.selectedSchool = schoolNamesArray;
        } else {
            $(filterTitleContainer).addClass("filterList");
            schoolText = "No data.  Please try again.  ";
        }
        return schoolText;
    }


    // ======= ======= ======= ======= ======= AJAX DATA ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= AJAX DATA ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= AJAX DATA ======= ======= ======= ======= =======

    // ======= ======= ======= importZoneDataA ======= ======= =======
    ZonesCollection.prototype.importZoneDataA = function() {
        console.log("\n----- importZoneDataA -----");

        var self = this;
        var selectedZonesArray = getZoneUrls(displayObj, zonesCollectionObj);
        var urlA = selectedZonesArray[0];
        var urlB = selectedZonesArray[1];
        var feederFlag = selectedZonesArray[2];

        // ======= get map geojson data =======
        $.ajax({
            dataType: "json",
            url: urlA
        }).done(function(geoJsonData, featureArray){
            console.log("*** ajax success ***");
            self.zoneGeojson_A = geoJsonData;
            console.dir(geoJsonData);

            // == get secondary map data for urlB
            if (feederFlag == true) {
                self.importZoneDataB(urlB);
            } else {
                self.zoneGeojson_B = null;
                self.zoneGeojson_AB = null;
                self.makeZoneLayer();
            }

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    // ======= ======= ======= importZoneDataB ======= ======= =======
    ZonesCollection.prototype.importZoneDataB = function(urlB) {
        console.log("\n----- importZoneDataB -----");

        var featuresA, featuresB, featuresAll;
        var self = this;

        $.ajax({
            dataType: "json",
            url: urlB
        }).done(function(geoJsonData, featureArray){
            console.log("*** ajax success ***");
            self.zoneGeojson_B = geoJsonData;
            featuresA = self.zoneGeojson_A.features;
            featuresB = self.zoneGeojson_B.features;
            featuresAll = featuresB.concat(featuresA);
            mergedGeojsonData = {
                "type": "FeatureCollection",
                "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                "features": featuresAll
            }
            self.zoneGeojson_AB = mergedGeojsonData;
            console.log("******* geoJson *******");
            console.dir(self.zoneGeojson_A);
            console.dir(self.zoneGeojson_B);
            console.dir(self.zoneGeojson_AB);
            self.makeZoneLayer();

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    // ======= ======= ======= importSchoolData ======= ======= =======
    SchoolsCollection.prototype.importSchoolData = function() {
        console.log("\n----- importSchoolData -----");

        var self = this;
        var url = "https://rawgit.com/codefordc/school-modernization/master/Output%20Data/DCSchools_FY1415_Master_412.csv";

        // ======= get selected data =======
        $.ajax({
            url: url,
            method: "GET",
            dataType: "text"
        }).done(function(textData) {
            console.log("*** ajax success ***");
            var jsonData = CSV2JSON(textData);
            console.dir(jsonData);
            self.jsonData = jsonData;
            displayObj.makeSelectBox(jsonData);
            displayObj.makeSearchAndHoverDisplay();

            // == get school names
            displayObj.schoolNamesArray = [];
            for (var i = 0; i < jsonData.length - 1; i++) {
                var nextSchool = jsonData[i];
                if (nextSchool) {
                    displayObj.schoolNamesArray.push(processSchoolName(nextSchool.School))
                }
            }
            initAutoComplete(displayObj);
            zonesCollectionObj.importZoneDataA();

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }



    // ======= ======= ======= ======= ======= ZONE LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONE LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONE LAYER ======= ======= ======= ======= =======

    ZonesCollection.prototype.makeZoneLayer = function() {
        console.log("\n----- makeZoneLayer -----");

        var self = this;
        var itemOpacity = 0.5;
        var strokeColor = "purple";
        var strokeWeight = 2;
        var itemColor, itemOpacity, centerLatLng, zoneName;

        // ======= ======= ======= cleanup ======= ======= =======
        map.data.forEach(function(feature) {
            if (feature) {
                zoneName = feature.getProperty('zoneName');
                map.data.remove(feature);
            }
        });
        this.zoneFeaturesArray = [];

        // ======= ======= ======= add single or merged geoJson to map ======= ======= =======
        var zoneAcount = this.zoneGeojson_A.features.length;
        if (this.zoneGeojson_AB) {
            map.data.addGeoJson(this.zoneGeojson_AB);
            var zoneBcount = this.zoneGeojson_B.features.length;
            var zoneABcount = this.zoneGeojson_AB.features.length;
        } else {
            map.data.addGeoJson(this.zoneGeojson_A);
            var zoneBcount = 0;
        }
        console.log("  zoneAcount: ", zoneAcount);
        console.log("  zoneBcount: ", zoneBcount);
        console.log("  zoneABcount: ", zoneABcount);

        // ======= ======= ======= ZONE AGGREGATOR ======= ======= =======
        // ======= ======= ======= ZONE AGGREGATOR ======= ======= =======
        // ======= ======= ======= ZONE AGGREGATOR ======= ======= =======

        zonesCollectionObj.zoneFeaturesArray = makeZoneFeatures();          // map zone GIS array
        var zoneSchoolsObject = makeZonePartitions();                       // object with empty arrays for schools in each zone
        addZonePartitions(zoneSchoolsObject);                               // add CityWide object for FeederHS zone
        schoolsCollectionObj.selectedSchoolsArray = selectAgencyLevel();    // filter schools by agency/level match
        console.log("  zoneSchoolsObject: ", zoneSchoolsObject);

        // ======= aggregate zone data and make map layers ======
        if (schoolsCollectionObj.selectedSchoolsArray.length > 0) {
            schoolsCollectionObj.makeSchoolLayer();
            partitionExpendMath(zoneSchoolsObject);
            var zoneTotalsObject = aggregateAllZones(zoneSchoolsObject);
            zonesCollectionObj.aggregator = zoneTotalsObject;
            zonesCollectionObj.aggregatorArray = zoneObjectToArray(zoneTotalsObject);
            // console.log("  ...selectedSchoolsArray: ", schoolsCollectionObj.selectedSchoolsArray);
            // console.log("  ...zoneFeaturesArray: ", zonesCollectionObj.zoneFeaturesArray);
            // console.log("  ...aggregator: ", zonesCollectionObj.aggregator);
            console.log("  ...aggregatorArray: ", zonesCollectionObj.aggregatorArray);
            printZoneData();
            setDataIncrement();
            formatZoneFeatures(zoneBcount);
        } else {
            displayFilterMessage("Sorry, no schools matched criteria.  Click CLEAR");
            clearProfileChart();
        }

        // ======= ======= ======= show rankings chart ======= ======= =======
        if ((displayObj.dataFilters.levels) || (displayObj.dataFilters.zones)) {
            if (displayObj.dataFilters.expend) {
                makeRankChart(zonesCollectionObj, schoolsCollectionObj, displayObj, zoneBcount);
            }
        }
    }

    // ======= ======= ======= makeZoneFeatures ======= ======= =======
    function makeZoneFeatures() {
        console.log("makeZoneFeatures");
        var featureIndex = -1;
        var zoneFeaturesArray = [];
        map.data.forEach(function(feature) {
            featureIndex++;
            zoneName = removeAbbreviations(feature.getProperty('NAME'))
            centerLatLng = makeZoneGeometry(feature);
            feature.setProperty('center', centerLatLng);
            feature.setProperty('zoneName', zoneName);
            feature.setProperty('featureIndex', featureIndex);
            zoneFeaturesArray.push(feature);
        });
        return zoneFeaturesArray;
    }

    // ======= ======= ======= makeZonePartitions ======= ======= =======
    function makeZonePartitions() {
        console.log("makeZonePartitions");
        var zones = {};
        var featureIndex = -1;
        if (zonesCollectionObj.zoneGeojson_AB) {
            var zoneBcount = zonesCollectionObj.zoneGeojson_B.features.length;
        } else {
            var zoneBcount = 0;
        }
        map.data.forEach(function(feature) {
            featureIndex++;
            if (featureIndex >= zoneBcount) {
                zoneName = removeAbbreviations(feature.getProperty('NAME'))
                if (!zones[zoneName]) {
                    zones[zoneName] = [];
                }
            }
        });
        return zones;
    }

    // ======= ======= ======= addZonePartitions ======= ======= =======
    function addZonePartitions(zoneSchools) {
        console.log("addZonePartitions");
        if (displayObj.dataFilters.zones == "FeederHS") {
            zoneSchools.CityWide = [];
        }
    }

    // ======= ======= ======= selectAgencyLevel ======= ======= =======
    function selectAgencyLevel() {
        console.log("selectAgencyLevel");
        var selectedSchoolsArray = [];
        var jsonData = schoolsCollectionObj.jsonData;
        for (var i = 0; i < (jsonData.length - 1); i++) {
            schoolIndex = i;
            nextSchool = jsonData[i];
            selectedSchool = agencyLevelFilters(nextSchool);

            // == build arrays of selected/not selected schools
            if (selectedSchool == true) {
                schoolData = getDataDetails(nextSchool, schoolIndex);
                selectedSchoolsArray.push(schoolData);
            }
        }
        return selectedSchoolsArray;
    }

    // ======= ======= ======= agencyLevelFilters ======= ======= =======
    function agencyLevelFilters(nextSchool) {
        console.log("agencyLevelFilters");

        var checkAgency = false;
        var agencyMatch, levelsMatch;

        // == check agency match (DCPS, PCS)
        if (displayObj.dataFilters.agency) {
            if (displayObj.dataFilters.agency != "All") {
                if (displayObj.dataFilters.agency == "District") {
                    checkAgency = "DCPS";
                } else if (displayObj.dataFilters.agency == "Charter") {
                    checkAgency = "PCS";
                }
                if (checkAgency == nextSchool.Agency) {
                    agencyMatch = true;
                } else {
                    agencyMatch = false;
                }
            } else {
                agencyMatch = true;
            }
        } else {
            agencyMatch = true;
        }

        // == check levels match (HS, ADULT, MS/HS, ALT; MS, SPED; ES, ES/MS; CLOSED)
        if (displayObj.dataFilters.levels) {
            if (displayObj.dataFilters.levels == "HS") {
                levelFilter = ["HS", "ADULT", "MS/HS", "ALT"];
                var checkLevel = levelFilter.indexOf(nextSchool.Level);
                if (checkLevel > -1) {
                    levelsMatch = true;
                }
            } else if (displayObj.dataFilters.levels == "MS") {
                levelFilter = ["MS", "SPED"];
                var checkLevel = levelFilter.indexOf(nextSchool.Level);
                if (checkLevel > -1) {
                    levelsMatch = true;
                }
            } else if (displayObj.dataFilters.levels == "ES") {
                levelFilter = ["ES", "ES/MS", "PK3-K"];
                var checkLevel = levelFilter.indexOf(nextSchool.Level);
                if (checkLevel > -1) {
                    levelsMatch = true;
                }
            }
        } else {
            levelsMatch = true;
        }

        if (nextSchool.Level == "CLOSED") {
            levelsMatch = true;
        }

        // == return match result
        if ((levelsMatch == true) && (agencyMatch == true)) {
            return true;
        } else {
            return false;
        }
    }

    // ======= ======= ======= partitionExpendMath ======= ======= =======
    function partitionExpendMath(zoneSchools) {
        console.log("partitionExpendMath");
        console.log("  displayObj.dataFilters.expend: ", displayObj.dataFilters.expend);
        console.log("  displayObj.dataFilters.math: ", displayObj.dataFilters.math);
        var partitionKey = displayObj.dataFilters.zones;
        var schoolCount = 0;
        schoolsCollectionObj.selectedSchoolsArray.forEach(function(school) {
            var zone = school[partitionKey];
            var zoneName = standardizeZoneName(zone);
            if ((zoneName) && (zoneName != "NA")) {
                // if (displayObj.dataFilters.expend) {
                //     var selectedSchool = expendMathFilters(school);
                //     if (selectedSchool) {
                //         if (school.Ward == 8) {
                //             schoolCount++;
                //             // console.log("maxOccupancy", school.schoolName, school.Open_Now, school.maxOccupancy);
                //             // console.log(school.maxOccupancy);
                //             console.log(school.totalSQFT);
                //         }
                //         zoneSchools[zoneName].push(school);
                //     }
                // } else {
                    zoneSchools[zoneName].push(school);
                // }
            }
        });
        console.log("  schoolCount: ", schoolCount);
    }

    // ======= ======= ======= expendMathFilters ======= ======= =======
    function expendMathFilters(nextSchool) {
        // console.log("expendMathFilters");
        // expend: MajorExp9815, spendPlanned, spendLifetime
        // math: spendAmount, spendEnroll, spendSqFt

        // == check expend (past/future/total) and math (amount/perEnroll/perSqft) filter matches
        var expendMatch = false;
        var mathMatch = false;

        // == past
        if (displayObj.dataFilters.expend == "MajorExp9815") {
            if (nextSchool.MajorExp9815 != "NA") {
                expendMatch = true;

                // == expenditure per student (max capacity) or per sqft
                if (displayObj.dataFilters.math) {
                    if (displayObj.dataFilters.math == "spendEnroll") {
                        if ((nextSchool.maxOccupancy != "NA") && (nextSchool.Open_Now > 0)) {
                        // if (nextSchool.maxOccupancy != "NA") {
                            mathMatch = true;
                        }
                    } else if (displayObj.dataFilters.math == "spendSqFt") {
                        if ((nextSchool.totalSQFT != "NA") && (nextSchool.Open_Now > 0)) {
                        // if (nextSchool.totalSQFT != "NA") {
                            console.log("  nextSchool.schoolName: ", nextSchool.schoolName);
                            mathMatch = true;
                        }
                    } else {
                        mathMatch = true;
                    }
                } else {
                    mathMatch = true;
                }
            }

        // == future
        } else if (displayObj.dataFilters.expend == "spendPlanned") {
            if (nextSchool.TotalAllotandPlan1621 != "NA") {
                expendMatch = true;

                // == expenditure per student (max capacity) or per sqft
                if (displayObj.dataFilters.math) {
                    if (displayObj.dataFilters.math == "spendEnroll") {
                        if ((nextSchool.maxOccupancy != "NA") && (nextSchool.Open_Now > 0)) {
                        // if (nextSchool.maxOccupancy != "NA") {
                            mathMatch = true;
                        }
                    } else if (displayObj.dataFilters.math == "spendSqFt") {
                        if ((nextSchool.totalSQFT != "NA") && (nextSchool.Open_Now > 0)) {
                        // if (nextSchool.totalSQFT != "NA") {
                            mathMatch = true;
                        }
                    } else {
                        mathMatch = true;
                    }
                } else {
                    mathMatch = true;
                }
            }

        // == total
        } else if (displayObj.dataFilters.expend == "spendLifetime") {
            if (nextSchool.LifetimeBudget != "NA") {
                expendMatch = true;

                // == expenditure per student (max capacity) or per sqft
                if (displayObj.dataFilters.math) {
                    if (displayObj.dataFilters.math == "spendEnroll") {
                        if ((nextSchool.maxOccupancy != "NA") && (nextSchool.Open_Now > 0)) {
                        // if (nextSchool.maxOccupancy != "NA") {
                            mathMatch = true;
                        }
                    } else if (displayObj.dataFilters.math == "spendSqFt") {
                        if ((nextSchool.totalSQFT != "NA") && (nextSchool.Open_Now > 0)) {
                        // if (nextSchool.totalSQFT != "NA") {
                            mathMatch = true;
                        }
                    } else {
                        mathMatch = true;
                    }
                } else {
                    mathMatch = true;
                }
            }
        }

        // == return match result
        if ((expendMatch == true) && (mathMatch == true)) {
            return true;
        } else {
            return false;
        }
    }

    // ======= ======= ======= aggregateAllZones ======= ======= =======
    function aggregateAllZones(zoneSchools) {
        // console.log("aggregateAllZones");
        var featureIndex = -1;
        var zoneTotals = {};
        for (zone in zoneSchools) {
            // console.log("*** zone: ", zone);
            featureIndex++;
            // featureIndex, zoneName, schoolCount, SqFtPerEnroll
            // zoneAmount, amountMin, amountMax, amountAvg, amountMed
            // zonePastPerEnroll, zoneFuturePerEnroll, zoneTotalPerEnroll, zoneEnroll, enrollMin, enrollMax, enrollAvg, enrollMed
            // zonePastPerSqft, zoneFuturePerSqft, zoneTotalPerSqft, zoneSqft, sqftMin, sqftMax, sqftAvg, sqftMed
            var zoneDataObject = {
                featureIndex: featureIndex,
                zoneName: zone,
                schoolCount: zoneSchools[zone].length,
                SqFtPerEnroll: 0,

                zoneAmount: 0,
                amountMin: 0,
                amountMax: 0,
                amountAvg: 0,
                amountMed: 0,

                zonePastPerEnroll: 0,
                zoneFuturePerEnroll: 0,
                zoneTotalPerEnroll: 0,
                zoneEnroll: 0,
                enrollMin: 0,
                enrollMax: 0,
                enrollAvg: 0,
                enrollMed: 0,
                expendPerEnroll: 0,

                zonePastPerSqft: 0,
                zoneFuturePerSqft: 0,
                zoneTotalPerSqft: 0,
                zoneSqft: 0,
                sqftMin: 0,
                sqftMax: 0,
                sqftAvg: 0,
                sqftMed: 0,
                expendPerSqft: 0
            };
            var schoolsInZone = zoneSchools[zone];
            aggregateEachZone(schoolsInZone, zoneDataObject, zoneTotals);
        }
        return zoneTotals;
    }

    // ======= ======= ======= aggregateEachZone ======= ======= =======
    function aggregateEachZone(schoolsInZone, zoneDataObject, zoneTotals) {
        // console.log("aggregateEachZone");
        // console.log("  schoolsInZone.length: ", schoolsInZone.length);
        var zoneSchoolNamesArray = [];
        var amountNAarray = [];
        var zeroAmountArray = [];
        var expendFilter = displayObj.dataFilters.expend;

        schoolsInZone.forEach(function(school, index) {

            // ======= ======= ======= EXPENDITURE (past/future/total) ======= ======= =======
            if (school[expendFilter] != "NA") {
                zoneDataObject.zoneAmount += parseInt(school[expendFilter]);
                // zoneDataObject.zonePast += parseInt(school.MajorExp9815);
                // zoneDataObject.zoneFuture += parseInt(school.TotalAllotandPlan1621);
                // zoneDataObject.zoneTotal += parseInt(school.LifetimeBudget);

                // == calculate past/future/total median
                if (index == Math.ceil(zoneDataObject.schoolCount/2)) {
                    if (zoneDataObject.schoolCount % 2 == 0) {
                        var schoolA = schoolsInZone[zoneDataObject.schoolCount/2 - 1];
                        var schoolB = schoolsInZone[zoneDataObject.schoolCount/2];
                        var amountMed = (parseInt(schoolA[expendFilter]) + parseInt(schoolB[expendFilter]))/2;
                    } else {
                        var schoolA = schoolsInZone[Math.ceil(zoneDataObject.schoolCount/2)];
                        var amountMed = parseInt(schoolA[expendFilter]);
                    }
                    zoneDataObject.amountMed = parseInt(amountMed);
                }

                // == calculate past/future/total min/max
                if (parseInt(school[expendFilter]) > zoneDataObject.amountMax) {
                    zoneDataObject.amountMax = parseInt(school[expendFilter]);
                }
                if (index == 0) {
                    zoneDataObject.amountMin = parseInt(school[expendFilter]);
                } else {
                    if (parseInt(school[expendFilter]) <= zoneDataObject.amountMin) {
                        zoneDataObject.amountMin = parseInt(school[expendFilter]);
                    }
                }
            } else if (school[expendFilter] == "NA"){
                console.log("  NA index: ", school.schoolIndex);
                amountNAarray.push(school);
            } else {
                console.log("  0 VALUE index: ", school.schoolIndex);
                zeroAmountArray.push(school);
            }

            // ======= ======= ======= ENROLLMENT ======= ======= =======
            if (school.maxOccupancy != "NA") {
                zoneDataObject.zoneEnroll += parseInt(school.maxOccupancy);
                zoneSchoolNamesArray.push(school.schoolName)

                // == calculate enrollment median
                if (index == Math.ceil(zoneDataObject.schoolCount/2)) {
                    if (zoneDataObject.schoolCount % 2 == 0) {
                        var schoolA = schoolsInZone[zoneDataObject.schoolCount/2 - 1];
                        var schoolB = schoolsInZone[zoneDataObject.schoolCount/2];
                        var enrollMed = (parseInt(schoolA.maxOccupancy) + parseInt(schoolB.maxOccupancy))/2;
                    } else {
                        var schoolA = schoolsInZone[Math.ceil(zoneDataObject.schoolCount/2)];
                        var enrollMed = parseInt(schoolA.maxOccupancy);
                    }
                    zoneDataObject.enrollMed = enrollMed;
                }

                // == calculate enrollment min/max
                if (parseInt(school.maxOccupancy) > zoneDataObject.enrollMax) {
                    zoneDataObject.enrollMax = parseInt(school.maxOccupancy);
                }
                if (index == 0) {
                    zoneDataObject.enrollMin = parseInt(school.maxOccupancy);
                } else {
                    if (parseInt(school.maxOccupancy) <= zoneDataObject.enrollMin) {
                        zoneDataObject.enrollMin = parseInt(school.maxOccupancy);
                    }
                }
            } else if (school.maxOccupancy == "NA"){
                // console.log("  NA index: ", index);
            } else {
                // console.log("  0 VALUE index: ", index);
            }
            // if (school.SpentPerMaxOccupancy != "NA") {
            //     zoneDataObject.zonePastPerEnroll += parseInt(school.SpentPerMaxOccupancy);
            // }
            // if (school.TotalAllotandPlan1621perMaxOcc != "NA") {
            //     zoneDataObject.zoneFuturePerEnroll += parseInt(school.TotalAllotandPlan1621perMaxOcc);
            // }
            // if (school.LifetimeBudgetperMaxOcc != "NA") {
            //     zoneDataObject.zoneTotalPerEnroll += parseInt(school.LifetimeBudgetperMaxOcc);
            // }

            // ======= ======= ======= SQFT ======= ======= =======
            if (school.totalSQFT != "NA") {
                zoneDataObject.zoneSqft += parseInt(school.totalSQFT);

                // == calculate sqft median
                if (index == Math.ceil(zoneDataObject.schoolCount/2)) {
                    if (zoneDataObject.schoolCount % 2 == 0) {
                        var schoolA = schoolsInZone[zoneDataObject.schoolCount/2 - 1];
                        var schoolB = schoolsInZone[zoneDataObject.schoolCount/2];
                        var sqftMed = (parseInt(schoolA.totalSQFT) + parseInt(schoolB.totalSQFT))/2;
                    } else {
                        var schoolA = schoolsInZone[Math.ceil(zoneDataObject.schoolCount/2)];
                        var sqftMed = parseInt(schoolA.totalSQFT);
                    }
                    zoneDataObject.sqftMed = sqftMed;
                }

                // == calculate sqft min/max
                if (parseInt(school.totalSQFT) > zoneDataObject.sqftMax) {
                    zoneDataObject.sqftMax = parseInt(school.totalSQFT);
                }
                if (index == 0) {
                    zoneDataObject.sqftMin = parseInt(school.totalSQFT);
                } else {
                    if (parseInt(school.totalSQFT) <= zoneDataObject.sqftMin) {
                        zoneDataObject.sqftMin = parseInt(school.totalSQFT);
                    }
                }
            } else if (school.totalSQFT == "NA"){
                // console.log("  NA index: ", index);
            } else {
                // console.log("  0 VALUE index: ", index);
            }
            // if (school.SpentPerSqFt != "NA") {
            //     zoneDataObject.zonePastPerSqft += parseInt(school.SpentPerSqFt);
            // }
            // if (school.TotalAllotandPlan1621perGSF != "NA") {
            //     zoneDataObject.zoneFuturePerSqft += parseInt(school.TotalAllotandPlan1621perGSF);
            // }
            // if (school.LifetimeBudgetperGSF != "NA") {
            //     zoneDataObject.zoneTotalPerSqft += parseInt(school.LifetimeBudgetperGSF);
            // }
        });
        zoneDataObject.expendPerEnroll = parseInt(zoneDataObject.zoneAmount/zoneDataObject.zoneEnroll);
        zoneDataObject.expendPerSqft = parseInt(zoneDataObject.zoneAmount/zoneDataObject.zoneSqft);
        zoneDataObject.zoneSchoolNamesArray = zoneSchoolNamesArray;
        zoneTotals[zone] = zoneDataObject;
        // console.log("  zoneDataObject: ", zoneDataObject);
    }

    // ======= ======= ======= printZoneData ======= ======= =======
    //  zoneDataObject.zoneAmount, zoneDataObject.zoneEnroll, zoneDataObject.zoneTotalPerEnroll, zoneDataObject.zoneSqft, zoneDataObject.expendPerSqft

    function printZoneData() {
        console.log("printZoneData");
        console.log("  zonesCollectionObj.aggregatorArray: ", zonesCollectionObj.aggregatorArray);
        var periodCheckString = "zone     zoneAmount\n";
        zonesCollectionObj.aggregatorArray.forEach(function(zoneDataObject) {
            periodCheckString +=
            zoneDataObject.zoneName + ": " +
            zoneDataObject.zoneAmount + "\n";
        });
        console.log(periodCheckString);
        var enrollCheckString = "zone     zoneAmount     zoneEnroll     zoneAmount/zoneEnroll \n";
        zonesCollectionObj.aggregatorArray.forEach(function(zoneDataObject) {
            enrollCheckString +=
            zoneDataObject.zoneName + ": " +
            zoneDataObject.zoneAmount + ": " +
            zoneDataObject.zoneEnroll + ": " +
            zoneDataObject.expendPerEnroll + ": " +
            parseInt(zoneDataObject.zoneAmount/zoneDataObject.zoneEnroll) + "\n";
        });
        console.log(enrollCheckString);
        var sqftCheckString = "zone     zoneAmount     zoneSqft     zoneAmount/zoneSqft \n";
        zonesCollectionObj.aggregatorArray.forEach(function(zoneDataObject) {
            sqftCheckString +=
            zoneDataObject.zoneName + ": " +
            zoneDataObject.zoneAmount + ": " +
            zoneDataObject.zoneSqft + ": " +
            zoneDataObject.expendPerSqft + ": " +
            parseInt(zoneDataObject.zoneAmount/zoneDataObject.zoneSqft) + "\n";
        });
        console.log(sqftCheckString);
    }

    // ======= ======= ======= zoneObjectToArray ======= ======= =======
    function zoneObjectToArray(zoneTotalsObject) {
        console.log("zoneObjectToArray");
        var zoneDataObject;

        // == create array and calculate average, perEnroll and perSqft values
        var aggregatorArray = _.map(zoneTotalsObject, function(value, key){
            zoneDataObject = {
                featureIndex:value.featureIndex,
                zoneName:value.zoneName,
                schoolCount:value.schoolCount,
                SqFtPerEnroll:value.SqFtPerEnroll,

                zoneAmount:value.zoneAmount,
                amountMin:value.amountMin,
                amountMax:value.amountMax,
                amountAvg:parseInt(value.zoneAmount/value.schoolCount),
                amountMed:value.amountMed,

                zonePastPerEnroll:parseInt(value.zonePastPerEnroll/value.schoolCount),
                zoneFuturePerEnroll:parseInt(value.zoneFuturePerEnroll/value.schoolCount),
                zoneTotalPerEnroll:parseInt(value.zoneTotalPerEnroll/value.schoolCount),
                zoneEnroll:value.zoneEnroll,
                enrollMin:value.enrollMin,
                enrollMax:value.enrollMax,
                enrollAvg:parseInt(value.zoneEnroll/value.schoolCount),
                enrollMed:value.enrollMed,
                expendPerEnroll:value.expendPerEnroll,

                zonePastPerSqft:parseInt(value.zonePastPerSqft/value.schoolCount),
                zoneFuturePerSqft:parseInt(value.zoneFuturePerSqft/value.schoolCount),
                zoneTotalPerSqft:parseInt(value.zoneTotalPerSqft/value.schoolCount),
                zoneSqft:value.zoneSqft,
                sqftMin:value.sqftMin,
                sqftMax:value.sqftMax,
                sqftAvg:parseInt(value.zoneSqft/value.schoolCount),
                sqftMed:value.sqftMed,
                expendPerSqft:value.expendPerSqft
            }

            return zoneDataObject;
        });
        return aggregatorArray;
    }

    // ======= ======= ======= setDataIncrement ======= ======= =======
    function setDataIncrement(schoolsInZone, zoneDataObject, zoneTotals) {
        // console.log("setDataIncrement");
        if (displayObj.dataFilters.expend) {
            zonesCollectionObj.dataIncrement = calcDataIncrement(zonesCollectionObj, displayObj);
        }
    }

    // ======= ======= ======= formatZoneFeatures ======= ======= =======
    function formatZoneFeatures(zoneBcount) {
        console.log("formatZoneFeatures");

        // == format zone "layers" independently
        if (zoneBcount > 0) {
            var featureIndex = -1;

            // == elementary or middle school zones in feeder areas
            console.log("*** LOWER ZONES ***");
            for (var i = 0; i < zoneBcount; i++) {
                featureIndex++;
                setZoneProperties("lower", i);
            }

            // == feeder zones or wards
            console.log("*** UPPER ZONES ***");
            for (var i = zoneBcount; i < zonesCollectionObj.zoneFeaturesArray.length; i++) {
                featureIndex++;
                setZoneProperties("upper", featureIndex, zoneBcount);
            }

        // == format single zone layer
        } else {
            zonesCollectionObj.zoneFeaturesArray.forEach(function(feature) {
                var zoneName = feature.getProperty('NAME');
                var featureIndex = feature.getProperty('featureIndex');

                // == build map feature if not "City-Wide"
                if (zoneName != "CityWide") {
                    setZoneProperties("single", featureIndex);
                }
            });
        }
    }

    // ======= ======= ======= setZoneProperties ======= ======= =======
    function setZoneProperties(whichLayer, featureIndex, zoneBcount) {
        // console.log("setZoneProperties");
        feature = zonesCollectionObj.zoneFeaturesArray[featureIndex];
        nextName = feature.getProperty('zoneName');
        if (zoneBcount > 0) {
            var zoneAIndex = featureIndex - zoneBcount;
        } else {
            var zoneAIndex = featureIndex;
        }

        // [itemColor, strokeColor, strokeWeight, itemOpacity];
        zoneFormatArray = getZoneFormat(zonesCollectionObj, displayObj, zoneAIndex, nextName, whichLayer);
        feature.setProperty('itemColor', zoneFormatArray[0]);
        feature.setProperty('strokeColor', zoneFormatArray[1]);
        feature.setProperty('strokeWeight', zoneFormatArray[2]);
        feature.setProperty('itemOpacity', zoneFormatArray[3]);
        setFeatureStyle(feature);
    }

    // ======= ======= ======= setFeatureStyle ======= ======= =======
    function setFeatureStyle(feature) {
        console.log("setFeatureStyle");

        // ======= colorize each feature based on colorList =======
        map.data.setStyle(function(feature) {
            var nextColor = feature.getProperty('itemColor');
            var strokeColor = feature.getProperty('strokeColor');
            var strokeWeight = feature.getProperty('strokeWeight');
            var nextOpacity = feature.getProperty('itemOpacity');
            return {
              fillColor: nextColor,
              strokeColor: strokeColor,
              strokeWeight: strokeWeight,
              fillOpacity: nextOpacity
            };
        });
    }

    // ======= ======= ======= standardizeZoneName ======= ======= =======
    function standardizeZoneName(zone) {
        // console.log("standardizeZoneName");
        if (displayObj.dataFilters.zones == "Ward") {
            var zoneName = "Ward " + zone;
        } else if (displayObj.dataFilters.zones == "FeederHS") {
            var feederFlag = zone.indexOf(" HS");
            if (feederFlag > -1) {
                zoneName = zone.slice(0,feederFlag);
            }
            if (zone == "City-Wide") {
                var zoneName = "CityWide";
            }
        }
        return zoneName;
    }



    // ======= ======= ======= ======= ======= SCHOOLS LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= SCHOOLS LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= SCHOOLS LAYER ======= ======= ======= ======= =======

    // ======= ======= ======= makeSchoolLayer ======= ======= =======
    SchoolsCollection.prototype.makeSchoolLayer = function(closedSchoolsArray) {
        console.log("\n----- makeSchoolLayer -----");

        var self = this;

        // ======= clear existing listeners if any =======
        removeMarkers(this);

        // == get data to load on markers
        for (var i = 0; i < this.selectedSchoolsArray.length; i++) {
            nextSchoolData = this.selectedSchoolsArray[i];
            var schoolMarker = this.setSchoolMarker(nextSchoolData, i);

            // == store marker on chart object
            this.schoolMarkersArray.push(schoolMarker);

            // == activate marker mouseover/mouseout
            this.activateSchoolMarker(schoolMarker, true);
        }
    }

    // ======= ======= ======= setSchoolMarker ======= ======= =======
    SchoolsCollection.prototype.setSchoolMarker = function(nextSchoolData, index) {
        console.log("setSchoolMarker");
        schoolMarker = null;
        nextSchool = nextSchoolData.schoolName;
        nextSchoolCode = nextSchoolData.schoolCode;
        nextSchoolType = nextSchoolData.schoolAgency;
        nextSchoolLevel = nextSchoolData.schoolLevel;
        nextSchoolIndex = index;
        nextSchoolAddress = nextSchoolData.schoolAddress;
        nextLat = nextSchoolData.schoolLAT;
        nextLng = nextSchoolData.schoolLON;
        schoolLoc = new google.maps.LatLng(nextLat, nextLng);

        // == set color of school circle
        if (nextSchoolType == "DCPS") {
            fillColor = "#7aa25c";
            strokeColor = "black";
        } else if (nextSchoolType == "PCS") {
            fillColor = "orange";
            strokeColor = "crimson ";
        }
        if (nextSchoolLevel == "CLOSED") {
            fillColor = "white";
            strokeColor = "crimson ";
        }

        // == show markers for available data
        var iconSize = 0.2;
        var icon = {
            path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
            fillColor: fillColor,
            strokeColor: strokeColor,
            fillOpacity: 1,
            strokeWeight: 1,
            scale: iconSize
        }

        var schoolMarker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: nextSchool,
            draggable: false,
            position: schoolLoc,
            schoolIndex: nextSchoolIndex,
            schoolName: nextSchool,
            schoolLevel: nextSchoolLevel,
            schoolCode: nextSchoolCode,
            schoolType: nextSchoolType,
            schoolAddress: nextSchoolAddress,
            defaultColor: fillColor
        });
        schoolMarker.setMap(map);
        return schoolMarker;
    }

    // ======= ======= ======= activateSchoolMarker ======= ======= =======
    SchoolsCollection.prototype.activateSchoolMarker = function(schoolMarker, mouseClick) {
        // console.log("activateSchoolMarker");

        // ======= mouseover event listener =======
        google.maps.event.addListener(schoolMarker, 'mouseover', function (event) {
            // console.log("--- mouseover ---");
            // updateHoverText(this.schoolName, this.schoolType, this.schoolCode);
            updateHoverText(this.schoolName, this.schoolType);
        });

        // ======= mouseout event listener =======
        google.maps.event.addListener(schoolMarker, 'mouseout', function (event) {
            // console.log("--- mouseout ---");
            updateHoverText(null);
        });

        // ======= click event listener =======
        if (mouseClick == true) {
            google.maps.event.addListener(schoolMarker, 'click', function (event) {
                console.log("--- click ---");
                // console.log("  schoolMarker.schoolIndex: ", schoolMarker.schoolIndex);
                makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, null, this);
            });
        }
    }

    // ======= ======= ======= setFilterSelections ======= ======= =======
    function setFilterSelections(agency, levels, expend, zones, math, presetMode) {
        console.log("******* setFilterSelections *******");

        // == pre-defined filter settings for introductory map displays
        displayObj.displayMode = presetMode;
        clearFilterSelctions(displayObj, zonesCollectionObj);
        updateHoverText(null);
        initMap(zonesCollectionObj, displayObj);

        // == agency
        if (agency) {
            displayObj.dataFilters.agency = agency;
            if (zonesCollectionObj.aggregatorArray.length > 0) {
                zonesCollectionObj.aggregatorArray = [];
                // clearZoneAggregator();
            }
        }

        // == levels
        if (levels) {
            displayObj.dataFilters.levels = levels;
            zonesCollectionObj.aggregatorArray = [];
            if (levels == "HS") {
                zonesCollectionObj.zoneA = "FeederHS";
            } else if (levels == "MS") {
                zonesCollectionObj.zoneA = "FeederMS";
            } else if (levels == "ES") {
                zonesCollectionObj.zoneA = "Elementary";
            } else {
                zonesCollectionObj.zoneA = "Ward";
            }
        }

        // == expend
        if (expend) {
            displayObj.dataFilters.expend = expend;
            if (zonesCollectionObj.aggregatorArray.length > 0) {
                clearZoneAggregator();
            }
        }

        // == zones
        if (zones) {
            zonesCollectionObj.zoneA = zones;
            displayObj.dataFilters.zones = zones;
            zonesCollectionObj.aggregatorArray = [];
        }

        // == math
        if (math) {
            console.log("math filter");
            displayObj.dataFilters.math = math;
        }

        updateHoverText(null);
        checkFilterSelection();
        zonesCollectionObj.importZoneDataA();
    }



    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======

    initMenuObjects();
    initDataObjects();
    displayObj.displayMode = presetMode;
    initMap(zonesCollectionObj, displayObj);

    this.jsonData = null;
    displayObj.activateFilterMenus();
    displayObj.activateClearButton();
    setMenuState(displayObj.agencyMenu, ["A", "A", "S"]);
    setMenuState(displayObj.zonesMenu, ["S", "A"]);
    schoolsCollectionObj.importSchoolData();
    checkFilterSelection("init");

    // == see importZoneDataA for parameter values
    return setFilterSelections;
}