<?php

$link = mysqli_connect("localhost", "root", "", "icdel_db");

    if ($link == false){
        print("Ошибка: Невозможно подключиться к MySQL " . mysqli_connect_error());
    }

echo 'успешное подключениеы';
?>