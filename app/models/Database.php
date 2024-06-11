<?php

require_once('../config/database.php');

class Database {

    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $conn;

    public function __construct() {
        try {
            $this->conn = new PDO("mysql:host={$this->host};dbname={$this->db_name}", $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    public function getConnection() {
        return $this->conn;
    }

    public function prepare($sql) {
        return $this->conn->prepare($sql);
    }

    public function beginTransaction() {
        return $this->conn->beginTransaction();
    }

    public function commit() {
        return $this->conn->commit();
    }

    public function rollback() {
        return $this->conn->rollback();
    }

    public function executeTransaction($queries) {
        try {
            $this->beginTransaction();

            foreach ($queries as $query) {
                $stmt = $this->prepare($query['sql']);
                $stmt->execute($query['params']);
            }

            $this->commit();
            return true;
        } catch (PDOException $e) {
            $this->rollback();
            echo "Transaction failed: " . $e->getMessage();
            return false;
        }
    }
}
?>
