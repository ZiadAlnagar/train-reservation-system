<? global $isSession;
global $UserD;
//var_dump($isSession);
//print_r($_SESSION);
//print_r($UserD);
$Dir = "";
if(!isset($root)) $Dir = "../";
if(isset($_POST['logout'])){
    session_destroy();
    $isSession = false;
    header("Location: index.php");
}
?>
<nav class="nav flex items-center">
    <div class="logo px-20">
        <a href="<?= $Dir ?>index.php" class="flex flex-center">
            <img src="img/favicon.ico" alt="train logo" width="45">
            <h1>T-rain</h1>
        </a>
    </div>
    <div class="nav-menu">
        <ul>
            <li><a href="<?= $Dir ?>index.php">Home<a></li>
            <li><a href="<?= $Dir ?>pages/TripsList.php">Schedule</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="<?= $Dir ?>pages/About.php">About Us</a></li>
            <? if ($isSession) { ?>
            <?= $UserD['AccType'] == 0 ? false : "<li><a href='admin/admin.php'>Admin</a></li>";?>
            } ?>
        </ul>
    </div>
    <div class="account flex items-center">
        <a href="#">
            <img src="<?= $Dir ?>img/clipart3643767.png" alt="" width="50">
        </a>
        <div class="dropdown ml-10">
            <a class="dropbtn flex items-center" <?= $isSession ?: "href='" . $Dir . "pages/Log_in.php'"; ?> ><?= $isSession ? $UserD['FName'] : "Log in"; ?><i class="fas fa-sort-down ml-5"></i></a>
            <div class="dropdown-content">
                <a href="Account.php">My Account</a>
                <form action="" method="post">
                <input type="submit" name="logout" value="Log out">
                </form>
            </div>
        </div>
    </div>
    <div class="mobile-nav">
        <a href="<?= $Dir ?>index.php">Home</a>
        <a href="<?= $Dir ?>TripsList.php">Schedule</a>
        <a href="#contact">Contact Us</a>
        <a href="<?= $Dir ?>About.php">About Us</a>
        <a href="<?= $Dir ?>Account.php">My Account</a>
        <form action="" method="post">
            <input type="submit" name="logout" value="Log out">
        </form>
    </div>
    <a href="javascript: void(0)" class="burger-nav-ico">
        <i class="fa fa-bars fa-2x"></i>
    </a>
</nav>
<div class="nav-overlay"></div>