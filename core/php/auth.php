<?php

include 'connect.php';

// Получение данных из формы
$username = $_POST['login-auth'];
$password = $_POST['password-auth'];

$is_auth = false;

$passwordtw = md5($password);
// Запрос на проверку введенных данных
$selectUser = "SELECT * FROM users WHERE nickname = '$username' AND password = '$passwordtw'";
$result = $link->query($selectUser);

if ($result->num_rows == 1) {
    // Авторизация успешна
    echo 'Успешная авторизация';
} else {
    // Авторизация неуспешна
    echo 'Неверное имя пользователя или пароль';
}

$link->close();
setcookie('auth', $is_auth, time() + 3600, '/');
header('Location: /icdel-main/');
exit();

?>