<?php include '../includes/head.php';
//Trip
addTrip();
updateTrip();
deleteTrip();
//Train
addTrain();
updateTrain();
deleteTrain();
//City
addCity();
updateCity();
deleteCity();
if (isset($_GET['success']))
    echo '<script>alert("New record updated successfully");</script>';
else if (isset($_GET['failed-input']))
    echo '<script>alert("Saving Failed! Invalid Input!");</script>';
else if (isset($_GET['failed-repeated']))
    echo '<script>alert("Saving Failed! Data already exists!");</script>';
else if (isset($_GET['failed-db']))
    echo '<script>alert("Saving Failed! Database Connection Failed!");</script>';
else if (isset($_GET['failed']))
    echo '<script>alert("Saving Failed!");</script>';
?>

<body onload="displayAdminTab(1)">
    <nav class="nav flex items-center">
        <div class="logo px-20">
            <a href="../index.html" class="flex flex-center">
                <img src="../img/favicon.ico" alt="train logo" width="45">
                <h1>T-rain</h1>
            </a>
        </div>
        <div class="nav-menu">
            <ul>
                <li><a href="admin.html">Home</a></li>
                <li><a href="adminBookTrip.html">Book Trip</a></li>
                <li><a href="addLine.html">Lines</a></li>
                <li><a href="#">Trips</a></li>
                <li><a href="#">Trains</a></li>
            </ul>
        </div>
        <div class="account flex items-center">
            <a href="#">
                <img src="../img/clipart3643767.png" alt="" width="50">
            </a>
            <div class="dropdown ml-10">
                <a class="dropbtn flex items-center">username<i class="fas fa-sort-down ml-5"></i></a>
                <div class="dropdown-content">
                    <a href="../pages/Account.html">My Account</a>
                    <a href="#">Log out</a>
                </div>
            </div>
        </div>
        <div class="mobile-nav">
            <a href="admin.html">Home</a>
            <a href="adminBookTrip.html">Book Trip</a>
            <a href="addLine.html">Lines</a>
            <a href="#">Trips</a>
            <a href="#">Trains</a>
            <a href="../pages/Account.html">My Account</a>
            <a href="#">Log out</a>
        </div>
        <a href="javascript: void(0)" class="burger-nav-ico">
            <i class="fa fa-bars fa-2x"></i>
        </a>
    </nav>
    <div class="nav-place after-nav"></div>
    <div class="nav-overlay"></div>

    <div class="page-body full-width">
        <div class="sidebar">
            <div id="admin-tabs-btn" class="side-container">
                <div class="side-section" onclick="displayAdminTab(1)">
                    <p>Trips</p>
                </div>
                <div class="side-section" onclick="displayAdminTab(2)">
                    <p>Trains</p>
                </div>
                <div class="side-section" onclick="displayAdminTab(3)">
                    <p>Cities</p>
                </div>
            </div>
        </div>
        <div id="admin-tabs" class="main">
            <div id="trip" class="card-v" style="height: 100%;">
                <div class="title" style="flex-basis: 5%; justify-content: center; font-size: 1.8rem;">Trips</div>
                <div class="table" style="flex-basis: 60%;">
                    <table>
                        <tr>
                            <th>Trip ID</th>
                            <th>Train ID</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>DepartTime</th>
                            <th>ArrivalTime</th>
                            <th>Ticket Price</th>
                        </tr>
                        <?php viewTrip(); ?>
                    </table>
                </div>
                <form action="" method="post" id="tripform" style="display: flex; width:100%; flex-basis: 30%;flex-flow: column nowrap; justify-content: space-around;">
                    <div class="table-input" style="width: 100%; display: flex; flex-flow: row nowrap;">
                        <div>
                            <p class="label">Train ID: </p>
                            <input class="admin-input" type="text" maxlength="12" name="trainId" style="width: 10rem;">
                        </div>
                        <div>
                            <p class="label">Source: </p>
                            <input class="admin-input" type="text" maxlength="12" name="srcName" style="width: 10rem;">
                        </div>
                        <div>
                            <p class="label">Destination: </p>
                            <input class="admin-input" type="text" maxlength="12" name="dstName" style="width: 10rem;">
                        </div>
                        <div>
                            <p class="label">DepartTime: </p>
                            <input class="admin-input" type="text" maxlength="12" name="srcTime" style="width: 10rem;">
                        </div>
                        <div>
                            <p class="label">ArrivalTime: </p>
                            <input class="admin-input" type="text" maxlength="12" name="dstTime" style="width: 10rem;">
                        </div>
                        <div>
                            <p class="label">Price: </p>
                            <input class="admin-input" type="text" maxlength="12" name="ticketprice" style="width: 10rem;">
                        </div>
                    </div>
                    <div class="table-btns" style="width: 100%; display: flex; flex-flow: row nowrap;">
                        <div><button type="button" name="addtrip" class="button buy" onclick="addBtn('trip')">Add</button></div>
                        <div><button type="button" name="updatetrip" class="button buy" onclick="updateBtn('trip')">Edit</button></div>
                        <div><button type="submit" name="deletetrip" class="button buy" onclick="deleteBtn('trip')">Delete</button></div>
                    </div>
                </form>
            </div>
            <div id="train" class="card-v" style="height: 100%;">
                <div class="title" style="flex-basis: 5%; justify-content: center; font-size: 1.8rem;">Trains</div>
                <div class="table" style="flex-basis: 60%;">
                    <table>
                        <tr>
                            <th>Train ID</th>
                            <th>Seats</th>
                            <th>Date Created</th>
                            <th>Date Updated</th>
                        </tr>
                        </tr>
                        <?php viewTrain(); ?>
                    </table>
                </div>
                <form action="" method="post" id="trainform" style="display: flex; width:100%; flex-basis: 30%;flex-flow: column nowrap; justify-content: space-around;">
                    <div class="table-input" style="width: 100%; display: flex; flex-flow: row nowrap;">
                        <div>
                            <p class="label">Train ID: </p>
                            <input class="admin-input" type="text" maxlength="12" name="trainId" style="width: 10rem;">
                        </div>
                        <div>
                            <p class="label">Seats: </p>
                            <input class="admin-input" type="text" maxlength="12" name="seats" style="width: 10rem;">
                        </div>
                        <div>
                            <p class="label">Date Created: </p>
                            <input class="admin-input" type="text" maxlength="12" name="created" style="width: 10rem;">
                        </div>
                        <div>
                            <p class="label">Date Updated: </p>
                            <input class="admin-input" type="text" maxlength="12" name="updated" style="width: 10rem;">
                        </div>
                    </div>
                    <div class="table-btns" style="width: 100%; display: flex; flex-flow: row nowrap;">
                        <div><button type="button" name="addtrain" class="button buy" onclick="addBtn('train')">Add</button></div>
                        <div><button type="button" name="updatetrain" class="button buy" onclick="updateBtn('train')">Edit</button></div>
                        <div><button type="submit" name="deletetrain" class="button buy" onclick="deleteBtn('train')">Delete</button></div>
                    </div>
                </form>
            </div>
            <div id="city" class="card-v" style="height: 100%;">
                <div class="title" style="flex-basis: 5%; justify-content: center; font-size: 1.8rem;">Cities</div>
                <div class="table" style="flex-basis: 60%;">
                    <table>
                        <tr>
                            <th>City ID</th>
                            <th>City Name</th>
                        </tr>
                        <?php viewCity(); ?>
                    </table>
                </div>
                <form action="" method="post" id="cityform" style="display: flex; width:100%; flex-basis: 30%;flex-flow: column nowrap; justify-content: space-around;">
                    <div class="table-input" style="width: 100%; display: flex; flex-flow: row nowrap;">
                        <div>
                            <p class="label">City ID: </p>
                            <input class="admin-input" type="text" maxlength="12" name="cityId" style="width: 10rem;" disabled>
                        </div>
                        <div>
                            <p class="label">City Name: </p>
                            <input class="admin-input" type="text" maxlength="12" name="name" style="width: 10rem;" disabled>
                        </div>
                    </div>
                    <div class="table-btns" style="width: 100%; display: flex; flex-flow: row nowrap;">
                        <div><button type="button" name="addcity" class="button buy" onclick="addBtn('city')">Add</button></div>
                        <div><button type="button" name="updatecity" class="button buy" onclick="updateBtn('city')">Edit</button></div>
                        <div><button type="submit" name="deletecity" class="button buy" onclick="deleteBtn('city')">Delete</button></div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="copyright">&copy Copyright 2021 | ❤️ BUE IP Project | Group 29</div>

    <div class="to-top"><i class="fas fa-chevron-circle-up to-top-ico"></i></div>

    <!-- JS  -->
    <script type="text/javascript" src="../js/script-zeyad.js"></script>
    <script type="text/javascript" src="../js/script-yousef-mohamed.js"></script>
</body>
</html>