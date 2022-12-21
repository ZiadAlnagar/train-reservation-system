<?php
$isSession = false;
$UserD;
function Session()
{
    session_start();
    if (!empty($_SESSION)) {
        global $isSession;
        global $UserD;
        $isSession = true;
        $Data['UserId'] = $_SESSION['UserId'];
        $Data['AccType'] = $_SESSION['AccType'];
        $Data['FName'] = $_SESSION['FName'];
        $UserD = $Data;
    }
}

function Login()
{
    if (isset($_POST['submit'])) {
        global $connection;
        $Email = $_POST['email'];
        $Pass = $_POST['pass'];
        if (empty($Email) || empty($Pass)) {
            echo "Please, fill all fields.";
        } else {
            $Query = "SELECT UserId, AccType, Email, Password, FirstName, Wallet FROM user WHERE Email = '$Email' LIMIT 1";
            $Get_UserDetailsQuery = $connection->query($Query);
            if (!$Get_UserDetailsQuery) {
                die('Get User Query Faild!<br>' . mysqli_error($connection));
            }
            //echo $Get_UserDetailsQuery->num_rows;
            $User = $Get_UserDetailsQuery->fetch_assoc();
            //print_r($User);
            if (!$User) {
                echo "We couldn't find this credenticals in our database!";
            } else {
                $Pass = password_verify($Pass, $User['Password']);
                if (!$Pass) {
                    echo "We couldn't find this credenticals in our database!";
                } else {
                    $UserId = $User['UserId'];
                    $AccType = $User['AccType'];
                    $FName = $User['FirstName'];
                    $Wallet = $User['Wallet'];
                    $_SESSION['UserId'] = $UserId;
                    $_SESSION['AccType'] = $AccType;
                    $_SESSION['FName'] = $FName;
                    $_SESSION['Wallet'] = $Wallet;
                    header("Location: ../index.php");
                }
            }
        }
    }
}

function Search()
{
    global $connection;
    global $SearchQuery;
    global $SearchResultCount;
    if (isset($_POST['search'])) {
        $src = $_POST['src'];
        $dest = $_POST['dest'];
        $date = $_POST['date'];
        $Query = "SELECT TripId, TrainId, s.Name AS Source, d.Name AS Destination, DepartTime, ArrivalTime, TicketCost FROM trip INNER JOIN city s ON Source = s.CityId INNER JOIN city d ON Destination = d.CityId "
            . "WHERE  '$src' LIKE s.Name AND '$dest' LIKE d.Name AND date(DepartTime) <= $date <= DATE_ADD(date(DepartTime), INTERVAL 1 DAY)";
        $SearchQuery = $connection->query($Query);
        if (!$SearchQuery) {
            die('Search Query Faild!<br>' . mysqli_error($connection));
        }
        $SearchResultCount = $SearchQuery->num_rows;
        //echo $SearchResultCount;
        //print_r($SearchQuery->fetch_assoc());
    } else {
        $Query = "SELECT TripId, TrainId, s.Name AS Source, d.Name AS Destination, DepartTime, ArrivalTime, TicketCost FROM trip INNER JOIN city s ON Source = s.CityId INNER JOIN city d ON Destination = d.CityId";
        $SearchQuery = $connection->query($Query);
        if (!$SearchQuery) {
            die('Search Query Faild!<br>' . mysqli_error($connection));
        }
    }
}

function DateFormat($Date, $mode)
{
    $Date = strtotime($Date);
    if ($mode == 0) $Date = date('g : i', $Date);
    if ($mode == 1) $Date = date('j/n/Y', $Date);
    return $Date;
}

function WarningMsg($Msg)
{
    echo "<div style='font-size: 1.2rem; color: red;'>$Msg</div>";
}

function IsInsertPostError($Check, $Msg)
{
    global $Errors;
    !isset($Errors[$Check]) ?: WarningMsg($Msg);
}

function isRoot($root)
{
    $dir = "";
    if (!$root) $dir = "../";
    return $dir;
}

