<?php

require_once '../models/Database.php';
require_once '../helpers/utilities.php';


class Member {
    private $db;

    public function __construct() {
        try {
            $this->db = new Database();
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Database connection failed. Please try again later.");
        }
    }

    public function login($email, $password) {
        try {
            $sql = "SELECT username, hashedPassword, id FROM account WHERE email = :email";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $member = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($member) {
                if (password_verify($password, $member['password'])) {
                    return successResponse($member['id']);
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
    
    public function createProfile($member) {
        try {
            $conn = $this->db->getConnection();
            $conn->beginTransaction();
    
            $this->insertUserInfo($conn, $member['firstName'], $member['middleName'], $member['lastName'],$member['email'], $member['profilePicture']['name']);
            $accountId = $conn->lastInsertId();
    
            $this->insertMemberInfo($conn, $accountId);
            $memberId = $conn->lastInsertId();
    
            $this->insertPersonalInfo($conn, $memberId, $member['email'], $member['phoneNumber'], $member['birthDate'], $member['gender'], $member['nationality'], $member['govtIssuedId']);
            $this->insertAddressInfo($conn, $memberId, $member['governorate'], $member['city'], $member['street']);
            $this->insertFacultyInfo($conn, $memberId, $member['faculty'], $member['program'], $member['level'], $member['cgpa'], $member['certificateType'], $member['certificateScore']);
            $this->insertParentInfo($conn, $memberId, $member['firstName'], $member['lastName'], $member['phoneNumber'], $member['parentLocation']);
            $this->insertPaymentInfo($conn, $memberId, $member['invoice']['name']);
            $this->insertresidents($conn, $memberId, 120);//Score is replaced with number
    
            $conn->commit();
            return successResponse();
        } catch (PDOException $e) {
            $conn->rollBack();
            logError($e->getMessage());
            return errorResponse("Registration failed. Please try again later.");
        }
    }
    
    function insertUserInfo($conn, $firstName, $middleName, $lastName, $email, $profilePicturePath) {
        try {
            if ($this->isEmailRegistered($conn, $email)) {
                throw new Exception("Email already registered");
            }
    
            $userName = $firstName.' '.$lastName;
            $role = 'member';
            $password = $this->generatePassword();
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $conn->prepare("INSERT INTO account (firstName, middleName, lastName, username, email, hashedPassword, role, profilePicturePath) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bindParam(1, $firstName, PDO::PARAM_STR);
            $stmt->bindParam(2, $middleName, PDO::PARAM_STR);
            $stmt->bindParam(3, $lastName, PDO::PARAM_STR);
            $stmt->bindParam(4, $userName, PDO::PARAM_STR);
            $stmt->bindParam(5, $email, PDO::PARAM_STR);
            $stmt->bindParam(6, $hashedPassword, PDO::PARAM_STR);
            $stmt->bindParam(7, $role, PDO::PARAM_STR);
            $stmt->bindParam(8, $profilePicturePath, PDO::PARAM_STR);
    
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error inserting into account: " . $e->getMessage());
        }
    }
    
    function isEmailRegistered($conn, $email) {
        try {
            $stmt = $conn->prepare("SELECT * FROM account WHERE email = :email");
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result !== false;
        } catch (PDOException $e) {
            logError($e->getMessage());
            throw new Exception("Error checking email: " . $e->getMessage());
        }
    }


function generatePassword($length = 12) {
    $uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $lowercase = 'abcdefghijklmnopqrstuvwxyz';
    $numbers = '0123456789';
    $specialChars = '!@#$%^&*()-_+=<>?';

    // Combine all character sets
    $allChars = $uppercase . $lowercase . $numbers . $specialChars;

    // Ensure the password includes at least one character from each set
    $password = $uppercase[random_int(0, strlen($uppercase) - 1)] .
                $lowercase[random_int(0, strlen($lowercase) - 1)] .
                $numbers[random_int(0, strlen($numbers) - 1)] .
                $specialChars[random_int(0, strlen($specialChars) - 1)];

    // Fill the remaining length with random characters from the combined set
    for ($i = 4; $i < $length; $i++) {
        $password .= $allChars[random_int(0, strlen($allChars) - 1)];
    }

    // Shuffle the password to prevent predictable patterns
    $password = str_shuffle($password);

    return $password;
}



    
    function insertMemberInfo($conn, $accountId) {
        try {
            $stmt = $conn->prepare("INSERT INTO member (accountId) VALUES (?)");
            $stmt->bindParam(1, $accountId, PDO::PARAM_INT);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error inserting into members: " . $e->getMessage());
        }
    }
    
    function insertPersonalInfo($conn, $memberId, $email, $phoneNumber, $birthDate, $gender, $nationality, $govtIssuedId) {
        try {
            $stmt = $conn->prepare("INSERT INTO personalInfo (memberId, universityEmail, phoneNumber, birthDate, gender, nationality, governmentIssuedId) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bindParam(1, $memberId, PDO::PARAM_INT);
            $stmt->bindParam(2, $email, PDO::PARAM_STR);
            $stmt->bindParam(3, $phoneNumber, PDO::PARAM_STR);
            $stmt->bindParam(4, $birthDate, PDO::PARAM_STR); // Assuming birthDate is a string
            $stmt->bindParam(5, $gender, PDO::PARAM_STR);
            $stmt->bindParam(6, $nationality, PDO::PARAM_STR);
            $stmt->bindParam(7, $govtIssuedId, PDO::PARAM_STR);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error inserting into personalInfo: " . $e->getMessage());
        }
    }
    
    function insertAddressInfo($conn, $memberId, $governorate, $city, $street) {
        try {
            $stmt = $conn->prepare("INSERT INTO addressInfo (memberId, governorate, city, street) VALUES (?, ?, ?, ?)");
            $stmt->bindParam(1, $memberId, PDO::PARAM_INT);
            $stmt->bindParam(2, $governorate, PDO::PARAM_STR);
            $stmt->bindParam(3, $city, PDO::PARAM_STR);
            $stmt->bindParam(4, $street, PDO::PARAM_STR);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error inserting into addressInfo: " . $e->getMessage());
        }
    }
    
    function insertFacultyInfo($conn, $memberId, $faculty, $program, $level, $cgpa = null, $certificateType = null, $certificateScore = null) {
        try {
            $stmt = $conn->prepare("INSERT INTO facultyInfo (memberId, faculty, program, level, cgpa, certificateType, certificateScore) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bindParam(1, $memberId, PDO::PARAM_INT);
            $stmt->bindParam(2, $faculty, PDO::PARAM_STR);
            $stmt->bindParam(3, $program, PDO::PARAM_STR);
            $stmt->bindParam(4, $level, PDO::PARAM_STR);
            $stmt->bindParam(5, $cgpa, PDO::PARAM_STR);
            $stmt->bindParam(6, $certificateType, PDO::PARAM_STR);
            $stmt->bindParam(7, $certificateScore, PDO::PARAM_STR);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error inserting into facultyInfo: " . $e->getMessage());
        }
    }
    
    function insertParentInfo($conn, $memberId, $firstName, $lastName, $phoneNumber, $parentLocation ) {
        try {
            $stmt = $conn->prepare("INSERT INTO parentInfo (memberId,  firstName, lastName, phoneNumber, parentLocation) VALUES (?, ?, ?, ?, ?)");
            $stmt->bindParam(1, $memberId, PDO::PARAM_INT);
            $stmt->bindParam(2, $firstName, PDO::PARAM_STR);
            $stmt->bindParam(3, $lastName, PDO::PARAM_STR);
            $stmt->bindParam(4, $phoneNumber, PDO::PARAM_STR);
            $stmt->bindParam(5, $parentLocation, PDO::PARAM_STR);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error inserting into parentInfo: " . $e->getMessage());
        }
    }
    
    function insertPaymentInfo($conn, $memberId, $invoicePath) {
        try {
            $stmt = $conn->prepare("INSERT INTO payments (memberId, invoicePath) VALUES ( ?, ?)");
            $stmt->bindParam(1, $memberId, PDO::PARAM_INT);
            $stmt->bindParam(2, $invoicePath, PDO::PARAM_STR);
 
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error inserting into payments: " . $e->getMessage());
        }
    }
    
    function insertresidents($conn, $memberId, $score) {
        try {
            $stmt = $conn->prepare("INSERT INTO residents (memberId, score) VALUES (?, ?)");
            $stmt->bindParam(1, $memberId, PDO::PARAM_INT);
            $stmt->bindParam(2, $score, PDO::PARAM_STR);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error inserting into residents: " . $e->getMessage());
        }
    }
    
    public function logout() {
        try {
            session_start();
            session_unset();
            session_destroy();
            return successResponse();
        } catch (Exception $e) {
            logError($e->getMessage());
            return errorResponse("Logout failed. Please try again later.");
        }
    }

    public function getAllMembers() {
        try {
            $conn = $this->db->getConnection();
            $sql = "SELECT r.id, r.score, acc.email, acc.username, acc.profilePicturePath, fac.faculty, fac.program, fac.level, rm.number AS roomNumber, ap.number AS apartmentNumber, bul.number AS buildingNumber FROM residents AS r INNER JOIN member AS m ON r.memberId = m.id INNER JOIN account AS acc ON m.accountId = acc.id INNER JOIN facultyinfo AS fac ON m.id = fac.memberId INNER JOIN reservations AS res ON r.id = res.residentId INNER JOIN rooms AS rm ON res.roomId = rm.id INNER JOIN apartments AS ap ON ap.id = rm.apartmentId INNER JOIN buildings AS bul ON bul.id = ap.buildingId";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($results);
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Failed to retrieve members. Please try again later.");
        }
    }

    public function getMemberInfo($memberId) {
        try {
            logError($memberId);
            $conn = $this->db->getConnection();
            $sql = "SELECT r.id AS residentId, a.firstName, a.lastName,a.userName, a.email, a.hashedPassword AS password, a.lastLogin,a.profilePicturePath, pi.gender, r.score, pi.birthDate AS birthdate, ai.governorate, ai.city, ai.street, pi.universityEmail, pi.phoneNumber AS mobileNumber, fi.faculty, fi.program, fi.level, fi.cgpa, fi.certificateType AS certificate, fi.certificateScore, p.firstName AS parentFirstName, p.lastName AS parentLastName, p.phoneNumber AS parentPhone, p.phoneNumber AS parentPhoneNumber, NULL AS additionalInfo FROM residents r JOIN member m ON r.memberId = m.id JOIN account a ON m.accountId = a.id JOIN addressinfo ai ON ai.memberId = m.id JOIN facultyinfo fi ON fi.memberId = m.id JOIN personalinfo pi ON pi.memberId = m.id LEFT JOIN parentinfo p ON p.memberId = m.id WHERE r.id = :residentId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':residentId', $memberId);
            $stmt->execute();
            $results = $stmt->fetch(PDO::FETCH_ASSOC);
            return successResponse($results);
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Failed to retrieve member details. Please try again later.");
        }
    }

    public function getMembersDocs() {
        try {
            $conn = $this->db->getConnection();
            $sql = "SELECT payments.*, account.username, account.profilePicturePath, account.email, member.registrationDate 
                    FROM `payments`
                    INNER JOIN member ON member.id = payments.memberId 
                    INNER JOIN account ON account.id = member.accountId;";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($results);
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Failed to retrieve member details. Please try again later.");
        }
    }
    
    public function updateMemberDocsStatuses($paymentId, $status) {
        try {
            $conn = $this->db->getConnection();
            $sql = "UPDATE payments SET status = :status, housingExpenses = 12000, insurance = 4000 WHERE id = :paymentId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':paymentId', $paymentId);
            $stmt->bindParam(':status', $status);
            $stmt->execute();
            return successResponse();
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Failed to update payment status. Please try again later.");
        }
    }


    public function getExpelledMembers() {
        try {
            $conn = $this->db->getConnection();
            
            // Retrieve all students
            $members = $this->getAllStudents($conn);
            
            // Retrieve all alerts
            $alerts = $this->getAllStudentAlerts($conn);
            
            // Initialize an array to hold members with their alerts
            $membersWithAlerts = array();
            
            // Initialize a map to hold alerts for each student
            $alertsMap = array();
            
            // Map alerts to their respective students
            foreach ($alerts as $alert) {
                $studentId = $alert['universityId']; // Ensure 'studentId' matches your column name
                if (!isset($alertsMap[$studentId])) {
                    $alertsMap[$studentId] = array();
                }
                $alertsMap[$studentId][] = array(
                    'type' => $alert['type'],
                    'date' => $alert['date'],
                    'description' => $alert['description']
                );
            }
            
            // Combine students with their alerts
            foreach ($members as $member) {
                $studentId = $member['universityId']; // Ensure 'studentId' matches your column name
                $memberWithAlerts = $member;
                $memberWithAlerts['alerts'] = isset($alertsMap[$studentId]) ? $alertsMap[$studentId] : array();
                $membersWithAlerts[] = $memberWithAlerts;
            }
            
            return successResponse($membersWithAlerts);
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Failed to retrieve expelled members. Please try again later.");
        }
    }
    
    public function getAllStudents($conn) {
        $studentQuery = "SELECT * FROM expelledmembers";
        $stmt = $conn->query($studentQuery);
        $membersData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        return $membersData;
    }
    

    public function getAllStudentAlerts($conn) {
        $alertQuery = "SELECT * FROM alert 
        LEFT JOIN expelledmembers ON expelledmembers.universityId = alert.universityId
        LEFT JOIN descriptions ON descriptions.id = alert.descriptionId";
        $stmt = $conn->query($alertQuery);
        $alertsData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        return $alertsData;
    }
    
    
    
    
}

?>

