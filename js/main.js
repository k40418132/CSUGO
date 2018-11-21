var World = {

    initiallyLoadedData: false,
    markerDrawable_idle: null,

    markerList: [],
    currentMarker: null,
    currentLocation: null,
    currentClassMarker: null,
    clusterAngle: 0,
    altOffset: 0,
    flatMode:false,
    isNavigation:false,

    loadPoisFromJsonData: function loadPoisFromJsonDataFn(lat, lon) {
        World.markerList = [];
        World.directionIndi = new AR.ImageResource("assets/indi.png");

        for (var i = 0; i < poiData.length; i++) {
            var thisPoi = {
                "id": poiData[i].id,
                "lat": parseFloat(poiData[i].lat),
                "lon": parseFloat(poiData[i].lon),
                "altitude": parseFloat(poiData[i].alt),
                "title": poiData[i].title,
                "class": poiData[i].class,
                "color": poiData[i].color,
                "area": poiData[i].area,
                "userLat": lat,
                "userLon": lon
            };

            World.markerList.push(new Marker(thisPoi));

        }
        World.onMarkerClassFilter(0);
        consoleWrite(i + " 地標載入完畢");
        showBubble(i + " 個地標成功載入");
    },

    locationChanged: function locationChangedFn(lat, lon, alt, acc) {

        if (!World.initiallyLoadedData) {
            World.loadPoisFromJsonData(lat, lon);
            World.initiallyLoadedData = true;
        }
        World.updateDistance(lat, lon, alt, acc);
    },

    updateDistance: function updateDistanceFn(lat, lon, alt, acc) {
        updateLocationAccuracy(acc);
        drawUserLocation(lat, lon);
        consoleWrite(World.flatMode);
        if(World.flatMode)return;
        
        for (var i = 0; i < World.markerList.length; i++) {
            var distance = World.markerList[i].markerObject.locations[0].distanceToUser();
            var distanceToUserValue = (distance > 999) ? ((distance / 1000).toFixed(2) + " km") : (Math.round(distance) + " m");
            World.markerList[i].distanceLabel.text = distanceToUserValue;
            //World.markerList[i].markerObject.locations[0].altitude = alt;
        }


        var poiWait2Sort = ClusterHelper.createClusteredPlaces(this.clusterAngle, { 'lat': lat, 'lon': lon }, this.currentClassMarker);
        //consoleWrite("b: " + bubbleAngle + " c: " + this.clusterAngle + " offset: " + this.altOffset);
        for (var i = 0; i < poiWait2Sort.length; i++) {
            if (poiWait2Sort[i].type == "cluster") {

                for (var j = 0; j < poiWait2Sort[i].places.length; j++) {
                    for (var k = 0; k < World.markerList.length; k++) {
                        if (World.markerList[k].poiData.id == poiWait2Sort[i].places[j].id) {
                            var offset = j * this.altOffset;
                            World.markerList[k].markerObject.locations[0].altitude = alt + offset;
                            //consoleWrite(World.markerList[k].poiData.title+":"+offset);
                        }
                    }
                }
            } else {
                for (var m = 0; m < World.markerList.length; m++) {
                    if (World.markerList[m].poiData.id == poiWait2Sort[i].places[0].id) {
                        World.markerList[m].markerObject.locations[0].altitude = alt - 5;
                    }
                }
            }
        }
    },

    onMarkerSelected: function onMarkerSelectedFn(marker) {

        // deselect previous marker
        if (World.currentMarker) {
            if (World.currentMarker.poiData.id == marker.poiData.id) {
                return;
            }
            World.currentMarker.setDeselected(World.currentMarker);
        }
        World.currentMarker = marker;
    },

    onScreenClick: function onScreenClickFn() {
        if (World.currentMarker) {
            World.currentMarker.setDeselected(World.currentMarker);
        }
    },

    onLockedClick: function onLockedClickFn(id, toggle) {
        for (var i = 0; i < World.markerList.length; i++) {
            if (toggle) {
                showSearchPanel(false);
                if (World.markerList[i].poiData.id == id) {
                    showBubble("開始指引 " + World.markerList[i].poiData.title);
                    World.markerList[i].markerObject.enabled = true;
                    World.markerList[i].directionIndi.enabled = true;
                } else World.markerList[i].markerObject.enabled = false;
            }
            else if (World.markerList[i].poiData.id == id) {
                World.markerList[i].directionIndi.enabled = false;
                World.onMarkerClassFilter(this.currentClassMarker[0].class);
                return;
            }
        }
    },

    onLocationArea: function onLocationAreaFn(title, hide) {
        for (var i = 0; i < World.markerList.length; i++) {
            if (World.markerList[i].poiData.title == title) {
                if(hide){
                    World.markerList[i].markerObject.enabled = false;
                }else if(this.currentClassMarker[0].class == World.markerList[i].poiData.class)World.markerList[i].markerObject.enabled = true;
            }
        }
    },

    onLocationAreaPress: function onLocationAreaPressFn() {
        for (var i = 0; i < World.markerList.length; i++) {
            if (World.markerList[i].poiData.id == this.currentLocation) {
                this.onMarkerSelected(World.markerList[i]);
                showCard(true, World.markerList[i].poiData.id);
            }
        }
    },

    onMarkerClassFilter: function onMarkerClassFilterFn(filter) {
        this.currentClassMarker = [];
        for (var i = 0; i < World.markerList.length; i++) {
            if (filter == World.markerList[i].poiData.class) {
                World.markerList[i].markerObject.enabled = true;
                this.currentClassMarker.push(World.markerList[i].poiData);
            } else World.markerList[i].markerObject.enabled = false;
        }
    },

    onPoiGetDistance: function onPoiGetDistanceFn(id) {
        for (var i = 0; i < World.markerList.length; i++) {
            if (World.markerList[i].poiData.id == id) {
                var distance = World.markerList[i].markerObject.locations[0].distanceToUser();
                var distanceToUserValue = (distance > 999) ? ((distance / 1000).toFixed(2) + " km") : (Math.round(distance) + " m");
                return (distanceToUserValue);
            }
        }
    },

    onSearchPanelPoiClick: function onSearchPanelPoiClickFn(id) {
        for (var i = 0; i < World.markerList.length; i++) {
            if (World.markerList[i].poiData.id == id) {
                this.onMarkerSelected(World.markerList[i]);
                showCardDelay(World.markerList[i].poiData.id, true);
            }
        }
    },


    setMaxScalingDistance: function (value) {
        AR.context.scene.maxScalingDistance = value;
    },
    setMinScalingDistance: function (value) {
        AR.context.scene.minScalingDistance = value;
    },
    setScalingFactor: function (value) {
        AR.context.scene.scalingFactor = value;
    }

};
AR.context.onLocationChanged = World.locationChanged;
AR.context.onScreenClick = World.onScreenClick;
