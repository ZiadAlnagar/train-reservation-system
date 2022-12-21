<?php include '../includes/head.php'; ?>

<body onload="updateTotal()">
    <?php include '../includes/nav.php'; ?>
    <div class="nav-place after-nav"></div>

    <div class="page-body">
        <div class="main">
            <div class="card-v" style="min-height: 20rem;">
                <div class="title">Trip Details</div>
                <div>
                    <div>
                        <p class="label">Trip Number: &nbsp</p>
                        <p class="trip-no">1002</p>
                    </div>
                    <div>
                        <p class="label">Train Number: &nbsp</p>
                        <p class="train-no">143</p>
                    </div>
                </div>
                <div>
                    <div>
                        <p class="label">From: &nbsp</p>
                        <p class="station">Cairo Station</p>
                    </div>
                    <div>
                        <p class="label">Date: &nbsp</p>
                        <p class="date">15/5/2021</p>
                    </div>
                    <div>
                        <p class="label">Time: &nbsp</p>
                        <p class="time">1:30</p>
                    </div>

                </div>
                <div>
                    <div>
                        <p class="label">To: &nbsp&nbsp&nbsp&nbsp&nbsp</p>
                        <p class="station">Alex Station</p>
                    </div>
                    <div>
                        <p class="label">Date: &nbsp</p>
                        <p class="date">15/5/2021</p>
                    </div>
                    <div>
                        <p class="label">Time: &nbsp</p>
                        <p class="time">2:45</p>
                    </div>
                </div>
                <div>
                    <div>
                        <p class="label">Class: &nbsp</p>
                        <p class="class">Economy</p>
                    </div>
                    <div>
                        <p class="label">Passengers: &nbsp&nbsp&nbsp&nbsp&nbsp</p>
                        <fieldset class="inc-dec">
                            <input type="button" value="-" class="decrease" />
                            <input type="text" class="limit" value="1" disabled />
                            <input type="button" value="+" class="increase" />
                        </fieldset>
                    </div>
                </div>
            </div>
            <form class="card-v" style="min-height: 20rem;">
                <div class="title">Contact Information</div>
                <div>
                    <p class="label">Email: &nbsp&nbsp&nbsp&nbsp&nbsp</p>
                    <input type="text" tabindex="1" name="email" required>
                </div>
                <div>
                    <p class="label">Phone: &nbsp&nbsp&nbsp&nbsp</p>
                    <input type="text" tabindex="2" name="phone" maxlength="11" required>
                </div>
                <div>
                    <p class="label">Address: &nbsp</p>
                    <input type="text" tabindex="3" name="text">
                </div>
                <div>
                    <a class="login-skip" href="Log_in.php">Login in to skip</a>
                </div>
            </form>
            <form class="card-v" style="min-height: 24rem;">
                <div class="title">Payment Method</div>
                <div>
                    <p class="label">Card Number: &nbsp&nbsp</p>
                    <input type="text" placeholder="1111-1111-1111-1111" maxlength="12" minlength="12" name="visa-num"
                        required>
                </div>
                <div>
                    <p class="label">Exp Date: &nbsp</p>
                    <input type="text" placeholder="05" maxlength="2" style="width: 3rem;" name="month" required>
                    <input type="text" placeholder="2021" maxlength="4" style="width: 5rem;" name="year" required>
                </div>
                <div>
                    <p class="label">CVV No.: &nbsp&nbsp</p>
                    <input type="text" placeholder="111" maxlength="3" style="width: 3rem;" name="number" required>
                </div>
                <div>
                    <a class="login-skip" href="Log_in.php">Login in to skip</a>
                </div>
            </form>
            <div class="card-v" style="min-height: 8rem;">
                <div class="title">Have a coupon?</div>
                <div>
                    <input type="text" placeholder="Enter Coupon Code" maxlength="12" name="discount">
                    <a href="#" class="button" onclick="updateTotal()">Apply</a>
                </div>
            </div>
        </div>
        <div class="sidebar">
            <div class="side-container">
                <h2>Price Summary</h2>
                <div class="card-v price-summary">
                    <div>
                        <p class="label">Single Passenger Fare:</p>
                        <p class="price">25 EGP</p>
                    </div>
                    <div>
                        <p class="label">Passenegers No.:</p>
                        <p class="passenger-num">1</p>
                    </div>
                    <div>
                        <p class="label">Discount: </p>
                        <p class="discount">5 EGP</p>
                    </div>
                    <div class="total">
                        <p class="label">Total: </p>
                        <p>0 EGP</p>
                    </div>
                    <div>
                        <a href="TripsList.php" class="button buy" onclick="vaildateBookingForm()">Confirm Booking</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php include '../includes/footer.php'; ?>