<?  ob_start();
    include_once __DIR__ . '/db.php';
    include __DIR__ . '/functions.php';
    Session();
    $Dir = "";
    if(!isset($root)) $Dir = "../"; ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>T-rain</title>
    <link rel="shortcut icon" href="<?= $Dir ?>img/favicon.ico" type="image/x-icon">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pattaya&display=swap" rel="stylesheet">

    <!-- JS & JQuery Libraries -->
    <script src="<?= $Dir ?>js/jquery-ui-1.12.1.custom/all.min.js"></script>
    <script src="<?= $Dir ?>js/jquery-ui-1.12.1.custom/jquery.js"></script>
    <script src="<?= $Dir ?>js/jquery-ui-1.12.1.custom/typed.min.js"></script>

    <!-- CSS -->
    <link rel="stylesheet" href="<?= $Dir ?>css/style.css">
</head>