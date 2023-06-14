<?php

// Подключение к бд
include 'connect.php';

// получение данных из формы
$username = $_POST['login-auth'];
$password = $_POST['password-auth'];

$hechpassword = md5($password);

$selectUser = "SELECT * FROM users WHERE login = '$username' AND password = '$hechpassword'";
$result = $link->query($selectUser);

if ($result === 1) {
    $icept = 'Успешная регистрация';
    echo "<script>document.getElementById('iccept-message').textContent = '$icept';</script>";
    exit();
}


?>