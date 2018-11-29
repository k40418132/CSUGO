function consoleWrite(context) {
  $("#consoleBox").append(context + "<br><br>");
  $("#consoleBox").animate({ scrollTop: $('#consoleBox').prop('scrollHeight') }, 300);
}
function showCard(show, id) {
  if (show) {
    $("#" + id).animate({ scrollTop: 0 }, 100);
    (screenOrientation) ? $("#" + id).css('transform', 'translateX(-50%) translateY(0%)') : $("#" + id).css('transform', 'translateX(0)')
    $("#" + id).addClass("Showed");
  } else {
    (screenOrientation) ? $("#" + id).css('transform', 'translateX(-50%) translateY(100%)') : $("#" + id).css('transform', 'translateX(100%)')
    $("#" + id).removeClass("Showed");
  }
}
function showCardDelay(id, delay) {
  setTimeout(function () { showCard(true, id) }, delay ? 180 : 0);
}

function showBubble(context) {
  if (context) bubbleNoticePool.push(context);

  if (bubbleNoticePool.length) {
    $("#bubble-notice").html(bubbleNoticePool[0]);
    $("#bubble-notice").css('animation', 'showBubble 5s');
  }
}

function showMenu(show) {
  (show) ? $("#menu").css('transform', 'translateX(-0%)') : $("#menu").css('transform', 'translateX(-100%)');
  if (!show) configProgress(1);
}

function showSearchPanel(show) {
  (show) ? $(".search-panel").css('transform', 'translateY(0%)') : $(".search-panel").css('transform', '');
}
function configProgress(status) {
  if (status) {
    localStorage.setItem("radar", $("#setting-radar").prop("checked"));
    localStorage.setItem("gps", $("#setting-gps").prop("checked"));
    localStorage.setItem("console", $("#setting-console").prop("checked"));
    localStorage.setItem("maxDistance", $("#maxDistance-slider").val());
    localStorage.setItem("minDistance", $("#minDistance-slider").val());
    localStorage.setItem("scaleFactor", $("#markerScale-slider").val());
    localStorage.setItem("bubbleAngle", $("#bubbleAngle-slider").val());
    localStorage.setItem("clusterAngle", $("#clusterAngle-slider").val());
    localStorage.setItem("altOffset", $("#altOffset-slider").val());
  } else {
    if (localStorage.getItem("radar") == null) {
      $("#configBtn").click();
      configProgress(1);
      return;
    }
    if (localStorage.getItem("radar") == "true") $("#setting-radar").click();
    if (localStorage.getItem("gps") == "true") $("#setting-gps").click();
    if (localStorage.getItem("console") == "true") $("#setting-console").click();

    var c_maxDistance = Number(localStorage.getItem("maxDistance"));
    var c_minDistance = Number(localStorage.getItem("minDistance"));
    var c_scaleFactor = Number(localStorage.getItem("scaleFactor"));
    var c_bubbleAngle = Number(localStorage.getItem("bubbleAngle"));
    var c_clusterAngle = Number(localStorage.getItem("clusterAngle"));
    var c_altOffset = Number(localStorage.getItem("altOffset"));

    if (c_maxDistance != 'null') {
      $("#maxDistance-output").html(c_maxDistance + "m");
      $("#maxDistance-slider").val(c_maxDistance);
      World.setMaxScalingDistance(c_maxDistance);
    }
    if (c_minDistance != 'null') {
      $("#minDistance-output").html(c_minDistance + "m");
      $("#minDistance-slider").val(c_minDistance);
      World.setMinScalingDistance(c_minDistance);
    }
    if (c_scaleFactor != 'null') {
      $("#markerScale-output").html(c_scaleFactor);
      $("#markerScale-slider").val(c_scaleFactor);
      World.setScalingFactor(c_scaleFactor);
    }
    if (c_bubbleAngle != 'null') {
      $("#bubbleAngle-output").html(c_bubbleAngle);
      $("#bubbleAngle-slider").val(c_bubbleAngle);
      bubbleAngle = c_bubbleAngle;
    }
    if (c_clusterAngle != 'null') {
      $("#clusterAngle-output").html(c_clusterAngle);
      $("#clusterAngle-slider").val(c_clusterAngle);
      World.clusterAngle = c_clusterAngle;
    }
    if (c_altOffset != 'null') {
      $("#altOffset-output").html(c_altOffset);
      $("#altOffset-slider").val(c_altOffset);
      World.altOffset = c_altOffset;
    }
    consoleWrite(localStorage.maxDistance);
    consoleWrite(localStorage.minDistance);
    consoleWrite(localStorage.scaleFactor);
    consoleWrite(bubbleAngle);
  }

}


