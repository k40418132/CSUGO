function consoleWrite(context) {
  $("#consoleBox").append(context + "<br><br>");
  $("#consoleBox").animate({ scrollTop: $('#consoleBox').prop('scrollHeight') }, 300);
}
function showCard(show, id) {
  //(!show) ? $("#" + id).css('transform', 'translateX(100%)') : $("#" + id).css('transform', 'translateX(0)');
  if (show) {
    (screenOrientation) ? $("#" + id).css('transform', 'translateX(-50%) translateY(0%)') : $("#" + id).css('transform', 'translateX(0)')
  } else {
    (screenOrientation) ? $("#" + id).css('transform', 'translateX(-50%) translateY(100%)') : $("#" + id).css('transform', 'translateX(100%)')
  }
}

function showBubble(context) {
  $("#bubble-notice").html(context);
  $("#bubble-notice").css('animation', 'showBubble 5s');
}

function showMenu(show) {
  (show) ? $("#menu").css('transform', 'translateX(-0%)') : $("#menu").css('transform', 'translateX(-100%)');
}

function switchClass(li) {
  $(li).parent().parent().children("span").html($(li).html());
  $(li).parent().css('display', 'none');
}

function updateAcc(acc) {
  var demo = new CountUp('acc', Number($("#acc").html()), acc, 0, 1);
  if (!demo.error) {
    demo.start();
  } else {
    console.error(demo.error);
  }
  if (acc < 15) {
    $("#acc").removeClass();
    $("#acc").addClass("acc-danger");
  } else if (acc < 60) {
    $("#acc").removeClass();
    $("#acc").addClass("acc-warning");
  }else $("#acc").removeClass();
}
function locked(e) {
  $(e).hasClass("LOCK") ? $(e).removeClass("LOCK") : $(e).addClass("LOCK");
  World.onLockedClick($(e).parents(".side-card").attr('id'), $(e).hasClass("LOCK"));
  if ($(e).hasClass("LOCK")) World.onScreenClick();
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
    console.log("直式");

    World.onScreenClick();
    $(".side-card").css('display', 'none');
    $(".side-card").css('transform', 'translateX(-50%) translateY(100%)');
    setTimeout(function () { $(".side-card").css('display', 'block'); }, 100);
    screenOrientation = true;  //直式
  }
  if (window.orientation === 90 || window.orientation === -90) {
    console.log("橫式");

    World.onScreenClick();
    $(".side-card").css('display', 'none');
    $(".side-card").css('transform', 'translateX(100%)');
    setTimeout(function () { $(".side-card").css('display', 'block'); }, 100);

    screenOrientation = false; //橫式
  }
}

$(function () {

  $(".fa-bars").parent().click(function () {
    $(this).parent().hasClass("showPanel") ? $(this).parent().removeClass("showPanel") : $(this).parent().addClass("showPanel");
  })




  $("#uiScale-output").html($("#uiScale-slider").val() / 10);
  $("#uiScale-slider").on('input', function () {
    $("#uiScale-output").html(this.value / 10);
  })
  $("#markerScale-output").html($("#markerScale-slider").val());
  $("#markerScale-slider").on('input', function () {
    $("#markerScale-output").html(this.value);
  })
  $("#markerLocationDistance-output").html($("#markerLocationDistance-slider").val() + " m");
  $("#markerLocationDistance-slider").on('input', function () {
    $("#markerLocationDistance-output").html(this.value + " m");
  })

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
  });
  $("#Class").hover(function () { console.log($(this).children("ul").css('display', 'block')) });


  bubbleAngle = 10; //聚集演算角度
  screenOrientation = false;
  onOrientationchange();
  //showCard(true, "poi_13");

  window.addEventListener("orientationchange", onOrientationchange, false);




  //FastClick.attach(document.body);


});