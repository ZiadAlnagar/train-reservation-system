//////////////////////////////////////////////////////////////////
////// Yousef Adel ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//// Account Page ////
$(document).ready(function () {
  $('#pd1').hide();
  $('#Ls1').hide();
  $('#Pm1').hide();
  $('#rate1').hide();
  $('#upcome1').hide();

  $('#LS').on('click', function () {
    if ($('#pd1').hide() === false) {
      $('#pd1').slideToggle(750, function () {
        $('#Ls1').slideToggle(750)
      })
    }
    else if ($('#Pm1').hide() === false) {
      $('#Pm1').slideToggle(705, function () {
        $('#Ls1').slideToggle(750)
      })
    }
    else if ($('#rate1').hide() === false) {
      $('#rate1').slideToggle(750, function () {
        $('#Ls1').slideToggle(750)
      })
    }
    else if ($('#upcome1').hide() === false) {
      $('#upcome1').slideToggle(750, function () {
        $('#Ls1').slideToggle(750)
      })
    }
    else {
      $('#Ls1').slideToggle(750)
    }
  });
  //   11111111111111111111111111111

  $('#PM').on('click', function () {
    if ($('#pd1').hide() === false) {
      $('#pd1').slideToggle(750, function () {
        $('#Pm1').slideToggle(750)
      })
    }
    else if ($('#Ls1').hide() === false) {
      $('#Ls1').slideToggle(750, function () {
        $('#Pm1').slideToggle(750)
      })
    }
    else if ($('#rate1').hide() === false) {
      $('#rate1').slideToggle(750, function () {
        $('#Pm1').slideToggle(750)
      })
    }
    else if ($('#upcome1').hide() === false) {
      $('#upcome1').slideToggle(750, function () {
        $('#Pm1').slideToggle(750)
      })
    }
    else {
      $('#Pm1').slideToggle(750)
    }
  });
  //   22222222222222222222222222222222222222
  $('#PD').on('click', function () {
    if ($('#Ls1').hide() === false) {
      $('#Ls1').slideToggle(750, function () {
        $('#pd1').slideToggle(750)
      })
    }
    else if ($('#Pm1').hide() === false) {
      $('#Pm1').slideToggle(750, function () {
        $('#pd1').slideToggle(750)
      })
    }
    else if ($('#rate1').hide() === false) {
      $('#rate1').slideToggle(750, function () {
        $('#pd1').slideToggle(750)
      })
    }
    else if ($('#upcome1').hide() === false) {
      $('#upcome1').slideToggle(750, function () {
        $('#pd1').slideToggle(750)
      })
    }
    else {
      $('#pd1').slideToggle(750)
    }
  });
  //   3333333333333333333333333333333333333
  $('#PT').on('click', function () {
    if ($('#Ls1').hide() === false) {
      $('#Ls1').slideToggle(750, function () {
        $('#rate1').slideToggle(750)
      })
    }
    else if ($('#Pm1').hide() === false) {
      $('#Pm1').slideToggle(750, function () {
        $('#rate1').slideToggle(750)
      })
    }
    else if ($('#upcome1').hide() === false) {
      $('#upcome1').slideToggle(750, function () {
        $('#rate1').slideToggle(750)
      })
    }

    else if ($('#pd1').hide() === false) {
      $('#Pm1').slideToggle(750, function () {
        $('#rate1').slideToggle(750)
      })
    }
    else {
      $('#rate1').slideToggle(750)
    }
  })
  //   44444444444444444444444444444444444444444444
  $('#UT').on('click', function () {
    if ($('#Ls1').hide() === false) {
      $('#Ls1').slideToggle(750, function () {
        $('#upcome1').slideToggle(750)
      })
    }
    else if ($('#Pm1').hide() === false) {
      $('#Pm1').slideToggle(750, function () {
        $('#upcome1').slideToggle(750)
      })
    }
    else if ($('#rate1').hide() === false) {
      $('#rate1').slideToggle(750, function () {
        $('#upcome1').slideToggle(750)
      })
    }

    else if ($('#pd1').hide() === false) {
      $('#Pm1').slideToggle(750, function () {
        $('#upcome1').slideToggle(750)
      })
    }
    else {
      $('#upcome1').slideToggle(750)
    }
  })

  $('#PDbutton').click(function () {
    alert("your data is now updated :)")
  });
  $('#LSbutton').click(function () {
    alert("your data is now updated :)")
  });
  $('#PMbutton').click(function () {
    alert("your data is now updated :)")
  });
  $('#sub').click(function () {
    alert("your data is now updated")
  });
  $('#cancel').click(function () {
    $('#upcome1').fadeOut(1000, function () {
      alert("your trip is now canceled")
    });
  });
});
