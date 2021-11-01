<?php
if($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "emmasini@gmail.com";
    $subject = "Contact site";
    $email = $_POST['email'];
    $body = "Sender: ".$email."<br><br>Message: ".$_POST['message'];
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    $headers .= "From: Eduardo Masini Site <me@eduardomasini.com>\r\n";

    if(mail($to,$subject,$body,$headers)) {
        echo "1";
    } else {
        echo "0";
    }
}
?>