function locked(e) {
  var id = $(e).parents(".side-card").attr('id');
  if (!$(e).hasClass("LOCK")) {
    if (id == World.currentLocation) {
      showBubble("已在地標範圍內");
      return;
    }
    $(e).addClass("LOCK");
    $(".btn-panel .fa-location-arrow").parent().addClass("showArrow");
    World.onLockedClick(id, 1);
    World.onScreenClick();
  } else {
    $(e).removeClass("LOCK");
    World.onLockedClick(id, 0);
    $(".btn-panel .fa-location-arrow").parent().removeClass("showArrow");
  }
}

function locationChanged(title, display) {
  if (display) {
    $("#location").css('display', 'block');
    $("#location span").html(title);
    $("#location").css('animation', 'locationChanged 5s');
  } else {
    $("#location").css('display', 'none');
  }
}

function onOrientationchange() {
  if (window.orientation === 180 || window.orientation === 0) {
    consoleWrite("直式");

    World.onScreenClick();
    $(".side-card").css('display', 'none');
    $(".side-card").css('transform', 'translateX(-50%) translateY(100%)');
    setTimeout(function () { $(".side-card").css('display', 'block'); }, 100);
    screenOrientation = true;  //直式
  }
  if (window.orientation === 90 || window.orientation === -90) {
    consoleWrite("橫式");

    World.onScreenClick();
    $(".side-card").css('display', 'none');
    $(".side-card").css('transform', 'translateX(100%)');
    setTimeout(function () { $(".side-card").css('display', 'block'); }, 100);

    screenOrientation = false; //橫式
  }
}

function keyWordInitial() {
  for (var i = 0; i < poiData.length; i++) {
    if (!poiData[i].keyword) poiData[i].keyword = {};
    $("#" + poiData[i].id + " .floor tr:not(.thr)").each(function (index) {
      var c = $(this).find("td:first").text();
      poiData[i].keyword[index + 1] = {};
      if (c) {
        poiData[i].keyword[index + 1].floor = c;
      }
    })
    $("#" + poiData[i].id + " .floor tr:not(.thr)").each(function (index) {
      var c = "";
      $(this).find("td:last p").each(function () { c += $(this).text() + "," });

      if (c) poiData[i].keyword[index + 1].ky = $.trim(c);
    })
    var bID = $("#" + poiData[i].id + " .bID").html();
    if (!poiData[i].keyword[0]) poiData[i].keyword[0] = { "ky": "" };
    if (bID != 0 && bID) poiData[i].keyword[0].ky += bID + " (編號),";
    poiData[i].keyword[0].ky += poiData[i].title + ",";
  }
  console.log("Keyword初始化");
}



function updateLocationAccuracy(acc,inApp) {
  if (inApp) {
    World.isRuninApp = true;
    $(".gps-acc span").html("公尺");
  }else $(".gps-acc span").html("等級");
  acc > 9 ? $(".gps-acc").addClass("spacingBalance") : $(".gps-acc").removeClass("spacingBalance");

  var demo = new CountUp('acc', Number($("#acc").html()), acc, 0, 1);
  if (!demo.error) {
    demo.start();
  } else {
    console.error(demo.error);
  }

  if ((acc == 1 && !inApp) || acc > 25) {
    if ($("#setting-gps").prop('checked')) showBubble("GPS信號不穩定");
    $("#gps-dashboard p:first").html("不穩定");
    $("#menu-nav").removeClass();
    $("#menu-nav").addClass("acc-danger");
  } else if ((acc == 2 && !inApp) || acc > 12 && acc <= 25 ) {
    $("#gps-dashboard p:first").html("良好");
    $("#menu-nav").removeClass();
    $("#menu-nav").addClass("acc-warning");
  } else if((acc == 1 && !inApp) || acc < 12 ) {
    $("#gps-dashboard p:first").html("最佳");
    $("#menu-nav").removeClass();
  }
  consoleWrite("Gps: "+acc);
}


