<?php
session_start(); // Начало сессии

include 'connect.php';

$sql = "SELECT b.id, b.title, b.discription, g.genre_title
        FROM books b, genres g, relation_books_genres rgb
        WHERE b.id=rgb.book_id AND g.id=rgb.genre_id";
$result = mysqli_query($conn, $sql);



$conn->close(); // Закрытие соединения
?>