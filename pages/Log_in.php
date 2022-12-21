<?php include '../includes/head.php'; ?>

<body onload="showTab(currentTab);">
  <?php include '../includes/nav.php'; ?>
  <div class="nav-place after-nav"></div>

  <div class="page-body">
    <form method="post" id="regForm">
      <h1>Log in</h1>
      <hr>
      <div class="tab" style="display: flex;">
        <p><input placeholder="E-mail..." oninput="this.className = ''" name="email"></p>
        <p><input placeholder="Password..." oninput="this.className = ''" name="pass"></p>
      </div>
      <div style="overflow:auto;">
        <div>
          <a href="Sign_up.php"><button type="button"
              style="background-color: var(--lightgray); color: var(--gray); float: left;">Sign
              Up</button></a>
          <button type="submit" name="submit" style="float: right;"><span>Log In</span></button>
        </div>
      </div>
    </form>
  </div>
  <? Login(); ?>

  <?php include '../includes/footer.php'; ?>