/*function initLocationAccuracy() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(updateLocationAccuracy);
    showBubble("支援Geolocation");
  } else {
    showBubble("不支援Geolocation");
  }
}*/




$(function () {
  $(".square").css("top", $("#loading-mask h1").prop('offsetTop') - 80 + 'px');
  $(".spinner").css("top", $("#loading-mask h1").prop('offsetTop') + 70 + 'px');
  $(".squareLine").css("top", $("#loading-mask h1").prop('offsetTop') - 71 + 'px');
  var offset = [[-50, -880], [-40, 240], [60, -4120], [-30, -2940], [30, 2100], [-170, 670], [100, -2150], [170, -2140], [-150, 1020], [160, -1740], [-270, -410], [-120, 2060]];
  var offsetTop = $("#loading-mask").prop('clientHeight') / 2;
  var offsetWidth = $("#loading-mask").prop('clientWidth') / 2;
  $(".stick").each(function (i) {
    $(this).css({
      'transform': 'translate(' + offset[i][0] + '%,' + offset[i][1] + '%) rotate(-45deg)',
      'top': offsetTop + 'px',
      'left': offsetWidth + 'px'
    })
  })
  console.log(offsetTop + "," + offsetWidth);
  setTimeout(function () {
    $("#loading-white").fadeOut(500);
    $(".spinner").delay(2000).fadeIn(300);
  }, 1000);

  setTimeout('InitPart1()',5000);
})

