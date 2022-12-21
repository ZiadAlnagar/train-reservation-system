<?php 
$root = true;
include 'includes/head.php'; ?>

<body>
    <?php 
    include 'includes/nav.php'; ?>
    <header class="header after-nav">
        <div class="landing container flex flex-center text-center">
            <h2 class="title w-full">
                Wherever you go, Train Follows.
            </h2>
            <div class="search">
                <form action="pages/TripsList.php" method="post" class="search-form">
                    <div class="search-form-container flex flex-center">
                        <div class="input"><input type="text" id="from" name="src" placeholder="From" required>
                            <div class="swap"></div>
                        </div>
                        <div class="input"><input type="text" id="to" name="dest" placeholder="To" required></div>
                        <div class="input"><input type="date" name="date" placeholder="Depart Date" required></div>
                        <div class="input btn"><button class="search-btn" name="search" type="submit"><i
                                    class="fas fa-search"></i></button>
                        </div>
                        <div class="input"><input class="search-btn" type="submit" name="search" value="Search Train">
                            <a href="javascript: void(0)" id="s-btn"><i class="fas fa-search search-ico"></i></a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </div>
    </header>

    <div class="main-services flex flex-column flex-center text-center">
        <div class="container">
            <h2 class="">Why choose us?</h2>
            <div class="card-box flex">
                <div class="card flex flex-center">
                    <div class="card-ico flex items-center">
                        <img src="./img/train-256.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3>Special Trains</h3>
                        <p>Special trains for our special people!</p>
                    </div>
                </div>
                <div class="card flex flex-center">
                    <div class="card-ico flex items-center">
                        <img src="img/express_train_railway_travel-256.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3>Live Station</h3>
                        <p>Keep updated with all trains arrival and leave times.</p>
                    </div>
                </div>
                <div class="card flex flex-center">
                    <div class="card-ico flex items-center">
                        <img src="img/Train.png" alt="">
                        <button class="blink">
                            <div class="blink-origin"></div>
                        </button>
                    </div>
                    <div class="card-content">
                        <h3>Live Status</h3>
                        <p>Stay tuned with any delays or updates as it occurs</p>
                    </div>
                </div>
                <div class="card flex flex-center">
                    <div class="card-ico flex items-center">
                        <img src="img/Train-ticket-256.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3>Fast Ticket</h3>
                        <p>Get tickets with simple few steps.</p>
                    </div>
                </div>
                <div class="card flex flex-center">
                    <div class="card-ico flex items-center">
                        <img src="img/caledar-256.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3>Seat Calender</h3>
                        <p>Check seat availablity of a trip for up to 1 month ahead.</p>
                    </div>
                </div>
                <div class="card flex flex-center">
                    <div class="card-ico flex items-center">
                        <img src="img/24-7-01-256.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3>24 / 7 Service</h3>
                        <p>Enjoy our services at any given time of a day.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="video-container">
        <video src="img/Train_Service.mp4" autoplay muted loop playsinline preload="metadata"
            poster="img/pexels-markus-spiske-3671142.jpeg">
            <source srcset="resources/Train_Service.mp4" type="video/mp4">
        </video>
        <p class="video-text"></p>
    </div>

<?php include 'includes/footer.php'; ?>