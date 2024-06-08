<?php
// AdminModel.php

require_once '../models/Database.php';
require_once '../helpers/utilities.php';


class AdminModel {
    private $db;

    public function __construct() {
        try {
            $this->db = new Database();
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Database connection failed. Please try again later.");
        }
    }

    public function register($username, $email, $password) {
        try {
            // if ($this->isUsernameTaken($username)) {
            //     return errorResponse("Username already taken");
            // }

            if ($this->isEmailRegistered($email)) {
                return errorResponse("Email already registered");
            }

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $sql = "INSERT INTO users (firstName,lastName, email, password) VALUES (?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param("sss", $username, $email, $hashedPassword);

            if ($stmt->execute()) {
                return true; 
            } else {
                return errorResponse("Registration failed: " . $stmt->error);
            }
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Registration failed. Please try again later.");
        }
    }

    // private function isUsernameTaken($username) {
    //     try {
    //         $sql = "SELECT * FROM admins WHERE username = ?";
    //         $stmt = $this->db->prepare($sql);
    //         $stmt->bind_param("s", $username);
    //         $stmt->execute();
    //         $result = $stmt->fetch(PDO::FETCH_ASSOC);
    //         return $result->num_rows > 0;
    //     } catch (PDOException $e) {
    //         logError($e->getMessage());
    //         return true;
    //     }
    // }

    private function isEmailRegistered($email) {
        try {
            $sql = "SELECT * FROM admins WHERE email = :email";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result->num_rows > 0;
        } catch (PDOException $e) {
            logError($e->getMessage());
            return true;
        }
    }

    public function login($email, $password) {
        try {
            $sql = "SELECT username, password, Id FROM users WHERE email = :email";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($admin) {
                if (password_verify($password, $admin['password'])) {
                    return successResponse($admin['Id']);
                } else {
                    return errorResponse("Email or Password is Wrong.");
                }
            } else {
                return errorResponse("Email or Password is Wrong.");
            }
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Database error. Please try again later.");
        }
    }
    
    
}
?>