function InitPart1(){

  

  $("area").click(function (e) {
    e.preventDefault();
    var id = $(this).attr('title');
    $(".side-card.Showed").each(function () { 
      if(id != $(this).attr('id'))showCard(0, $(this).attr('id'));     
    });
    $("#" + id).hasClass("Showed") ? showCard(0, id) : showCard(1, id);
  })

  $(".nav-btn .fa-map-marked-alt").parent().parent().click(function () {
    var id = $(this).parents(".side-card").attr('id');
    if (id == World.currentLocation) {
      showBubble("已在地標範圍內");
      return;
    }
    if (!$("#flatmap").hasClass("switchMode")) {
      $('#flatmap').toggleClass('switchMode');
      $(".mode-panel").toggleClass('switchMode');
      World.flatMode = true;
    }
    var $div = $(this);
    setTimeout(function(){
      routeNavigation($div);
      $("#target-location").show();
      $(".mode-panel").hasClass('switchMode') ? AR.hardware.camera.enabled = false : AR.hardware.camera.enabled = true;
    },1000);
    $(".fa-route").parent().addClass("showRoute");
    World.onScreenClick();
    $(".Showed").each(function(){showCard(0,$(this).attr('id'))});
    showSearchPanel(false);
    $(".classList").removeClass("showList");
    $(".mode-panel .fa-crosshairs").parent().click();
    
  })

  $(".mode-panel .fa-route").parent().click(function(){
    showBubble("取消路線引導");
    $(this).removeClass("showRoute");
    cancelRoute();
  })

  $(".side-card").each(function(i){
    if(!poiData[i].url){
      $(this).find(".fa-ellipsis-h").parent().parent().hide();
    }
  })

  $(".nav-btn .fa-ellipsis-h").parent().parent().click(function(){
    var url = poiData[$('.side-card').index($(this).parents(".side-card"))].url
    AR.context.openInBrowser(url,true);
  })

  $(".nav-btn .fa-location-arrow").parent().parent().click(function(){
    locked($(this));
  })
  $("#flatmapContainer").on('transitionend webkitTransitionEnd oTransitionEnd', function () {
    $("#flatmapContainer").css('transition', '0s');
  });

  $(".mode-panel .fa-minus").parent().click(function () {
    displayImageCurrentScale = clampScale(displayImageScale - 0.1);
    updateRange();
    displayImageCurrentX = clamp(displayImageX, rangeMinX, rangeMaxX);
    displayImageCurrentY = clamp(displayImageY, rangeMinY, rangeMaxY);
    updateDisplayImage(displayImageCurrentX, displayImageCurrentY, displayImageCurrentScale);
    displayImageScale = displayImageCurrentScale;
    displayImageX = displayImageCurrentX;
    displayImageY = displayImageCurrentY;
  })

  $(".mode-panel .fa-plus").parent().click(function () {
    displayImageCurrentScale = clampScale(displayImageScale + 0.1);
    updateRange();
    displayImageCurrentX = clamp(displayImageX, rangeMinX, rangeMaxX);
    displayImageCurrentY = clamp(displayImageY, rangeMinY, rangeMaxY);
    updateDisplayImage(displayImageCurrentX, displayImageCurrentY, displayImageCurrentScale);
    displayImageScale = displayImageCurrentScale;
    displayImageX = displayImageCurrentX;
    displayImageY = displayImageCurrentY;
  })

  $(".mode-panel .fa-crosshairs").parent().click(function () {
    $("#flatmapContainer").css('transition', '.3s');
    displayImageCurrentScale = 1;
    updateRange();
    displayImageCurrentX = clamp(displayDefaultWidth / 2 - userCoordinate.x, rangeMinX, rangeMaxX);
    displayImageCurrentY = clamp(displayDefaultHeight / 2 - userCoordinate.y, rangeMinY, rangeMaxY);
    updateDisplayImage(displayImageCurrentX, displayImageCurrentY, displayImageCurrentScale);
    displayImageScale = displayImageCurrentScale;
    displayImageX = displayImageCurrentX;
    displayImageY = displayImageCurrentY;
  })
  $(".mode-panel .fa-map-marked-alt").parent().click(function () {
    showSearchPanel(false);
    $(".mode-panel").toggleClass('switchMode');
    $(".classList").removeClass("showList");
    $('#flatmap').toggleClass('switchMode');
    $(".mode-panel").hasClass('switchMode') ? AR.hardware.camera.enabled = false : AR.hardware.camera.enabled = true;
    World.flatMode = !World.flatMode;
  })
  $(".btn-panel .fa-location-arrow").parent().click(function () {
    showBubble("已取消指引");
    $(this).removeClass("showArrow");
    locked($("div.LOCK"));
  })
  $(".btn-panel .fa-bars").parent().click(function () {
    showSearchPanel(false);
    $(".btn-panel").hasClass("showPanel") ? $(".btn-panel").removeClass("showPanel") : $(".btn-panel").addClass("showPanel");
    $(".classList").removeClass("showList");
  })
  $(".btn-panel .fa-cog").parent().click(function () {
    $(".btn-panel").removeClass("showPanel");
    $(".classList").removeClass("showList");
    showMenu(true);
  })
  $(".btn-panel .fa-map-pin").parent().click(function () {
    $(".classList").hasClass("showList") ? $(".classList").removeClass("showList") : $(".classList").addClass("showList");
  })
  $(".btn-panel .fa-search").parent().click(function () {
    $(".btn-panel").removeClass("showPanel");
    $(".classList").removeClass("showList");
    $(".search-res").html("");
    $("#searching").val("");
    showSearchPanel(true);
  })
  $(".search-panel .fa-times").click(function () {
    showSearchPanel(false);
  })
  $(".classList li").click(function () {
    $(this).addClass("listChecked");
    $(this).siblings().removeClass();
    $(".btn-panel").removeClass("showPanel");
    showBubble("分類切換為<b>"+$(this).html()+"</b>");
    World.onMarkerClassFilter($(".classList li").index(this));
  })

  $("#setting-radar").change(function () {
    this.checked ? PoiRadar.show() : PoiRadar.hide();
  })
  $("#setting-console").change(function () {
    this.checked ? $("#consoleBox").show() : $("#consoleBox").hide();
  })
  $("#searching").focus(function () {
    $(".side-card").css('display', 'none');
  })
  $("#searching").blur(function () {
    setTimeout(function () { $(".side-card").css('display', 'block'); }, 150);
  })
  $("#searching").keyup(function () {
    $(".search-res").html("");
    var serchKy = this.value;
    var found = false;
    if (!serchKy) return;
    for (var i = 0; i < poiData.length; i++) {
      for (var j = 0; j < Object.keys(poiData[i].keyword).length; j++) {
        var ky = poiData[i].keyword[j].ky;
        var index = ky.search(serchKy);
        if (index != -1) {
          found = true;
          var floor = poiData[i].keyword[j].floor ? poiData[i].keyword[j].floor : "";
          var lastIndex = ky.lastIndexOf(",", index) + 1;
          var matchWord = ky.substr(lastIndex, ky.indexOf(",", index) - lastIndex);
          matchWord = matchWord.replace(serchKy, "<mark>" + serchKy + "</mark>");
          var imgID = (i + 1 > 26 && i + 1 < 35) || (i + 1 > 42 && i + 1 < 62) ? "poi_27" : poiData[i].id;
          var a = $("<table class='search-card' id='res_" + poiData[i].id + "' onclick='World.onSearchPanelPoiClick(" + '"' + poiData[i].id + '"' + ")'></table>");
          var b = $("<td rowspan='2'><div class='circle-img circle-small'><img src='assets/poi_img/" + imgID + ".jpg'></div></td>");
          var c = $("<td>" + matchWord + "</td>");
          var d = $("<td rowspan='2'>" + World.onPoiGetDistance(poiData[i].id) + "</td>");
          var e = $("<tr></tr>").append(b).append(c).append(d);
          var f = $("<tr></tr>").append('<td><i class="fas fa-map-marker-alt"></i><span>' + poiData[i].title + floor + '</span></td>')
          $(".search-res").append(a.append(e).append(f));
        } else if (!found) $(".search-res").html("");
      }
    }
  })



  $("#configBtn").click(function () {
    $("#setting-radar").prop('checked', 1).trigger('change');
    $("#setting-gps").prop('checked', 1).trigger('change');
    $("#maxDistance-slider").val(420).trigger("input");
    $("#minDistance-slider").val(8).trigger("input");
    $("#markerScale-slider").val(0.2).trigger("input");
    $("#bubbleAngle-slider").val(10).trigger("input");
    $("#clusterAngle-slider").val(30).trigger("input");
    $("#altOffset-slider").val(15).trigger("input");
  });

  $("#maxDistance-slider").on('input', function () {
    $("#maxDistance-output").html(this.value + "m");
    World.setMaxScalingDistance(Number(this.value));
  });

  $("#minDistance-slider").on('input', function () {
    $("#minDistance-output").html(this.value + "m");
    World.setMinScalingDistance(Number(this.value));
  });

  $("#markerScale-slider").on('input', function () {
    $("#markerScale-output").html(this.value);
    World.setScalingFactor(Number(this.value));
  });


  $("#bubbleAngle-slider").on('input', function () {
    $("#bubbleAngle-output").html(this.value);
    bubbleAngle = Number(this.value);
  });
  $("#clusterAngle-slider").on('input', function () {
    $("#clusterAngle-output").html(this.value);
    World.clusterAngle = Number(this.value);
  });
  $("#altOffset-slider").on('input', function () {
    $("#altOffset-output").html(this.value);
    World.altOffset = Number(this.value);
  });


  var hammer = new Hammer(document.querySelector('body,html'));
  var hammer2 = new Hammer(document.querySelector('#location'));
  //var hammer3 = new Hammer(document.querySelector('#plotGps'));

  hammer.on('swipe', function (ev) {
    if (ev.deltaTime < 400) {
      if (ev.direction == 4 && !screenOrientation) {
        World.onScreenClick();
      } else if (ev.direction == 16 && screenOrientation) World.onScreenClick();
    }
  });
  hammer.get('swipe').set({ threshold: 150, direction: Hammer.DIRECTION_ALL });
  hammer2.on('tap', function (ev) {
    if ($("#location").css('animation-name') != 'none') World.onLocationAreaPress();
    consoleWrite($("#location").css('animation-name'));
  });

  /*
   hammer3.on("pan", function (ev) {
     var $div = $('#plotGps');
     if(!isDragging){
       isDragging = true;
       lastX = $div[0].offsetLeft;//x坐标
       lastY = $div[0].offsetTop;//y坐标
     }
     $div.css({
       left: lastX + ev.deltaX,
       top: lastY + ev.deltaY
     });
     if (ev.isFinal)isDragging = false;
   });
  hammer3.get('pinch').set({ enable: true });
  hammer3.get('pan').set({ threshold: 0, direction: Hammer.DIRECTION_ALL });
*/

  $("#location").bind("click", function () {
    $(this).css('animation', 'locationChanged 5s');
  });
  $("#location").on("animationend", function () {
    $(this).css("animation", "");
  });
  $("#bubble-notice").on("animationend", function () {
    $(this).css("animation", "");
    setTimeout(function () {
      bubbleNoticePool.shift();
      showBubble();
    }, 30);
  });
  //localStorage.clear();
  screenOrientation = false;
  bubbleNoticePool = [];
  onOrientationchange();
  keyWordInitial();
  canvasInit();
  //initLocationAccuracy();
  //showMenu(1);
  //showCard(true, "poi_1");
  window.addEventListener("orientationchange", onOrientationchange, false);
  consoleWrite(navigator.userAgent);

  configProgress(0);

  //FastClick.attach(document.body);
  InitPart2();

}


