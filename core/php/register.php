<?php
session_start(); // Начало сессии

include 'connect.php';

$login = $_POST['login'];
$password = $_POST['pass'];
$twopassword = $_POST['passtwo'];

if ($password != $twopassword) {
    $error = 'Ошибка пароля';
    echo "<script>document.getElementById('error-message').textContent = '$error';</script>";
    exit();
}

$hechpassword = md5($password);

$sql = "INSERT INTO users (nickname, password) VALUES ('$login','$hechpassword')";

if (mysqli_query($link, $sql)) {
    header('Location: ../../index.html');
} else {
    echo 'Ошибка' . mysqli_error($link);
}

// Закрытие соединения
$link->close();
?>