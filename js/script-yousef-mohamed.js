//////////////////////////////////////////////////////////////////
////// Yousef Mohamed ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//// Trips List Page ////
// Card Train Animation //
var id = null;
function TripCardAnimation(n) {
  var elem = document.querySelectorAll(".animate");
  for (var i = 0; i < elem.length; i++) {
    if (i == n - 1)
      continue;
    elem[i].style.width = "85%";
  }
  var width = 20;
  clearInterval(id);
  id = setInterval(frame, 10);
  function frame() {
    if (width == 85) {
      clearInterval(id);
    } else {
      width++;
      elem[n - 1].style.width = width + "%";
    }
  }
}

//// Trip Booking Page ////
// Increase/Decrease Buttons //
$(function () {
  set_($('.inc-dec .limit'), 1, 10);
  function set_(_this, min, max) {
    _this.parent().find(".increase").click(function () {
      var currentVal = parseInt(_this.val());
      if (currentVal >= min && (currentVal + 1) <= max) {
        _this.val(currentVal + 1);
        $('.passenger-num').text(currentVal + 1);
        updateTotal();
      }
    });

    _this.parent().find(".decrease").click(function () {
      var currentVal = parseInt(_this.val());
      if (currentVal != NaN && currentVal != min) {
        _this.val(currentVal - 1);
        $('.passenger-num').text(currentVal - 1);
        updateTotal();
      }
    });
  }
});

// Update Total Price //
function updateTotal() {
  var fare = parseInt(document.querySelector(".price-summary .price").innerHTML),
    passengerNum = parseInt(document.querySelector(".inc-dec .limit").value),
    discount = parseInt(document.querySelector(".price-summary .discount").innerHTML);
  var total = (fare * (passengerNum)) - discount;
  document.querySelectorAll(".price-summary .total p")[1].innerHTML = total + " EGP";
  //document.querySelector(".price-summary .passenger-num").innerHTML = passengerNum;
}

// Booking Form Validation //
function vaildateBookingForm() {
  var validForm = true;
  var forms = document.getElementsByTagName("form");
  for (var i = 0; i < forms.length; i++) {
    var inputs = form[i].getElementsByTagName("input");
    for (var j = 0; j < inputs.length; j++) {
      var input = inputs[j];
      if (input.value == "") {
        alert("Please Fill all the Required Fields !");
        validForm = false;
      }
      else if (input.name == "email") {
        var checker = /^([w-.]+@([w-]+.)+[w-]{2,4})?$/;
        if (!(input.value.match(checker))) {
          alert("Invalid Email !");
          validForm = false;
        }
      }
      else if (input.name == "phone") {
        var checker = /^\d{11}$/;
        if (!(input.value.match(checker))) {
          alert("Invalid Phone Number !");
          validForm = false;
        }
      }
      else if (input.name == "visa-num") {
        var checker = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/; //Visa Format
        if (!(input.value.match(checker))) {
          alert("Invalid Credit Card Number !");
          validForm = false;
        }
      }
      else if (input.name == "month") {
        var mm = parseInt(input.value);
        if (isNaN(mm) || mm < 1 || mm > 12) {
          alert("Invalid Exp Date !");
          validForm = false;
        }
      }
      else if (input.name == "year") {
        var yyyy = parseInt(input.value);
        if (isNaN(yyyy) || yyyy < 2020 || yyyy > 2030) {
          alert("Invalid Exp Date !");
          validForm = false;
        }
      }
      else if (input.name == "number") {
        var checker = /^[0-9]{3,4}$/;
        if (!(input.value.match(checker))) {
          alert("Invalid CVV Number !");
          validForm = false;
        }
      }
    }
  }
  if (validForm) {
    for (var i = 0; i < forms.length; i++)
      forms[i].submit();
  }
}

//// Admin Page ////
// Switch Between Tabs //
function displayAdminTab(n) {
  var tab = document.getElementById("admin-tabs").getElementsByClassName("card-v");
  for (i = 0; i < tab.length; i++) {
    tab[i].style.display = "none";
  }
  tab[n - 1].style.display = "inherit";

  var btn = document.getElementById("admin-tabs-btn").getElementsByClassName("side-section");
  for (i = 0; i < tab.length; i++) {
    btn[i].className = btn[i].className.replace(" active-tab", "");
  }
  btn[n - 1].className += " active-tab";
}

// Add/Edit/Save Buttons //
function addBtn(tapId) {
  //inputs
  var inputs = document.querySelectorAll("#" + tapId + " .admin-input");
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].disabled) {
      inputs[i].disabled = false;
      inputs[i].placeholder = "Enter..";
    }
    // else {
    //   inputs[i].disabled = true;
    //   inputs[i].placeholder = "";
    // }
  }

  //button
  var btns = document.querySelectorAll("#" + tapId + " .table-btns .button");
  if (btns[0].innerHTML == "Add") {
    btns[0].type = "button";
    btns[0].innerHTML = "Save";
  } else {
    btns[0].type = "submit";
    btns[0].innerHTML = "Add";
  }
}
function updateBtn(tapId) {
  //inputs
  var inputs = document.querySelectorAll("#" + tapId + " .admin-input");
  if (inputs[0].value == null || inputs[0].value == "") {
    alert("Choose from Table First!");
    return;
  }

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].disabled) {
      inputs[i].disabled = false;
    }
  }

  //button
  var btns = document.querySelectorAll("#" + tapId + " .table-btns .button");
  if (btns[1].innerHTML == "Edit") {
    btns[1].type = "button";
    btns[1].innerHTML = "Save";
  } else {
    btns[1].type = "submit";
    btns[1].innerHTML = "Edit";
  }
}
function deleteBtn(tapId) {
  //inputs
  var inputs = document.querySelectorAll("#" + tapId + " .admin-input");
  if (inputs[0].value == null || inputs[0].value == "") {
    alert("Choose from Table First!");
    return;
  }
}