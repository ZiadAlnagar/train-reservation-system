<?php include '../includes/head.php'; ?>
<? //var_dump(isset($_POST['signup']));
if (isset($_POST['signup'])) {
  if (isset($_POST['js_enabled'])) {
    $browser_check = $_POST['js_enabled'];
    echo !$browser_check == 1 ?: die('Please, enable Scripts on your browser.');
  }
  $fname = $connection->real_escape_string($_POST['fname']);
  $lname = $connection->real_escape_string($_POST['lname']);
  $email = $connection->real_escape_string($_POST['email']);
  $pass = $connection->real_escape_string($_POST['pass']);
  $rePass = $connection->real_escape_string($_POST['repeat-pass']);
  $DoB = $connection->real_escape_string($_POST['dd']);
  $Wallet = $connection->real_escape_string($_POST['wallet']);
  !empty($fname) || !strlen($fname) < 2 ?: $Errors['fname'] = true;
  !empty($lname) || !strlen($lname) < 2 ?: $Errors['lname'] = true;
  if(!empty($email)){
  $Query = "SELECT UserId FROM user WHERE Email = '$email' LIMIT 1;";
  $Get_Email_Query = $connection->query($Query);
  $emailExist = $Get_Email_Query->num_rows;
  !empty($email) || str_contains($email, '@') || $emailExist == 0 ?: $Errors['email'] = true;
  }
  !empty($pass) || !strlen($lname) < 7 ?: $Errors['pass'] = true;
  !empty($rePass) || strcmp($pass, $rePass) ?: $Errors['rePass'] = true;
  !empty($DoB) ?: $Errors['DoB'] = true;
  if (!isset($Errors)) {
    $pass = password_hash($pass, PASSWORD_DEFAULT);
    $Query = "INSERT INTO user(FirstName, LastName, AccType, Email, Password, BirthDate, Wallet) ";
    $Query .= "VALUES ('$fname', '$lname', 0, '$email', '$pass', '$DoB', $Wallet)";
    $AddUser = $connection->query($Query);
    if(!$AddUser) die($connection->error);
    //header("Location: Log_in.php");
  }
} ?>

<body onload="showTab(currentTab);">
  <?php include '../includes/nav.php'; ?>
  <div class="nav-place after-nav"></div>
  <div class="page-body">
    <form id="regForm" action="" method="post">
      <h1>Register</h1>
      <hr>
      <noscript>
        <input type="hidden" name="js_enabled" value="1">
      </noscript>
      <div class="tab">Personal Info
        <p><input placeholder="First name..." oninput="this.className = ''" name="fname"></p>
        <p><input placeholder="Last name..." oninput="this.className = ''" name="lname"></p>
        <p><input placeholder="Address" oninput="this.className = ''" name="address"></p>
        <p><input placeholder="Phone..." oninput="this.className = ''" name="phone"></p>
      </div>
      <div class="tab">Account Info
        <p><input placeholder="E-mail..." oninput="this.className = ''" name="email"></p>
        <p><input placeholder="Password..." oninput="this.className = ''" name="pass"></p>
        <p><input placeholder="Repeat Password" oninput="this.className = ''" name="repeat-pass"></p>
      </div>
      <div class="tab">Date of birth
        <p><input type="date" oninput="this.className = ''" name="dd"></p>
      </div>
      <div class="tab">Payment Info
        <p><input placeholder="Card number" oninput="this.className = ''" name="uname"></p>
        <p><input placeholder="Card password" oninput="this.className = ''" name="pword" type="password"></p>
        <label for="cars">Related Bank</label>
        <select name="cars" oninput="this.className = ''" name="uname">
          <option value="Masr">Masr</option>
          <option value="CIB">CIB</option>
          <option value="HSBC">HSBC</option>
          <option value="Al-ahly">Al-ahly</option>
        </select>
        <p class="flex items-center">$ <input placeholder="Add" name="wallet" type="number"></p>
      </div>
      <div style="overflow:auto;">
        <div style="float:right;">
          <button type="button" id="prevBtn" onclick="nextPrev(-1)">Previous</button>
          <button type="button" id="nextBtn" onclick="nextPrev(1)"><span>Next</span></button>
          <button type="submit" id="login-submit" name="signup" hidden>Submit</button>
        </div>
      </div>
      <!-- Circles which indicates the steps of the form: -->
      <div style="text-align:center;margin-top:40px;">
        <span class="step"></span>
        <span class="step"></span>
        <span class="step"></span>
        <span class="step"></span>
      </div>
    </form>
  </div>

  <?php include '../includes/footer.php'; ?>