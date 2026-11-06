<?php
include_once __DIR__ . '/../controllers/TypesController.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $typesController = new TypesController();
    $request = json_decode(file_get_contents('php://input'), true);

    $result = $typesController->update($request["id"], $request["name"]);

    if ($result == false) {
        http_response_code(400);
    } else {
        http_response_code(200);
    }
} else {
    http_response_code(405);
}