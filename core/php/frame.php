<?php
session_start(); // Начало сессии

include 'connect.php';

$sql = "SELECT b.id, b.title, b.discription, g.genre_title
        FROM books b, genres g, relation_books_genres rgb
        WHERE b.id=rgb.book_id AND g.id=rgb.genre_id";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    echo "<table>"; // Открываем тег таблицы

    // Выводим заголовки таблицы
    echo "<thead>";
    echo "<tr>";
    echo "<th>Колонка 1</th>";
    echo "<th>Колонка 2</th>";
    echo "<th>Колонка 3</th>";
    echo "</tr>";
    echo "</thead>";

    echo "<tbody>"; // Открываем тег tbody

    // Выводим данные в формате HTML
    while ($row = mysqli_fetch_assoc($result)) {

    }

    echo "</tbody>"; // Закрываем тег tbody
    echo "</table>"; // Закрываем тег таблицы
} else {
    echo "Нет данных";
}

$conn->close(); // Закрытие соединения
?>