function canvasInit() {
  mapTransform();
  /*var canvas = document.getElementById("pathCanvas");
  canvas.addEventListener('click', function (evt) {
    var mousePos = getMousePos(canvas, evt);
  }, false);*/
}
function getMousePos(c, evt) {
  var rect = c.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}


function Map_drawAllPoint() {
  var cood;
  for (var i = 0; i < matrixLocation.length; i++) {
    cood = Location2Pixel(matrixLocation[i][0], matrixLocation[i][1]);
    $('#pathCanvas').drawArc({
      fillStyle: 'red',
      x: cood.x, y: cood.y,
      radius: 5,
      start: 0, end: 360,
      inDegrees: false
    });
  }
}



function drawUserLocation(lat, lon) {
  var cood = Location2Pixel(lat, lon);
  /*$('#pathCanvas').clearCanvas()*/
  /*$('#pathCanvas').drawArc({
    fillStyle: 'red',
    x: cood.x, y: cood.y,
    radius: 5,
    start: 0, end: 360,
    inDegrees: false
  });*/
  
  $('#user-location').css('transform', 'translate(' + cood.x + 'px,' + cood.y + 'px)');
  userCoordinate = { "x": cood.x, "y": cood.y, "lat": lat, "lon": lon };
}

function Location2Pixel(lat, lon) {
  var x = Math.round(delta[0] * lat + delta[1] * lon + delta[2]);
  var y = Math.round(delta[3] * lat + delta[4] * lon + delta[5]);
  return { "x": x, "y": y };
}

