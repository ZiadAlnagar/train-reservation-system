//////////////////////////////////////////////////////////////////
////// Zeyad Ibrahim /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//// Home Page ////
// Search Swap Button //
$(document).ready(function () {
  $(".swap").click(function () {
    var a = $("#from").val();
    $("#from").val($("#to").val());
    $("#to").val(a);
  });
});

// Responsiveness Nav Bar
function MobileNav() {
  $(".mobile-nav").toggleClass("display-mobile-nav");
  $(".nav-overlay").toggleClass("nav-overlay-open");
}
$(".burger-nav-ico").click(function () {
  MobileNav();
  $(".nav").css({
    "background-color": "rgba(255,255,255,1)",
  });
  if (!$(".mobile-nav").hasClass("display-mobile-nav")) {
    NavScroll();
  }
});
$(".nav-overlay").click(function () {
  MobileNav();
  NavScroll();
});

// Navigation Scroll Effect //
function NavScroll() {
  var col_var = Math.round(
    (255 / $(".after-nav")[0].scrollHeight) * $(window).scrollTop()
  );
  var alpha_var = (1.1 / $(".after-nav")[0].scrollHeight) * $(window).scrollTop();


  if (alpha_var >= 1) $(".nav").addClass("nav-scroll");
  else $(".nav").removeClass("nav-scroll");

  if ($(".mobile-nav").hasClass("display-mobile-nav")) {
    $(".mobile-nav").removeClass("display-mobile-nav");
    $(".nav-overlay").removeClass("nav-overlay-open");
  }
}

//To top Button
$(".to-top").click(function () {
  $("html, body").animate({ scrollTop: 0 }, 1000);
});
$(window).bind("scroll", function () {
  NavScroll();
  $(window).scrollTop() > $(".after-nav").innerHeight() * 0.5
    ? $(".to-top").addClass("to-top-show")
    : $(".to-top").removeClass("to-top-show");
});

// Video Text Typing Effect //
var typed = new Typed(".video-text", {
  strings: [
    "Always on time.^14750",
    "Free internet.^8500",
    "Active community.^13000",
  ],
  typeSpeed: 65,
  backSpeed: 45,
  loop: true,
  loopCount: false,
});

$("#s-btn").click(function () {
  $("button.search-btn").click();
});