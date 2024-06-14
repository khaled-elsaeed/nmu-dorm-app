<?php

require_once '../models/Database.php';
require_once '../helpers/utilities.php';

class MaintenanceModel {
    private $db;

    public function __construct() {
        try {
            $this->db = new Database();
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Failed to connect to the database. Please try again later.");
        }
    }

    public function fetchMaintenance() {
        try {
            $sql = "SELECT m.id, m.residentId, u.username AS residentName, m.equipment, d.description, m.requestDate, m.technician, m.completeDate, m.status 
                    FROM maintenance m
                    LEFT JOIN descriptions d ON m.descriptionId = d.id
                    LEFT JOIN residents r ON m.residentId = r.id
                    LEFT JOIN members ON members.Id = r.MemberId
                    LEFT JOIN users u ON members.UserId = u.id"; // Joining with users table to get member name
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $maintenanceData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($maintenanceData);
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while fetching maintenance data. Please try again later.");
        }
    }
    
    
    

    public function startMaintenance($maintenanceId, $technician) {
        try {
            $sql = "UPDATE maintenance SET status = 'inProgress', technician = :technician WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':technician', $technician);
            $stmt->bindParam(':id', $maintenanceId);
            $stmt->execute();
            return successResponse();
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while starting maintenance. Please try again later.");
        }
    }

    public function rejectMaintenance($maintenanceId) {
        try {
            $sql = "UPDATE maintenance SET status = 'rejected' WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $maintenanceId);
            $stmt->execute();
            return successResponse("Maintenance rejected successfully.");
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while rejecting maintenance. Please try again later.");
        }
    }

    public function completeMaintenance($maintenanceId) {
        try {
            $currentDateTime = date('Y-m-d H:i:s');
    
            $sql = "UPDATE maintenance SET status = 'complete', completeDate = :completeDateTime WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':completeDateTime', $currentDateTime);
            $stmt->bindParam(':id', $maintenanceId);
            $stmt->execute();
            return successResponse("Maintenance completed successfully.");
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while completing maintenance. Please try again later.");
        }
    }
    
}

?>
