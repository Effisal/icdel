<?php

    //$hash = password_hash($pass, PASSWORD_DEFAULT);
    session_start();
    require_once 'connect.php';

    $login = $_POST['login'];
    $pass = $_POST['pass'];

    if (strlen($login) < 2) {
        $_SESSION['message'] = 'логин не может быть менее 2 символов';
        header('Location: /13.loc/register.php');
        exit();
    }

    if (strlen($login) > 10) {
        $_SESSION['message'] = 'логин не может быть больше 10 символов';
        header('Location: /13.loc/register.php');
        exit();
    }

    if (strlen($pass) < 3) {
        $_SESSION['message'] = 'пароль не может быть менее 3 символов';
        header('Location: /13.loc/register.php');
        exit();
    }

    $pass = md5($pass);
    
    $sql = mysqli_query($link,"INSERT INTO `users` (login, password) VALUES ('$login', '$pass')");

    $_SESSION['message1'] = 'Вы зарегистрировались';

    if ($sql) {
        echo '<p>Данные успешно добавлены в таблицу.</p>';
    } else {
        echo '<p>Произошла ошибка: ' . mysqli_error($link) . '</p>';
    }


    header('Location: /13.loc');
?>