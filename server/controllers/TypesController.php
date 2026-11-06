<?php
include_once __DIR__ . '/../db/conn.php';
include_once __DIR__ . '/../models/Type.php';
class TypesController {
    public $conn;
    public function __construct() {
        $this->conn = $GLOBALS['conn'];
    }
    public function get($id)
    {
        $sql = "SELECT * FROM pet_types WHERE id = " . $id . ";";
        $result = $this->conn->query($sql);
        $type = null;
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $type = new Type($row["id"], $row["name"]);
                break;
            }
        }
        return $type;
    }
    public function getAll()
    {
        $sql = "SELECT * FROM pet_types;";
        $result = $this->conn->query($sql);
        $types = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $type = new Type($row["id"], $row["name"]);
                array_push($types, $type);
            }
        }
        return $types;
    }
    public function create($name)
    {
        $sql = "INSERT INTO pet_types (name) VALUES ('" . $name . "');";
        if ($this->conn->query($sql) === TRUE) {
            return true;
        } else {
            return false;
        }
    }
    public function update($id, $name)
    {
        $sql = "UPDATE pet_types SET name='" . $name . "' WHERE id=" . $id . ";";
        if ($this->conn->query($sql) === TRUE) {
            return true;
        } else {
            return false;
        }
    }
    public function delete($id)
    {
        $sql = "DELETE FROM pet_types WHERE id=" . $id . ";";
        if ($this->conn->query($sql) === TRUE) {
            return true;
        } else {
            return false;
        }
    }
}