function drawPath(path) {
  var coordinate = [[userCoordinate.x, userCoordinate.y]];
  for (var i = 0; i < path.length; i++) {
    var lat = matrixLocation[path[i]][0];
    var lon = matrixLocation[path[i]][1];
    var cood = Location2Pixel(lat, lon);
    coordinate[i + 1] = new Array;
    coordinate[i + 1][0] = cood.x;
    coordinate[i + 1][1] = cood.y;
  }
  $('#pathCanvas').clearCanvas();
  $('#target-location').css('transform', 'translate(' + coordinate[coordinate.length - 1][0] + 'px,' + coordinate[coordinate.length - 1][1] + 'px)');
  
  var obj = {
    strokeStyle: '#4285f4',
    strokeWidth: 13,
    rounded: true
  };

  for (var p = 0; p < coordinate.length; p += 1) {
    obj['x' + (p + 1)] = coordinate[p][0];
    obj['y' + (p + 1)] = coordinate[p][1];
  }


  $('#pathCanvas').drawLine(obj);

  for (var p = 0; p < coordinate.length; p += 1) {
    $('#pathCanvas').drawArc({
      fillStyle: 'white',
      x: coordinate[p][0], y: coordinate[p][1],
      radius: 3,
      start: 0, end: 360,
    });
  }
  console.log("draw");
}
var GlobalPath = new Array;
var updateRouteTimer;
let minScale = 0.4;
let maxScale = 1.2;
let imageWidth;
let imageHeight;
let containerWidth;
let containerHeight;
let displayImageX = 0;
let displayImageY = 0;
let displayImageScale = 1;

let displayDefaultWidth;
let displayDefaultHeight;

let rangeX = 0;
let rangeMaxX = 0;
let rangeMinX = 0;

let rangeY = 0;
let rangeMaxY = 0;
let rangeMinY = 0;