function RehashPassword()
{
    global $connection;
    $Query = "SELECT * FROM user";
    $RehashQuery = $connection->query($Query);
    while ($Record = mysqli_fetch_assoc($RehashQuery)) {
        $UserId = $Record['UserId'];
        $Password = $Record['Password'];
        if (password_needs_rehash($Password, PASSWORD_DEFAULT)) {
            $Password = password_hash($Password, PASSWORD_DEFAULT);
        }
        $Query = "UPDATE user SET Password = '$Password' WHERE UserId = '$UserId';";
        $RehashQueryResult = mysqli_query($connection, $Query);
        if (!$RehashQueryResult) {
            die('Query faild! ' . mysqli_error($connection));
        }
    }
}

// Admin Page //
// Trips View/Add/Update/Delete //
function viewTrip()
{
    global $connection;

    $sql = "SELECT * FROM trip";
    $result = $connection->query($sql);
    if (!$result) die(mysqli_error($connection));
    if ($result->num_rows <= 0) {
        echo '<script>alert("No Records Yet!");</script>';
        return;
    }

    //Create Table Rows
    while ($row = $result->fetch_assoc()) {   //Creates a loop to loop through results
        //Get Source and Destination City Names
        $src = $connection->query("SELECT Name FROM city WHERE CityId = " . $row['Source']);
        if (!$src) die(mysqli_error($connection));
        $dst = $connection->query("SELECT Name FROM city WHERE CityId = " . $row['Destination']);
        if (!$dst) die(mysqli_error($connection));
        //Print Table
        echo "<tr><td>" . $row['TripId'] . "</td><td>" . $row['TrainId'] . "</td><td>" . $src->fetch_assoc()['Name'] . "</td><td>" . $dst->fetch_assoc()['Name'] . "</td><td>" . $row['DepartTime'] . "</td><td>" . $row['ArrivalTime'] . "</td><td>" . $row['TicketCost'] . "</td></tr>";
    }
}
function addTrip()
{
    if (isset($_POST['addtrip'])) {
        global $connection;
        //form input
        if (isset($_POST['trainId']) || isset($_POST['srcName']) || isset($_POST['dstName']) || isset($_POST['srcTime']) || isset($_POST['dstTime']) || isset($_POST['ticketprice'])) {
            //echo $_POST['trainId'] . $_POST['srcName'] . $_POST['dstName'] . $_POST['ticketprice'];

            if (empty($_POST['trainId']) || empty($_POST['srcName']) || empty($_POST['dstName']) || empty($_POST['srcTime']) || empty($_POST['dstTime']) || empty($_POST['ticketprice'])) {
                echo "<script>Please, fill all fields.</script>";
                //header("Location: admin.php?failed1");
                header("Location: admin.php?failed-input");
                //return;
            } else {
                $trainId = $_POST['trainId'];
                $src = $_POST['srcName'];
                $dst = $_POST['dstName'];
                $srcT = $_POST['srcTime'];
                $dstT = $_POST['dstTime'];
                $ticketCost = $_POST['ticketprice'];

                //get city IDs
                $sql = "SELECT CityId FROM city WHERE Name = '$src'";
                $result = $connection->query($sql);
                if (!$result) die(mysqli_error($connection));
                if ($result->num_rows <= 0) {
                    //echo '<script>alert("Source City not Found!");</script>';
                    //header("Location: admin.php?failed2");
                    header("Location: admin.php?failed-input");
                    return;
                } else {
                    $srcId = $result->fetch_assoc()["CityId"];

                    $sql = "SELECT CityId FROM city WHERE city.Name = '$dst'";
                    $result = $connection->query($sql);
                    if ($result->num_rows <= 0) {
                        //echo '<script>alert("Destination City not Found!");</script>';
                        //header("Location: admin.php?failed3");
                        header("Location: admin.php?failed-input");
                        return;
                    } else {
                        $dstId = $result->fetch_assoc()["CityId"];
                        //check if already exist
                        $sql = "SELECT TripId FROM trip 
                        WHERE TrainId = '$trainId' 
                        AND Source = '$srcId' 
                        AND Destination = '$dstId' 
                        AND DepartTime = '$srcT' 
                        AND ArrivalTime = '$dstT' 
                        AND TicketCost = '$ticketCost'";
                        $result = $connection->query($sql);
                        if (!$result) die(mysqli_error($connection));
                        if ($result->num_rows > 0) {
                            header("Location: admin.php?failed-repeated");
                            return;
                        } else {
                            $sql = "INSERT INTO trip (TrainId, Source, Destination, DepartTime, ArrivalTime, TicketCost) VALUES ('$trainId', '$srcId', '$dstId', '$srcT', '$dstT', '$ticketCost')";
                            if (!$result) die(mysqli_error($connection));
                            if ($connection->query($sql) === TRUE) {
                                header("Location: admin.php?success");
                            } else {
                                echo "Error: " . $sql . "<br>" . $connection->error;
                                header("Location: admin.php?failed-db");
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
}
function updateTrip()
{
    if (isset($_POST['updatetrip'])) {
        global $connection;
        //form input
        if (isset($_POST['trainId']) || isset($_POST['srcName']) || isset($_POST['dstName']) || isset($_POST['srcTime']) || isset($_POST['dstTime']) || isset($_POST['ticketprice'])) {
            //echo $_POST['trainId'] . $_POST['srcName'] . $_POST['dstName'] . $_POST['ticketprice'];

            if (empty($_POST['trainId']) || empty($_POST['srcName']) || empty($_POST['dstName']) || empty($_POST['srcTime']) || empty($_POST['dstTime']) || empty($_POST['ticketprice'])) {
                echo "<script>Please, fill all fields.</script>";
                //header("Location: admin.php?failed1");
                header("Location: admin.php?failed-input");
                //return;
            } else {
                $trainId = $_POST['trainId'];
                $src = $_POST['srcName'];
                $dst = $_POST['dstName'];
                $srcT = $_POST['srcTime'];
                $dstT = $_POST['dstTime'];
                $ticketCost = $_POST['ticketprice'];

                //get city IDs
                $sql = "SELECT CityId FROM city WHERE Name = '$src'";
                $result = $connection->query($sql);
                if (!$result) die(mysqli_error($connection));
                if ($result->num_rows <= 0) {
                    header("Location: admin.php?failed-input");
                    return;
                } else {
                    $srcId = $result->fetch_assoc()["CityId"];

                    $sql = "SELECT CityId FROM city WHERE city.Name = '$dst'";
                    $result = $connection->query($sql);
                    if ($result->num_rows <= 0) {
                        header("Location: admin.php?failed-input");
                        return;
                    } else {
                        $dstId = $result->fetch_assoc()["CityId"];
                        //check if already exist
                        $sql = "SELECT TripId FROM trip 
                        WHERE TrainId = '$trainId' 
                        AND Source = '$srcId' 
                        AND Destination = '$dstId' 
                        AND DepartTime = '$srcT' 
                        AND ArrivalTime = '$dstT' 
                        AND TicketCost = '$ticketCost'";
                        $tripId = $connection->query($sql);
                        if (!$tripId) die(mysqli_error($connection));
                        else {
                            $sql = "UPDATE trip SET TrainId = '$trainId', Source = '$srcId', Destination = '$dstId', DepartTime = '$srcT', ArrivalTime = '$dstT', TicketCost = '$ticketCost' WHERE TripId = '$tripId'";
                            if ($connection->query($sql) === TRUE) {
                                header("Location: admin.php?success");
                            } else {
                                echo "Error: " . $sql . "<br>" . $connection->error;
                                header("Location: admin.php?failed-db");
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
}
function deleteTrip()
{
    if (isset($_POST['deletetrip'])) {
        global $connection;
        if (isset($_POST['trainId']) || isset($_POST['srcName']) || isset($_POST['dstName']) || isset($_POST['srcTime']) || isset($_POST['dstTime']) || isset($_POST['ticketprice'])) {
            if (empty($_POST['trainId']) || empty($_POST['srcName']) || empty($_POST['dstName']) || empty($_POST['srcTime']) || empty($_POST['dstTime']) || empty($_POST['ticketprice'])) {
                echo "<script>Please, fill all fields.</script>";
                header("Location: admin.php?failed-input");
                //return;
            } else {
                $trainId = $_POST['trainId'];
                $src = $_POST['srcName'];
                $dst = $_POST['dstName'];
                $srcT = $_POST['srcTime'];
                $dstT = $_POST['dstTime'];
                $ticketCost = $_POST['ticketprice'];

                //get city IDs
                $sql = "SELECT CityId FROM city WHERE Name = '$src'";
                $result = $connection->query($sql);
                if (!$result) die(mysqli_error($connection));
                if ($result->num_rows <= 0) {
                    header("Location: admin.php?failed-input");
                    return;
                } else {
                    $srcId = $result->fetch_assoc()["CityId"];

                    $sql = "SELECT CityId FROM city WHERE city.Name = '$dst'";
                    $result = $connection->query($sql);
                    if ($result->num_rows <= 0) {
                        header("Location: admin.php?failed-input");
                        return;
                    } else {
                        $dstId = $result->fetch_assoc()["CityId"];

                        //check if already exist
                        $sql = "SELECT TripId FROM trip 
                        WHERE TrainId = '$trainId' 
                        AND Source = '$srcId' 
                        AND Destination = '$dstId' 
                        AND DepartTime = '$srcT' 
                        AND ArrivalTime = '$dstT' 
                        AND TicketCost = '$ticketCost'";
                        $tripId = $connection->query($sql);
                        if (!$tripId) die(mysqli_error($connection));
                        else {
                            //delete trip
                            $sql = "DELETE FROM trip WHERE TripId = '$tripId'";
                            if ($connection->query($sql) === TRUE) {
                                header("Location: admin.php?success");
                            } else {
                                echo "Error: " . $sql . "<br>" . $connection->error;
                                header("Location: admin.php?failed-db");
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
}

// Train View/Add/Update/Delete //
function viewTrain()
{
    global $connection;

    $sql = "SELECT * FROM train";
    $result = $connection->query($sql);
    if (!$result) die(mysqli_error($connection));
    if ($result->num_rows <= 0) {
        echo '<script>alert("No Records Yet!");</script>';
        return;
    }

    //Create Table Rows
    while ($row = $result->fetch_assoc()) {   //Creates a loop to loop through results
        //Print Table
        echo "<tr><td>" . $row['TrainId'] . "</td><td>" . $row['Seats'] . "</td><td>" . $row['DateCreated'] . "</td><td>" . $row['DateUpdated'] . "</td></tr>";
    }
}

function addTrain()
{
    if (isset($_POST['addtrain'])) {
        global $connection;
        //form input
        if (isset($_POST['trainId']) || isset($_POST['seats']) || isset($_POST['created']) || isset($_POST['updated'])) {
            if (empty($_POST['trainId']) || empty($_POST['seats']) || empty($_POST['created']) || empty($_POST['updated'])) {
                header("Location: admin.php?failed-input");
                //return;
            } else {
                $trainId = $_POST['trainId'];
                $seats = $_POST['seats'];
                $created = $_POST['created'];
                $updated = $_POST['updated'];

                //add trip
                $sql = "INSERT INTO train (Seats, DateCreated, DateUpdated) VALUES ('$seats', '$created', '$updated')";
                if ($connection->query($sql) === TRUE) {
                    header("Location: admin.php?success");
                } else {
                    echo "Error: " . $sql . "<br>" . $connection->error;
                    header("Location: admin.php?failed-db");
                    return;
                }
            }
        }
    }
}

function updateTrain()
{
    if (isset($_POST['updatetrain'])) {
        global $connection;
        //form input
        if (isset($_POST['trainId']) || isset($_POST['seats']) || isset($_POST['created']) || isset($_POST['updated'])) {
            if (empty($_POST['trainId']) || empty($_POST['seats']) || empty($_POST['created']) || empty($_POST['updated'])) {
                header("Location: admin.php?failed-input");
                //return;
            } else {
                $trainId = $_POST['trainId'];
                $seats = $_POST['seats'];
                $created = $_POST['created'];
                $updated = $_POST['updated'];

                $sql = "UPDATE train SET Seats = '$seats', DateUpdated = '$updated' WHERE TrainId = '$trainId'";
                if ($connection->query($sql) === TRUE) {
                    header("Location: admin.php?success");
                } else {
                    echo "Error: " . $sql . "<br>" . $connection->error;
                    header("Location: admin.php?failed-db");
                    return;
                }
            }
        }
    }
}

function deleteTrain()
{
    if (isset($_POST['deletetrain'])) {
        global $connection;
        //form input
        if (isset($_POST['trainId']) || isset($_POST['seats']) || isset($_POST['created']) || isset($_POST['updated'])) {
            if (empty($_POST['trainId']) || empty($_POST['seats']) || empty($_POST['created']) || empty($_POST['updated'])) {
                header("Location: admin.php?failed-input");
                //return;
            } else {
                $trainId = $_POST['trainId'];
                $seats = $_POST['seats'];
                $created = $_POST['created'];
                $updated = $_POST['updated'];

                $sql = "DELETE FROM train WHERE TrainId = '$trainId'";
                if ($connection->query($sql) === TRUE) {
                    header("Location: admin.php?success");
                } else {
                    echo "Error: " . $sql . "<br>" . $connection->error;
                    header("Location: admin.php?failed-db");
                    return;
                }
            }
        }
    }
}

// City View/Add/Update/Delete //
function viewCity()
{
    global $connection;

    $sql = "SELECT * FROM city";
    $result = $connection->query($sql);
    if (!$result) die(mysqli_error($connection));
    if ($result->num_rows <= 0) {
        echo '<script>alert("No Records Yet!");</script>';
        return;
    }

    //Create Table Rows
    while ($row = $result->fetch_assoc()) {   //Creates a loop to loop through results
        //Print Table
        echo "<tr><td>" . $row['CityId'] . "</td><td>" . $row['Name'] . "</td></tr>";
    }
}

function addCity()
{
    if (isset($_POST['addcity'])) {
        global $connection;
        //form input
        if (isset($_POST['cityId']) || isset($_POST['name'])) {
            if (empty($_POST['cityId']) || empty($_POST['name'])) {
                header("Location: admin.php?failed-input");
                //return;
            } else {
                $cityId = $_POST['cityId'];
                $name = $_POST['name'];

                $sql = "INSERT INTO city (CityId , Name) VALUES ('$cityId', '$name')";
                if ($connection->query($sql) === TRUE) {
                    header("Location: admin.php?success");
                } else {
                    echo "Error: " . $sql . "<br>" . $connection->error;
                    header("Location: admin.php?failed-db");
                    return;
                }
            }
        }
    }
}

function updateCity()
{
    if (isset($_POST['updatetrain'])) {
        global $connection;
        //form input
        if (isset($_POST['cityId']) || isset($_POST['name'])) {
            if (empty($_POST['cityId']) || empty($_POST['name'])) {
                header("Location: admin.php?failed-input");
                //return;
            } else {
                $cityId = $_POST['cityId'];
                $name = $_POST['name'];

                $sql = "UPDATE city SET Name = '$name' WHERE CityId = '$cityId'";
                if ($connection->query($sql) === TRUE) {
                    header("Location: admin.php?success");
                } else {
                    echo "Error: " . $sql . "<br>" . $connection->error;
                    header("Location: admin.php?failed-db");
                    return;
                }
            }
        }
    }
}

function deleteCity()
{
    if (isset($_POST['deletetrain'])) {
        global $connection;
        //form input
        if (isset($_POST['cityId']) || isset($_POST['name'])) {
            if (empty($_POST['cityId']) || empty($_POST['name'])) {
                header("Location: admin.php?failed-input");
                //return;
            } else {
                $cityId = $_POST['cityId'];
                $name = $_POST['name'];

                $sql = "DELETE FROM city WHERE CityId = '$cityId'";
                if ($connection->query($sql) === TRUE) {
                    header("Location: admin.php?success");
                } else {
                    echo "Error: " . $sql . "<br>" . $connection->error;
                    header("Location: admin.php?failed-db");
                    return;
                }
            }
        }
    }
}
