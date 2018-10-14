function Marker(poiData) {

    this.isSelected = false;

    this.animationGroup_idle = null;
    this.animationGroup_selected = null;
    this.poiData = poiData;

    var markerLocation = new AR.GeoLocation(poiData.latitude, poiData.longitude, poiData.altitude);
    var markerIcon = new AR.ImageResource("assets/poi_marker/" + poiData.id + ".png");


    this.markerDrawable_idle = new AR.ImageDrawable(markerIcon, 2, {
        zOrder: 0,
        opacity: 1.0,
        onClick: Marker.prototype.onClickTrigger(this)
    });

    /*this.titleLabel = new AR.Label(poiData.title, 1, {
        zOrder: 1,
        translate: { y: 0.55 },
        style: {
            textColor: '#FFFFFF',
            fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
    });*/
    switch (poiData.class) {
        case "1":
            this.distanceLabel = new AR.Label("", 0.5, {
                zOrder: 1,
                translate: { x: 0, y: -0.7 },
                style: {
                    textColor: '#C87630',
                }
            });
            break;
        default:
            this.distanceLabel = new AR.Label("", 0.6, {
                zOrder: 1,
                translate: { x: 1.5, y: -0.4 },
                style: {
                    textColor: '#595959',
                }
            });
            break;
    }

    /*this.optionButton1 = new AR.ImageDrawable(World.button1, 0.5, {
        zOrder: 0,
        opacity: 0.0,
        translate: { x: 3, y: 1.5 }
    });
    this.optionButton2 = new AR.ImageDrawable(World.button2, 1, {
        zOrder: 0,
        opacity: 0.0,
        translate: { x: 3, y: 0 }
    });
    this.optionButton3 = new AR.ImageDrawable(World.button3, 1, {
        zOrder: 0,
        opacity: 0.0,
        translate: { x: 3, y: -1.5 }
    });*/

    this.directionIndi = new AR.ImageDrawable(World.directionIndi, 0.1, {
        enabled: false,
        verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
    });

    this.markerObject = new AR.GeoObject(markerLocation, {
        drawables: {
            cam: [this.markerDrawable_idle, this.distanceLabel],
            indicator: this.directionIndi
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
        /* var showOptionButton1 = new AR.PropertyAnimation(marker.optionButton1, "opacity", null, 1.0, speed);
         var showOptionButton2 = new AR.PropertyAnimation(marker.optionButton2, "opacity", null, 1.0, speed);
         var showOptionButton3 = new AR.PropertyAnimation(marker.optionButton3, "opacity", null, 1.0, speed);*/
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
        if (marker.poiData.class == "1") {
            var translateX5 = new AR.PropertyAnimation(marker.distanceLabel, "translate.y", null, -0.9, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
                amplitude: 2.0
            }));
            marker.animationGroup_selected = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL,
                [translateX1, translateX2, translateX3, translateX4, translateX5]);
        } else {
            var translateX5 = new AR.PropertyAnimation(marker.distanceLabel, "translate.x", null, 1.7, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
                amplitude: 2.0
            }));
            var translateX6 = new AR.PropertyAnimation(marker.distanceLabel, "translate.y", null, -0.5, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
                amplitude: 2.0
            }));
            marker.animationGroup_selected = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL,
                [translateX1, translateX2, translateX3, translateX4, translateX5, translateX6]);
        }

        /* marker.animationGroup_selected = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL,
             [showOptionButton1, showOptionButton2, showOptionButton3, translateX1, translateX2, translateX3]);*/

    }
    //marker.directionIndi.enabled = true;

    marker.markerObject.renderingOrder = 100;
    marker.animationGroup_selected.start();
    showCard(marker.isSelected, marker.poiData.id);
    consoleWrite(marker.poiData.title + "<br>" + (marker.isSelected ? "Selected" : "Deselected"));
}

Marker.prototype.setDeselected = function (marker) {
    marker.isSelected = false;
    if (marker.animationGroup_idle === null) {
        var speed = 200;

        /*var showOptionButton1 = new AR.PropertyAnimation(marker.optionButton1, "opacity", null, 0.0, speed);
        var showOptionButton2 = new AR.PropertyAnimation(marker.optionButton2, "opacity", null, 0.0, speed);
        var showOptionButton3 = new AR.PropertyAnimation(marker.optionButton3, "opacity", null, 0.0, speed);*/
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

        if (marker.poiData.class == "1") {
            var translateX5 = new AR.PropertyAnimation(marker.distanceLabel, "translate.y", null, -0.7, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
                amplitude: 2.0
            }));
            marker.animationGroup_idle = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL,
                [translateX1, translateX2, translateX3, translateX4, translateX5]);
        } else {
            var translateX5 = new AR.PropertyAnimation(marker.distanceLabel, "translate.x", null, 1.5, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
                amplitude: 2.0
            }));
            var translateX6 = new AR.PropertyAnimation(marker.distanceLabel, "translate.y", null, -0.4, speed, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_BACK, {
                amplitude: 2.0
            }));
            marker.animationGroup_idle = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL,
                [translateX1, translateX2, translateX3, translateX4, translateX5, translateX6]);
        }

        /*marker.animationGroup_idle = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL,
            [showOptionButton1, showOptionButton2, showOptionButton3, translateX1, translateX2, translateX3]);*/

    }
    //marker.directionIndi.enabled = false;
    marker.markerObject.renderingOrder = 0;
    marker.animationGroup_idle.start();
    showCard(marker.isSelected, marker.poiData.id);
    consoleWrite(marker.poiData.title + "<br>" + (marker.isSelected ? "Selected" : "Deselected"));
}