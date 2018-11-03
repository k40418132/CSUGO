function Marker(poiData) {

    this.isSelected = false;

    this.animationGroup_idle = null;
    this.animationGroup_selected = null;
    this.poiData = poiData;

    var markerLocation = new AR.GeoLocation(poiData.latitude, poiData.longitude, poiData.altitude);
    var markerIcon = new AR.ImageResource("assets/poi_marker/" + poiData.id + ".png");
    var iconSize, labelSize, labelColor;
    poiData.color == null ? labelColor = "#9b9b9b" : labelColor = poiData.color;
    switch (poiData.class) {
        case 0:
        case 5:
            iconSize = 2;
            labelSize = 0.6;
            this.labelX = 1.5;
            this.labelY = -0.4;
            this.labelTriggerX = 1.7;
            this.labelTriggerY = -0.5;
            break;
        case 2:
            iconSize = 1.5;
            labelSize = 0.65;
            this.labelX = 1.5;
            this.labelY = -0.4;
            this.labelTriggerX = 1.7;
            this.labelTriggerY = -0.5;
            break;
        case 3:
            iconSize = 3;
            labelSize = 0.65;
            this.labelX = 0;
            this.labelY = -0.5;
            this.labelTriggerX = 0;
            this.labelTriggerY = -0.55;
            break;
        case 4:
            iconSize = 2;
            labelSize = 0.6;
            this.labelX = 0;
            this.labelY = -0.7;
            this.labelTriggerX = 0;
            this.labelTriggerY = -0.9;
            break;
        case 6:
            iconSize = 1.8;
            labelSize = 0.6;
            this.labelX = 0;
            this.labelY = -0.5;
            this.labelTriggerX = 0;
            this.labelTriggerY = -0.6;
            break;
        default:
            iconSize = 2;
            labelSize = 0.6;
            this.labelX = 1.5;
            this.labelY = -0.4;
            this.labelTriggerX = 1.7;
            this.labelTriggerY = -0.5;
            break;
    }



    this.markerDrawable_idle = new AR.ImageDrawable(markerIcon, iconSize, {
        zOrder: 0,
        opacity: 1.0,
        onClick: Marker.prototype.onClickTrigger(this)
    });


    this.distanceLabel = new AR.Label("", labelSize, {
        zOrder: 1,
        translate: { x: this.labelX, y: this.labelY },
        style: {
            textColor: labelColor,
        }
    });


    this.directionIndi = new AR.ImageDrawable(World.directionIndi, 0.1, {
        enabled: false,
        verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
    });


    this.radarCircle = new AR.Circle(0.03, {
        horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.CENTER,
        opacity: 0.8,
        style: {
            fillColor: "#ffffff"
        }
    });

    this.radarCircleSelected = new AR.Circle(0.05, {
        horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.CENTER,
        opacity: 0.8,
        style: {
            fillColor: "#0066ff"
        }
    });

    this.radardrawables = [];
    this.radardrawables.push(this.radarCircle);

    this.radardrawablesSelected = [];
    this.radardrawablesSelected.push(this.radarCircleSelected);



    if (poiData.class == 0) {
        this.actionRange = [];
        var firstUserLocation = new AR.GeoLocation(poiData.userLat, poiData.userLon);
        if (!poiData.area) {
            poiData.area = [{
                "lat": poiData.latitude,
                "lon": poiData.longitude,
                "radius": 30
            }];
            
        }
        consoleWrite(poiData.area.length);
        for (var i = 0; i < poiData.area.length; i++) {
            var areaLocation = new AR.GeoLocation(poiData.area[i].lat, poiData.area[i].lon);
            this.actionRange.push(new AR.ActionRange(areaLocation, poiData.area[i].radius, {
                onEnter: function () {
                    if (World.currentLocation != poiData.id) {
                        World.currentLocation = poiData.id;
                        World.onLocationArea(poiData.title, true);
                        locationChanged(poiData.title, true);
                    }
                },
                onExit: function () {
                    if (World.currentLocation == poiData.id) {
                        World.currentLocation = null;
                        World.onLocationArea(poiData.title, false);
                        locationChanged("", false);
                    }
                }
            }));
            if (this.actionRange[i].isInArea(firstUserLocation)) {
                if (World.currentLocation != poiData.id) {
                    World.currentLocation = poiData.id;
                    World.onLocationArea(poiData.title, true);
                    locationChanged(poiData.title, true);
                }
            }
        }
    }


    this.markerObject = new AR.GeoObject(markerLocation, {
        drawables: {
            cam: [this.markerDrawable_idle, this.distanceLabel],
            indicator: this.directionIndi,
            radar: this.radardrawables
        }
    });

    return this;
}