let displayImageRangeY = 0;

let displayImageCurrentX = 0;
let displayImageCurrentY = 0;
let displayImageCurrentScale = 1;
let isPanning = false;


function InitPart2(){
  imageContainer = document.querySelector('#flatmap');
  displayImage = document.querySelector('#flatmapContainer');
  resizeContainer();

  imageWidth = displayImage.width;
  imageHeight = displayImage.height;
  displayImage.addEventListener('mousedown', e => e.preventDefault(), false);
  displayDefaultWidth = displayImage.offsetWidth;
  displayDefaultHeight = displayImage.offsetHeight;
  rangeX = Math.max(0, displayDefaultWidth - containerWidth);
  rangeY = Math.max(0, displayDefaultHeight - containerHeight);
  updateRange();
  updateDisplayImage(0, 0, 1, 1);

  /*imageContainer.addEventListener('wheel', e => {
    displayImageScale = displayImageCurrentScale = clampScale(displayImageScale + (e.wheelDelta / 800));
    updateRange();
    displayImageCurrentX = clamp(displayImageCurrentX, rangeMinX, rangeMaxX)
    displayImageCurrentY = clamp(displayImageCurrentY, rangeMinY, rangeMaxY)
    updateDisplayImage(displayImageCurrentX, displayImageCurrentY, displayImageScale);
  }, false);*/

  hammertime = new Hammer(imageContainer);

  hammertime.get('pinch').set({ enable: true });
  hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });

  hammertime.on('pan', ev => {
    displayImageCurrentX = clamp(displayImageX + ev.deltaX, rangeMinX, rangeMaxX);
    displayImageCurrentY = clamp(displayImageY + ev.deltaY, rangeMinY, rangeMaxY);
    updateDisplayImage(displayImageCurrentX, displayImageCurrentY, displayImageScale);
    isPanning = true;
  });
  hammertime.on('tap', ev => {
    $(".side-card").css('transform', '');
    $(".side-card.Showed").removeClass('Showed');
  });

  /*hammertime.on('pinch pinchmove', ev => {
    displayImageCurrentScale = clampScale(ev.scale * displayImageScale);
    updateRange();
    displayImageCurrentX = clamp(displayImageX + ev.deltaX, rangeMinX, rangeMaxX);
    displayImageCurrentY = clamp(displayImageY + ev.deltaY, rangeMinY, rangeMaxY);
    updateDisplayImage(displayImageCurrentX, displayImageCurrentY, displayImageCurrentScale);
  });*/

  hammertime.on('panend pancancel', () => {
    displayImageScale = displayImageCurrentScale;
    displayImageX = displayImageCurrentX;
    displayImageY = displayImageCurrentY;
    isPanning = false;
  });
}

function resizeContainer() {
  containerWidth = imageContainer.offsetWidth;
  containerHeight = imageContainer.offsetHeight;
  if (displayDefaultWidth !== undefined && displayDefaultHeight !== undefined) {
    displayDefaultWidth = displayImage.offsetWidth;
    displayDefaultHeight = displayImage.offsetHeight;
    updateRange();
    displayImageCurrentX = clamp(displayImageX, rangeMinX, rangeMaxX);
    displayImageCurrentY = clamp(displayImageY, rangeMinY, rangeMaxY);
    updateDisplayImage(
      displayImageCurrentX,
      displayImageCurrentY,
      displayImageCurrentScale);
  }
}



function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

function clampScale(newScale) {
  return clamp(newScale, minScale, maxScale);
}

window.addEventListener('resize', resizeContainer, true);






function updateDisplayImage(x, y, scale) {
  const transform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px) scale(' + scale + ',' + scale + ')';
  displayImage.style.transform = transform;
  displayImage.style.WebkitTransform = transform;
  displayImage.style.msTransform = transform;
}

function updateRange() {
  rangeX = Math.max(0, Math.round(displayDefaultWidth * displayImageCurrentScale) - containerWidth);
  rangeY = Math.max(0, Math.round(displayDefaultHeight * displayImageCurrentScale) - containerHeight);

  rangeMaxX = Math.round(rangeX / 2);
  rangeMinX = 0 - rangeMaxX;

  rangeMaxY = Math.round(rangeY / 2);
  rangeMinY = 0 - rangeMaxY;
}




