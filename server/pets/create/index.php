<?php
include_once './../../controllers/PetsController.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $petsController = new PetsController();
    $request = json_decode(file_get_contents('php://input'), true);
    $result = $petsController->create($request["name"], $request["cuteness"],
     $request["age"], $request["typeid"], $request["picture"]);
    if ($result == false) {
        http_response_code(400);
    } else {
        http_response_code(200);
    }
} else {
    http_response_code(405);
}