Marker.prototype.onClickTrigger = function (marker) {
    return function () {
        if (marker.isSelected) {
            Marker.prototype.setDeselected(marker);
        } else {
            Marker.prototype.setSelected(marker);
            try {
                World.onMarkerSelected(marker);
            } catch (err) {
                consoleWrite(err);
            }
        }
        return true;
    }

};

Marker.prototype.setSelected = function (marker) {
    marker.isSelected = true;
    if (marker.animationGroup_selected === null) {
        var speed = 200;

        var translateX1 = new AR.PropertyAnimation(marker.markerDrawable_idle, "scale.x", null, 1.2, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));
        var translateX2 = new AR.PropertyAnimation(marker.markerDrawable_idle, "scale.y", null, 1.2, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));
        var translateX3 = new AR.PropertyAnimation(marker.distanceLabel, "scale.x", null, 1.2, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));
        var translateX4 = new AR.PropertyAnimation(marker.distanceLabel, "scale.y", null, 1.2, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));

        var translateX5 = new AR.PropertyAnimation(marker.distanceLabel, "translate.x", null, marker.labelTriggerX, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));
        var translateX6 = new AR.PropertyAnimation(marker.distanceLabel, "translate.y", null, marker.labelTriggerY, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));
        marker.animationGroup_selected = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL,
            [translateX1, translateX2, translateX3, translateX4, translateX5, translateX6]);

    }
    marker.markerObject.renderingOrder = 100;
    marker.animationGroup_selected.start();
    marker.markerObject.drawables.radar = marker.radardrawablesSelected;
    showCard(marker.isSelected, marker.poiData.id);
    consoleWrite(marker.poiData.title + "<br>" + (marker.isSelected ? "Selected" : "Deselected"));
}

Marker.prototype.setDeselected = function (marker) {
    marker.isSelected = false;
    if (marker.animationGroup_idle === null) {
        var speed = 200;

        var translateX1 = new AR.PropertyAnimation(marker.markerDrawable_idle, "scale.x", null, 1, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));
        var translateX2 = new AR.PropertyAnimation(marker.markerDrawable_idle, "scale.y", null, 1, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));
        var translateX3 = new AR.PropertyAnimation(marker.distanceLabel, "scale.x", null, 1, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));
        var translateX4 = new AR.PropertyAnimation(marker.distanceLabel, "scale.y", null, 1, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));

        var translateX5 = new AR.PropertyAnimation(marker.distanceLabel, "translate.x", null, marker.labelX, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));
        var translateX6 = new AR.PropertyAnimation(marker.distanceLabel, "translate.y", null, marker.labelY, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
            amplitude: 2.0
        }));
        marker.animationGroup_idle = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL,
            [translateX1, translateX2, translateX3, translateX4, translateX5, translateX6]);

    }
    marker.markerObject.renderingOrder = 0;
    marker.animationGroup_idle.start();
    marker.markerObject.drawables.radar = marker.radardrawables;
    showCard(marker.isSelected, marker.poiData.id);
    consoleWrite(marker.poiData.title + "<br>" + (marker.isSelected ? "Selected" : "Deselected"));

}