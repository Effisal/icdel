<?php
   // header('Content-Type: application/json');
 /*    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
         */

         
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");

    require_once('tools.php');
    if (isset($_POST['method'])){
        $method = $_POST['method'];
        $args = $_POST['args'];
        $tools = new Tools();
        $ajax = $tools->$method($args);
        echo $ajax;
    }
    // $_POST 
?>