var World = {

    initiallyLoadedData: false,
    markerDrawable_idle: null,

    markerList: [],
    currentMarker: null,
    currentLocation: null,

    loadPoisFromJsonData: function loadPoisFromJsonDataFn() {
        World.markerList = [];
        World.directionIndi = new AR.ImageResource("assets/indi.png");

        for (var i = 0; i < poiData.length; i++) {
            var thisPoi = {
                "id": poiData[i].id,
                "latitude": parseFloat(poiData[i].lat),
                "longitude": parseFloat(poiData[i].lon),
                "altitude": parseFloat(poiData[i].alt),
                "title": poiData[i].title,
                "class": poiData[i].class
            };

            World.markerList.push(new Marker(thisPoi));

        }
        consoleWrite(i + " 地標載入完畢");
        showBubble(i + " 個地標成功載入");
    },

    locationChanged: function locationChangedFn(lat, lon, alt, acc) {

        if (!World.initiallyLoadedData) {
            World.loadPoisFromJsonData();
            World.initiallyLoadedData = true;
        }
        World.updateDistance(lat, lon, alt, acc);
    },

    updateDistance: function updateDistanceFn(lat, lon, alt, acc) {
        updateAcc(acc);
        var distanceArray = [];
        for (var i = 0; i < World.markerList.length; i++) {
            var distance = World.markerList[i].markerObject.locations[0].distanceToUser();
            var distanceToUserValue = (distance > 999) ? ((distance / 1000).toFixed(2) + " km") : (Math.round(distance) + " m");
            World.markerList[i].distanceLabel.text = distanceToUserValue;
            distanceArray.push({ id: World.markerList[i].poiData.title, distance: Math.round(distance) });
            //World.markerList[i].markerObject.locations[0].altitude = alt;
        }
        distanceArray.sort(function (a, b) {
            return a.distance > b.distance ? 1 : -1;
        });

        if (distanceArray[0].distance < 10) {
            if (this.currentLocation != distanceArray[0].id) {
                this.currentLocation = distanceArray[0].id;
                this.onLocationArea(this.currentLocation, true);
                locationChanged(this.currentLocation, true);
            }
        } else {
            this.onLocationArea(this.currentLocation, false);
            this.currentLocation = null;
            locationChanged("", false);
        }

        var poiWait2Sort = ClusterHelper.createClusteredPlaces(30, { 'lat': lat, 'lon': lon }, poiData);
        var firstDistance;
        for (var i = 0; i < poiWait2Sort.length; i++) {
            if (poiWait2Sort[i].type == "cluster") {

                for (var j = 0; j < poiWait2Sort[i].places.length; j++) {

                    for (var k = 0; k < World.markerList.length; k++) {
                        if (World.markerList[k].poiData.id == poiWait2Sort[i].places[j].id) {

                            if (j != 0) {
                                var offset = Math.abs(Math.round(firstDistance - World.markerList[k].markerObject.locations[0].distanceToUser()));
                                World.markerList[k].markerObject.locations[0].altitude = alt + offset;
                            } else {
                                firstDistance = World.markerList[k].markerObject.locations[0].distanceToUser();
                                World.markerList[k].markerObject.locations[0].altitude = alt;
                            }
                        }
                    }
                }
            } else {
                for (var m = 0; m < World.markerList.length; m++) {
                    if (World.markerList[m].poiData.id == poiWait2Sort[i].places[0].id) {
                        World.markerList[m].markerObject.locations[0].altitude = alt;
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
                World.markerList[i].poiData.id == id ? World.markerList[i].directionIndi.enabled = true : World.markerList[i].markerObject.enabled = false;
            }
            else {
                World.markerList[i].poiData.id == id ? World.markerList[i].directionIndi.enabled = false : World.markerList[i].markerObject.enabled = true;
            }
        }
    },

    onLocationArea: function onLocationAreaFn(title, hide) {
        for (var i = 0; i < World.markerList.length; i++) {
            if (World.markerList[i].poiData.title == title) {
                hide ? World.markerList[i].markerObject.enabled = false : World.markerList[i].markerObject.enabled = true;
            }
        }
    },

    onLocationAreaPress: function onLocationAreaPressFn() {
        for (var i = 0; i < World.markerList.length; i++) {
            if (World.markerList[i].poiData.title == this.currentLocation) {
                this.onMarkerSelected(World.markerList[i]);
                showCard(true, World.markerList[i].poiData.id);
            }
        }
    }

};
AR.context.onLocationChanged = World.locationChanged;
AR.context.onScreenClick = World.onScreenClick;
AR.context.scene.scalingFactor = 0.5;
AR.context.scene.maxScalingDistance = 300;