/***************最短路徑***************** */
function Dijkstra(start, end) {
  var rows = matrix.length,//rows和cols一样，其实就是顶点个数
    cols = matrix[0].length;
  var pre = [];
  var path = [];
  var flag = new Array(rows).fill(false);

  if (rows !== cols || start >= rows || end >= rows) return new Error("邻接矩阵错误或者源点错误");

  //初始化distance
  var distance = new Array(rows).fill(Infinity);;
  distance[start] = 0;
  var minIndex, minValue;
  path.push(end);

  for (var i = 0; i < rows; i++) {
    minValue = Infinity;
    for (var j = 0; j < cols; j++) {
      if (distance[j] < minValue && !flag[j]) {
        minIndex = j;
        minValue = distance[j];
      }
    }
    flag[minIndex] = true;
    for (var k = 0; k < cols; k++) {
      if (matrix[minIndex][k] < Infinity) {
        if (matrix[minIndex][k] + distance[minIndex] < distance[k]) {
          distance[k] = matrix[minIndex][k] + distance[minIndex];
          pre[k] = minIndex;
        }
      }
    }
  }
  while (pre[end] != start) {
    path.push(pre[end]);
    end = pre[end];
  }
  path.push(start);
  return path.reverse();
}

/**
* 邻接矩阵
* 值为顶点与顶点之间边的权值，0表示无自环，一个大数表示无边(比如10000)
* */
const MAX_INTEGER = Infinity;//没有边或者有向图中无法到达
const MIN_INTEGER = 0;//没有自环
var EARTH_RADIUS = 6378.137; //地球半徑

//將用角度表示的角轉換為近似相等的用弧度表示的角 java Math.toRadians
function rad(d) {
  return d * Math.PI / 180.0;
}
function getDistance(lat1, lon1, lat2, lon2) {
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lon1) - rad(lon2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
    + Math.cos(radLat1) * Math.cos(radLat2)
    * Math.pow(Math.sin(b / 2), 2)));
  s = s * EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s * 1000;
}


function routeNavigation(e) {
  if(updateRouteTimer)clearInterval(updateRouteTimer);
  var endPoint;
  var id = $(e).parents(".side-card").attr('id');
  for (var i in poiData) {
    if (poiData[i].id == id) {
      endPoint = poiData[i].point;
    }
  }

  var minDistance = Infinity;
  var tmp;
  var nearbyPoint;

  for (var i = 0; i < matrixLocation.length; i++) {
    tmp = getDistance(userCoordinate.lat, userCoordinate.lon, matrixLocation[i][0], matrixLocation[i][1]);
    if (tmp < minDistance) {
      minDistance = tmp;
      nearbyPoint = i;
      World.isNavigation = true;
    }
  }
  GlobalPath = Dijkstra(nearbyPoint, endPoint);
  consoleWrite("出發點:" + nearbyPoint + " 目標點:" + endPoint);
  drawPath(GlobalPath);
  updateRouteTimer = setInterval("updateRoute()",3000);
}

function arrayMin(arrs) {
  var min = arrs[0];
  var flag = 0;
  for (var i = 1, ilen = arrs.length; i < ilen; i += 1) {
    if (arrs[i] < min) {
      min = arrs[i];
      flag = i;
    }
  }
  return flag;
}

function updateRoute(){
  if(isPanning)return;
  var minDistance = Infinity;
  var tmp;
  var nearbyPoint;

  for (var i in GlobalPath) {
    tmp = getDistance(userCoordinate.lat, userCoordinate.lon, matrixLocation[GlobalPath[i]][0], matrixLocation[GlobalPath[i]][1]);
    if (tmp < minDistance) {
      minDistance = tmp;
      nearbyPoint = GlobalPath[i];
    }
  }
  while(GlobalPath[0]!=nearbyPoint){
    GlobalPath.shift();
  }
  drawPath(GlobalPath);
  if(GlobalPath.length==1 && minDistance < 10){
   cancelRoute();
   showBubble("到達目的地!"); 
  }
}

function cancelRoute(){
  $('#pathCanvas').clearCanvas();
  $('#target-location').hide();
  clearInterval(updateRouteTimer);
}