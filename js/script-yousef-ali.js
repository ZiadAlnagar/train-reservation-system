//////////////////////////////////////////////////////////////////
////// Yousef Ali ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//// Sign Up Page ////
// Signup - Login Pages //
var currentTab = 0;
//showTab(currentTab);
function showTab(n) {
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "flex";
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == x.length - 1) {
    $("#nextBtn").attr("hidden", true);
    $("#login-submit").removeAttr("hidden");
  }
  fixStepIndicator(n);
}
function nextPrev(n) {
  var x = document.getElementsByClassName("tab");

  if (n == 1 && !validateForm()) return false;
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;
  showTab(currentTab);
}
function validateForm() {
  var x,
    y,
    i,
    valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");

  for (i = 0; i < y.length; i++) {
    if (
      (y[i].name == "fname" ||
        y[i].name == "lname" ||
        y[i].name == "email" ||
        y[i].name == "pass" ||
        y[i].name == "repeat-pass") &&
      y[i].value == ""
    ) {
      y[i].className += " invalid";
      valid = false;
    }

    if (y[i].name == "pass" && y[i].value != y[i + 1].value) {
      y[i].value = "";
      y[i + 1].value = "";
      y[i].className += " invalid";
      y[i + 1].className += " invalid";
      valid = false;
    }
  }
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}
function fixStepIndicator(n) {
  var i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}

//// About us Page ////
// Counters //
const counters = document.querySelectorAll(".counter");
const speed = 55;
counters.forEach((counter) => {
  const updateCount = () => {
    const target = +counter.getAttribute("data-target");
    const count = +counter.innerText;

    const inc = parseInt(target / speed);

    if (count < target) {
      counter.innerText = count + inc;
      setTimeout(updateCount, 200);
    } else {
      counter.innerText = target;
    }
  };

  updateCount();
});

// Slideshow //
var slideIndex = 0;
// showSlides();
function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  setTimeout(showSlides, 2000);
}
