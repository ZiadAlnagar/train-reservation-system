<?php include '../includes/head.php';
        $anim = 1;
        $SearchQuery;
        $SearchResultCount = 0;
        Search(); ?>
<body>
    <?php include '../includes/nav.php'; ?>
    <div class="nav-place after-nav"></div>
    <header class="header header-mini">
        <div class="landing container flex flex-center text-center">
            <div class="search">
                <form action="" method="post" class="search-form">
                    <div class="search-form-container flex flex-center">
                        <div class="input"><input type="text" name="src" id="from" placeholder="From" required>
                            <div class="swap"></div>
                        </div>
                        <div class="input"><input type="text" id="to" name="dest" placeholder="To" required></div>
                        <div class="input"><input type="date" name="date" placeholder="Depart Date" required></div>
                        <div class="input btn"><button class="search-btn" type="submit" name="search"><i class="fas fa-search"></i></button>
                        </div>
                        <div class="input"><input class="search-btn" type="submit" name="search" value="Search Train">
                            <a href="javascript: void(0)" id="s-btn"><i class="fas fa-search search-ico"></i></a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </header>

    <div class="page-body">
        <div class="sidebar">
            <div class="side-container">
                <h2>Filter By</h2>
                <div class="side-section">
                    <p class="filter-type">Departure Time</p>
                    <span id="rangeval-1">00:00 - 23:00</span>
                    <div id="rangeslider-1"></div>
                    <script>
                        $('#rangeslider-1').slider({
                            range: true,
                            min: 0,
                            max: 23,
                            values: [0, 23],
                            slide: function(event, ui) {
                                $('#rangeval-1').php(ui.values[0] + ":00" + " - " + ui.values[1] + ":00");
                            },
                        });
                    </script>
                </div>
                <div class="side-section">
                    <p class="filter-type">Arrive Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                    <span id="rangeval-2">00:00 - 23:00</span>
                    <div id="rangeslider-2"></div>
                    <script>
                        $('#rangeslider-2').slider({
                            range: true,
                            min: 0,
                            max: 23,
                            values: [0, 23],
                            slide: function(event, ui) {
                                $('#rangeval-2').php(ui.values[0] + ":00" + " - " + ui.values[1] + ":00");
                            },
                        });
                    </script>
                </div>
                <div class="side-section">
                    <p class="filter-type">Class Type</p>
                    <label>
                        <input type="checkbox" checked> Economy
                    </label>
                    <label>
                        <input type="checkbox" checked> First Class
                    </label>
                    <label>
                        <input type="checkbox" checked> Sleeper Class
                    </label>
                </div>
            </div>
        </div>
        <div class="main">
            <? if ($SearchResultCount == 0 && isset($_POST['search'])) {
                echo "<p style='font-size: 1.2rem;'>No Trains in this area were found!<br>We are doing our best to support new areas.</p>";
            } else {
                while ($Trip = $SearchQuery->fetch_assoc()) {
                    $TripId = $Trip['TripId'];
                    $TrainId = $Trip['TrainId'];
                    $Source = $Trip['Source'];
                    $Dest = $Trip['Destination'];
                    $Depart = $Trip['DepartTime'];
                    $DeptTime = DateFormat($Depart, 0);
                    $DeptDate = DateFormat($Depart, 1);
                    $Arrival = $Trip['ArrivalTime'];
                    $ArrivalTime = DateFormat($Arrival, 0);
                    $ArrivalDate = DateFormat($Arrival, 1);
                    $TicketCost = $Trip['TicketCost']; ?>
                    <div class="trip-card" onmouseenter="TripCardAnimation(<?= $anim++ ?>)">
                        <div class="info" style="flex-grow: 1;">
                            <p>Train Number</p>
                            <p class="train-no"><?= $TrainId ?></p>
                            <p class="class">Economy</p>
                        </div>
                        <div class="dept" style="flex-grow: 2;">
                            <p class="station"><?= $Source ?> Station</p>
                            <p class="time"><?= $DeptTime ?></p>
                            <p class="date"><?= $DeptDate ?></p>
                        </div>
                        <div class="timeline" style="flex-grow: 2;">
                            <div class="dot"></div>
                            <div class="line animate"></div>
                            <img class="icon" src="../img/train-icon-30px.png" alt="Train Icon">
                        </div>
                        <div class="arrive" style="flex-grow: 2;">
                            <p class="station"><?= $Dest ?> Station</p>
                            <p class="time"><?= $ArrivalTime ?></p>
                            <p class="date"><?= $ArrivalDate ?></p>
                        </div>
                        <div class="trip-book" style="flex-grow: 2;">
                            <p class="price"><?= $TicketCost ?> EGP</p>
                            <a href="TripBooking.php?Trip=<?= $TripId ?>">Book</a>
                        </div>
                    </div>
            <? }
            } ?>
        </div>
    </div>

    <?php include '../includes/footer.php'; ?>