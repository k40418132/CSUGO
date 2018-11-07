function consoleWrite(context) {
  $("#consoleBox").append(context + "<br><br>");
  $("#consoleBox").animate({ scrollTop: $('#consoleBox').prop('scrollHeight') }, 300);
}
function showCard(show, id) {
  if (show) {
    $("#" + id).animate({ scrollTop: 0 }, 100);
    (screenOrientation) ? $("#" + id).css('transform', 'translateX(-50%) translateY(0%)') : $("#" + id).css('transform', 'translateX(0)')
  } else {
    (screenOrientation) ? $("#" + id).css('transform', 'translateX(-50%) translateY(100%)') : $("#" + id).css('transform', 'translateX(100%)')
  }
}
function showCardDelay(id, delay) {
  setTimeout(function () { showCard(true, id) }, delay ? 180 : 0);
}

function showBubble(context) {
  if(context)bubbleNoticePool.push(context);
  
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
  (show) ? $(".search-panel").css('transform', 'translateY(-0%)') : $(".search-panel").css('transform', 'translateY(-100%)');
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
    if(localStorage.getItem("radar") == null){
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



function updateLocationAccuracy(acc) {
  /*var demo = new CountUp('acc', Number($("#acc").html()), acc, 0, 1);
  if (!demo.error) {
    demo.start();
  } else {
    console.error(demo.error);
  }*/
  $("#acc").html(acc);
  if (acc == 1) {
    if ($("#setting-gps").prop('checked')) showBubble("GPS信號不穩定");
    $("#gps-acc p:first").html("不穩定");
    $("#menu-nav").removeClass();
    $("#menu-nav").addClass("acc-danger");
  } else if (acc == 2) {
    $("#gps-acc p:first").html("良好");
    $("#menu-nav").removeClass();
    $("#menu-nav").addClass("acc-warning");
  } else {
    $("#gps-acc p:first").html("最佳");
    $("#menu-nav").removeClass();
  }
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
          var a = $("<table class='search-card' id='res_" + poiData[i].id + "' onclick='World.onSearchPanelPoiClick(" + '"' + poiData[i].id + '"' + ")'></table>");
          var b = $("<td rowspan='2'><div class='circle-img circle-small'><img src='assets/poi_img/" + poiData[i].id + ".jpg'></div></td>");
          var c = $("<td>" + matchWord + "</td>");
          var d = $("<td rowspan='2'>" + World.onPoiGetDistance(poiData[i].id) + "</td>");
          var e = $("<tr></tr>").append(b).append(c).append(d);
          var f = $("<tr></tr>").append('<td><i class="fas fa-map-marker-alt"></i><span>' + poiData[i].title + floor + '</span></td>')
          $(".search-res").append(a.append(e).append(f));
        } else if (!found) $(".search-res").html("");
      }
    }
  })



$("#configBtn").click(function(){
  $("#setting-radar").prop('checked',1).trigger('change');
  $("#setting-gps").prop('checked',1).trigger('change');
  $("#maxDistance-slider").val(120).trigger("input");
  $("#minDistance-slider").val(10).trigger("input");
  $("#markerScale-slider").val(0.3).trigger("input");
  $("#bubbleAngle-slider").val(10).trigger("input");
  $("#clusterAngle-slider").val(30).trigger("input");
  $("#altOffset-slider").val(30).trigger("input");
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
  hammer.on('swipe', function (ev) {
    if (ev.deltaTime < 400) {
      if (ev.direction == 4 && !screenOrientation) {
        World.onScreenClick();
      } else if (ev.direction == 16 && screenOrientation) World.onScreenClick();
      console.log(ev.direction + "  " + screenOrientation);

    }
  });
  hammer2.on('tap', function (ev) {
    if ($("#location").css('animation-name') != 'none') World.onLocationAreaPress();
    consoleWrite($("#location").css('animation-name'));
  });
  hammer.get('swipe').set({ threshold: 150, direction: Hammer.DIRECTION_ALL });



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
  //initLocationAccuracy();
  //showMenu(1);
  //showCard(true, "poi_1");
  window.addEventListener("orientationchange", onOrientationchange, false);
  consoleWrite(navigator.userAgent);
  configProgress(0);
  //FastClick.attach(document.body);



});