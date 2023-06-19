<?php

class Tools{
    function db_connection(){
        $host = 'localhost';
        $user = 'root';
        $password = '';
        $db = 'icdel_db';
        $conn = new mysqli($host, $user, $password, $db);
        return $conn;
    }

    function base_query($request){
        $result = array();
        $c = $this->db_connection();
        $resp = $c->query($request);
        while($row = $resp->fetch_object()){
            array_push($result, $row);
        }
        return $result;
    }

    function db_query($request){
        $result = array();
        $c = $this->db_connection();
        $resp = $c->query($request);
        $record_id = 0;
        if($resp){
            $record_id = $c->insert_id;
        }
        return $record_id;
    }

    function get_autorization($args){
        $username = $args['loginauth'];
        $password = $args['passwordauth'];
        $passwordtw = md5($password);
        // Запрос на проверку введенных данных
        $sql = "SELECT users.id AS userid FROM users WHERE nickname = '{$username}' AND password = '{$passwordtw}'";
        try{
            $data = $this->base_query($sql);
            $result = $data[0]->userid;
            return $result;
        }
        catch(Exception $ex){
            return -1;
        }       
        

    }
    function test(){
        return 'ajax works';
    }
    function get_all_books(){
        $sql = "
        SELECT b.id, b.title, b.discription, g.genre_title
        FROM books b, genres g, relation_books_genres rgb
        WHERE b.id=rgb.book_id AND g.id=rgb.genre_id ";
        $result = $this->base_query($sql);
        return json_encode($result);
    }
    function get_genres(){
        $sql = "
        SELECT a.*
        FROM genres a";
        $result = $this->base_query($sql);
        return json_encode($result);
    }

    function get_books_by_genre($genre_id){
        $sql = "
        SELECT b.* 
        FROM books b 
        INNER JOIN relation_books_genres r 
        ON r.book_id = b.id 
        WHERE r.genre_id = ".$genre_id."";

        try{
            $result = $this->base_query($sql);
            return json_encode($result);
        }
        catch(Exception $ex){
            return -1;
        }        
    }

    function set_new_book($args = array()){
        $title = $args['title'];
        $description = $args['description'];
        $genre_id = (int)$args['genre_id'];
        $user_id = (int)$args['user_id'];
        $sql = "INSERT INTO `books`(`title`, `discription`, `id_users`)
        VALUES ('".$title."','".$description."',".$user_id.")";

        try{
            $result = $this->db_query($sql);
            $sql2 = "INSERT INTO `relation_books_genres`(`book_id`, `genre_id`) 
            VALUES (".$result.",".$genre_id.")";
            $out = $this->db_query($sql2);

            return $out;
        }
        catch(Exception $ex){
            return -1;
        } 
    }
    // function get_books_by_author($lastname){
    //     $sql = "
    //         SELECT
    //         CONCAT(au.lastname, ' ', au.firstname) AS fio, b.title
    //         FROM books b, relations_books_authors rel
    //         JOIN authors au 
    //         ON rel.author_id = au.id 
    //         WHERE rel.book_id = b.id 
    //         AND au.lastname = '".$lastname."'";
    //     $result = $this->base_query($sql);
    //     return json_encode($result);
    // }
    // function get_books_by_book($title){
    //     $sql = "
    //         SELECT
    //         CONCAT(au.lastname, ' ', au.firstname) AS fio, b.title
    //         FROM books b, relations_books_authors rel
    //         JOIN authors au 
    //         ON rel.author_id = au.id 
    //         WHERE rel.book_id = b.id 
    //         AND b.title LIKE '%".$title."%'";
    //     $result = $this->base_query($sql);
    //     return json_encode($result);
    // }
    // function get_authors(){
    //     $sql = "
    //     SELECT a.*
    //     FROM authors a
    //     ";
    //     $result = $this->base_query($sql);
    //     return json_encode($result);
    // }
    // function get_publishings(){
    //     $sql = "
    //     SELECT p.*
    //     FROM publishings p
    //     ";
    //     $result = $this->base_query($sql);
    //     return json_encode($result);
    // }
    // function get_sections(){
    //     $sql = "
    //     SELECT s.*
    //     FROM sections s
    //     ";
    //     try{
    //     $result = $this->base_query($sql);
    //     return json_encode($result);
    //     }
    //     catch(Exception $ex){
    //         return -1;
    //     }
    // } 
    // function set_author($args=array()){
    //     $firstname = $_POST['firstname'];
    //     $lastname = $_POST['lastname'];
    //     $patronymic = $_POST['patronymic'];
    //     $birth = $_POST['birth'];
    //     $death = $_POST['death'];
    //     $sql = "
    //     INSERT INTO authors(firstname, lastname, patronymic, birth, death)
    //     VALUES('".$firstname."','".$lastname."','".$patronymic."','".$birth."','".$death."')
    //     ";
    //     try{
    //     $result = $this->base_query($sql);
    //     return $result;
    //     }
    //     catch(Exception $ex){
    //         return -1;
    //     }
    // }
}

?>