<?php

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

    public function register($firstName,$middleName,$lastName,$email, $password,$role) {
        try {

            if ($this->isEmailRegistered($email)) {
                return errorResponse("Email already registered");
            }

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $sql = "INSERT INTO users (firstName, middleName, lastName, userName, email, password, role) 
            VALUES (:firstName, :middleName, :lastName, :userName, :email, :password, :role)
            ";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':firstName', $firstName, PDO::PARAM_STR);
            $stmt->bindParam(':middleName', $middleName, PDO::PARAM_STR);
            $stmt->bindParam(':lastName', $lastName, PDO::PARAM_STR);
            $userName = $firstName . ' ' . $lastName;
            $stmt->bindParam(':userName', $userName, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
            $stmt->bindParam(':role', $role, PDO::PARAM_STR);
            if ($stmt->execute()) {
                return successResponse(); 
            } else {
                return errorResponse("Registration failed, Please try again later. ");
            }
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Registration failed. Please try again later.");
        }
    }


    private function isEmailRegistered($email) {
        try {
            $sql = "SELECT * FROM users WHERE email = :email";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            // Check if any row is returned
            return $result !== false;
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

    public function logout (){
        try{
            session_start();
            session_unset();
            session_destroy();
            return successResponse();
        } catch (PDOException $e){
            logError($e->getMessage());
            return errorResponse("Database error. Please try again later.");
        }
        
    }
    
    
}
?>
