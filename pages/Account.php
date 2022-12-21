<?php include '../includes/head.php'; ?>

<body>
    <?php include '../includes/nav.php'; ?>
    <div class="nav-place after-nav"></div>

    <!-- .................................. -->
    <div class="" style="width: 100%; height: 600px;"></div>
    <div style="line-height:200%" class="sidenav">

        <a href="#" id="PD">Personal Details</a>
        <hr class="new1">
        <a href="#" id="LS">Login & Security</a>
        <hr class="new1">
        <a href="#" id="PM">Payment Methods</a>
        <hr class="new1">
        <a href="#" id="PT">Previous Trips</a>
        <hr class="new1">
        <a href="#" id="UT">Upcoming Trips </a>


    </div>

    <form class="pDetails" id="pd1">
        <!-- <img src="user.png" alt="PersonalDetails"> -->
        <h1>Personal Details</h1>
        <label for="firstName" class="u3u3">
            <div class="opopo" style="color: black; font-size: 20px; text-align: left ;position:static; font-style: bold;">First Name *
            </div>
            <div class="oioio">
                <input type="text" name="firstName" id="firstName" class="p1p1p1" inputmode="text" value="yousef">

            </div>
        </label>
        <label for="lastName" class="u3u3">
            <div class="opopo" style="color: black; font-size: 20px; text-align: left;position:static; font-style: bold;">Last Name *
            </div>
            <div class="oioio">
                <input type="text" name="lastName" id="lastName" class="p1p1p1" inputmode="text" value="adel">
            </div>
        </label>
        <label for="email" class="u3u3">
            <div class="opopo" style="color: black; font-size: 20px; text-align: left;position:static; font-style: bold;">Email *</div>
            <div class="oioio">
                <input type="text" name="Email" id="Email" class="p1p1p1" inputmode="text" value="yousefadel@gmail.com">
            </div>
        </label>
        <label for="city" class="u3u3">
            <div class="opopo" style="color: black; font-size: 20px; text-align: left;position:static; font-style: bold;">city *</div>
            <div class="oioio">
                <input type="text" name="city" id="city" class="p1p1p1" inputmode="text" value="cairo">
            </div>
        </label>
        <button class="PDButton" id="PDbutton">Save changes</button>
    </form>
    <?php
    if (isset($_POST["Submit"])) {
        $firstName = $_POST['firstName'];
        $lastname = $_POST['lastName'];
        $city = $_POST['city'];
        $email = $_POST['Email'];
        if ($query = mysqli_query($connect, "INSERT INTO user ('FirstName', 'LastName', 'City', 'Email') VALUES ('$firstName', '$lastname', '$city', '$email')")) {
            echo "Success";
        } else {
            echo "Failure" . mysqli_error($connect);
        }
    } ?>
    <form class="logAndsec" id="Ls1">
        <h1>Login & Security</h1>
        <label for="Current Password" class="u4u4">
            <div class="opopo1" style="color: black; font-size: 20px; text-align: left;position:static; font-style: bold;">Current
                Password *</div>
            <div class="oioio1">
                <input type="text" name="Current Password" id="Current Password" class="p2p2p2" inputmode="password" value="*******">
            </div>
        </label>
        <label for="New password" class="u4u4">
            <div class="opopo1" style="color: black; font-size: 20px; text-align: left;position:static; font-style: bold;">New password
                *</div>
            <div class="oioio1">
                <input type="text" name="New password" id="New password" class="p2p2p2" inputmode="password" value="*******">
            </div>
        </label>
        <label for="Confirm Password" class="u4u4">
            <div class="opopo1" style="color: black; font-size: 20px; text-align: left;position:static; font-style: bold;">Email *</div>
            <div class="oioio1">
                <input type="text" name="Confirm Password" id="Confirm Password" class="p2p2p2" inputmode="password" value="user@email.com">
            </div>
        </label>
        <button class="LSButton" id="LSbutton">Save changes</button>
    </form>
    <?php
    if (isset($_POST["submit"])) {
        $NewPassword = $_POST['New_password'];
        $email = $_POST['Email'];

        if ($query = mysqli_query($connect, "INSERT INTO user ('Password','Email') VALUES ('$NewPassword',  '$email')")) {
            echo "Success";
        } else {
            echo "Failure" . mysqli_error($connect);
        }
    } ?>
    <form class="PaymentMethod" id="Pm1">
        <h3>Payment Method</h1>
            <label for="Email" class="u5u5">
                <div class="opopo2" style="color: black; font-size: 20px; text-align: left;position:static; font-style: bold;">Current
                    Email *</div>
                <div class="oioio2">
                    <input type="text" name="Current Email" id="Current Email" class="p3p3p3" inputmode="email" value="user@email.com">
                </div>
            </label>
            <label for="NameOnTheCard" class="u5u5">
                <div class="opopo2" style="color: black; font-size: 20px; text-align: left;position: static; font-style: bold;">Name On
                    Card *</div>
                <div class="oioio2">
                    <input type="text" name="NameOnTheCard" id="NameOnTheCard" class="p3p3p3" inputmode="text" value="Name on card">
                </div>
            </label>
            <label for="CardNumber" class="u5u5">
                <div class="opopo2" style="color: black; font-size: 20px; text-align: left;position: static; font-style: bold;">Card
                    Number *</div>
                <div class="oioio2">
                    <input type="text" name="CardNumber" id="CardNumber" class="p3p3p3" inputmode="CardNumber" value="1234567891011120">
                </div>
            </label>
            <label for="MMYY" class="u5u5">
                <div class="opopo2" style="color: black; font-size: 20px; text-align: left;position: static; font-style: bold;">MM/YY *
                </div>
                <div class="oioio2">
                    <input type="text" name="MMYY" id="MMYY" class="p3p3p3" inputmode="text" value="12/22">
                </div>
            </label>
            <label for="CVC" class="u5u5">
                <div class="opopo2" style="color: black; font-size: 20px; text-align: left; position:static; font-style: bold;">CVC *
                </div>
                <div class="oioio2">
                    <input type="text" name="Confirm Password" id="Confirm Password" class="p3p3p3" inputmode="CVC" value="123">
                </div>
            </label>
            <label for="ZipCode" class="u5u5">
                <div class="opopo2" style="color: black; font-size: 20px; text-align: left;position: static; font-style: bold;">
                    Zip/Postal Code *</div>
                <div class="oioio2">
                    <input type="text" name="ZipCode" id="ZipCode" class="p3p3p3" inputmode="Number" value="12345">
                </div>
            </label>
            <button class="PMButton" id="PMbutton">Save changes</button>
            <?php
            if (isset($_POST["submit"])) {
                $email = $_POST['Email'];
                $nameOnCard = $_POST['NameOnTheCard'];
                $CardNum = $_POST['CardNumber'];
                $mmyy = $_POST['MMYY'];
                $cvc = $_POST['CVC'];
                $zipcode = $_POST['ZipCode'];
                if ($query = mysqli_query($connect, "INSERT INTO user ('Email', 'NameOnCard', 'CardNo', 'MM/YY','CVC') VALUES ('$email', '$nameOnCard', '$CardNum', '$mmyy','$mmyy','$cvc')")) {
                    echo "Success";
                } else {
                    echo "Failure" . mysqli_error($connect);
                }
            } ?>
    </form>
    <div class="rate" id="rate1">
        <h1 font-style: bold;>previous Trips</h1>
        <h3 font-style: bold;>cairo to Banha <br>28 Dec, 10:30 am <br> 2 Adults, 1 child <br> price: 200$</h3>
        <button class="subBut" id="sub">Submit</button>
        <input type="radio" id="star5" name="rate" value="5" />
        <label for="star5" title="text">5 stars</label>
        <input type="radio" id="star4" name="rate" value="4" />
        <label for="star4" title="text">4 stars</label>
        <input type="radio" id="star3" name="rate" value="3" />
        <label for="star3" title="text">3 stars</label>
        <input type="radio" id="star2" name="rate" value="2" />
        <label for="star2" title="text">2 stars</label>
        <input type="radio" id="star1" name="rate" value="1" />
        <label for="star1" title="text">1 star</label>
    </div>
    <div class="upcoming" id="upcome1">
        <h1 style="text-align: center;">Upcoming Trips</h1>
        <div class="upcome1">
            <p>cairo to alexandria <br>28 Dec, 10:30 am <br> 4 Adults, 1 child <br> price: 400$</p>
            <button class="DelBut1" id="cancel">Cancle Trip</button>
        </div>
        <br>
        <div class="upcome2">
            <p> cairo to aswan <br>28 Dec, 10:30 am <br> 2 Adults, 1 child <br> price: 500$</p>
            <button class="DelBut2" id="cancel">Cancle Trip</button>
        </div>

    </div>

    <div class="animation-wrapper">
        <!-- <div class="rocks_1"></div> -->
        <!-- <div class="rocks_2"></div> -->
        <div class="rails"></div>
        <div class="train"></div>
        <!-- <div class="ground"></div> -->
        <div class="lights"></div>
    </div>

    <?php include '../includes/footer.php'; ?>