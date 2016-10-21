<?php

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];
$to = "nicholas.w.swift@gmail.com";
$subject = "Message From Nicholas-Swift.com!";

mail ($to, $subject, $name . ", " . $email . "\n\n" . $message);
echo "Thanks for contacting me. Your Message has been sent.";

?>