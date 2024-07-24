<?php

require_once '../models/Database.php';
require_once '../helpers/utilities.php';

class ReservationModel {
    private $db;

    public function __construct() {
        try {
            $this->db = new Database();
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Failed to connect to the database. Please try again later.");
        }
    }

    public function getCriteriaFields(){
        try {
            $sql = "SELECT * FROM criteriafields";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $criteriafields = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($criteriafields);
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while fetching criteriafields data. Please try again later.");
        }
    }

    public function getCriteria(){
        try {
            $sql = "SELECT * FROM criteria";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $criteriafields = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($criteriafields);
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while fetching getCriteria data. Please try again later.");
        }
    }

    public function addNewCriteria($fieldId, $criteria, $criteriaType, $weight) {
        try {
            $sql = "INSERT INTO criteria (fieldId, criteria, criteriaType, weight) VALUES (:fieldId, :criteria, :criteriaType, :weight)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':fieldId', $fieldId, PDO::PARAM_INT);
            $stmt->bindParam(':criteria', $criteria, PDO::PARAM_STR);
            $stmt->bindParam(':criteriaType', $criteriaType, PDO::PARAM_STR);
            $stmt->bindParam(':weight', $weight, PDO::PARAM_INT);
            $stmt->execute();
            return successResponse();
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while adding the new criteria. Please try again later.");
        }
    }

    public function deleteCriteria($criteriaId) {
        try {
            $sql = "DELETE FROM criteria WHERE id = :criteriaId";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':criteriaId', $criteriaId, PDO::PARAM_INT);
            $stmt->execute();
            return successResponse();
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while adding the new criteria. Please try again later.");
        }
    }

    public function getReservations(){
        try {
            $sql = "SELECT * , residents.score FROM reservations INNER JOIN residents ON residents.id = reservations.residentId";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $criteriafields = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($criteriafields);
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while fetching getCriteria data. Please try again later.");
        }
    }

    public function reservationProcess() {
        // Retrieve IDs of available rooms and residents
        $vacantRoomIds = $this->getAvailableRoomIds();
        $vacantResidentIds = $this->getVacantResidentIds();
    
        if (empty($vacantRoomIds) || empty($vacantResidentIds)) {
            // No available rooms or residents to process
            return errorResponse("No available rooms or residents to process.");
        }
    
        $reservations = [];
    
        // Match rooms to residents and prepare reservations data
        foreach ($vacantResidentIds as $index => $residentId) {
            if (isset($vacantRoomIds[$index])) {
                $roomId = $vacantRoomIds[$index];
                $reservations[] = [
                    'residentId' => $residentId,
                    'roomId' => $roomId,
                ];
            } else {
                return errorResponse("No more available rooms for resident with ID " . $residentId);
            }
        }
    
        // Insert reservations into the database and update statuses
        $result = $this->insertReservationsIntoDb($reservations);
        if ($result) {
            $statusUpdateResult = $this->updateOccupancyStatus($reservations);
            if ($statusUpdateResult) {
                return successResponse("Reservations have been successfully processed and statuses updated.");
            } else {
                return errorResponse("Reservations inserted, but failed to update statuses.");
            }
        } else {
            return errorResponse("An error occurred while inserting reservations.");
        }
    }
    
    private function getAvailableRoomIds() {
        try {
            $sql = 'SELECT id FROM rooms WHERE occupiedStatus = 0 ORDER BY number ASC';
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $vacantRooms = $stmt->fetchAll(PDO::FETCH_COLUMN, 0); // Fetch only IDs
            return $vacantRooms;
        } catch (PDOException $e) {
            logError($e->getMessage());
            return []; // Return empty array or handle error appropriately
        }
    }
    
    private function getVacantResidentIds() {
        try {
            $sql = 'SELECT id FROM residents WHERE occupancyStatus = "vacant" ORDER BY score DESC;';
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $vacantResidents = $stmt->fetchAll(PDO::FETCH_COLUMN, 0); // Fetch only IDs
            return $vacantResidents;
        } catch (PDOException $e) {
            logError($e->getMessage());
            return []; // Return empty array or handle error appropriately
        }
    }
    
    private function insertReservationsIntoDb($reservations) {
        try {
            $sql = "INSERT INTO reservations (residentId, roomId) VALUES (?, ?)";
            $stmt = $this->db->prepare($sql);
    
            foreach ($reservations as $reservation) {
                $stmt->execute([
                    $reservation['residentId'],
                    $reservation['roomId'],
                ]);
            }
            return true; // Return true to indicate success
        } catch (PDOException $e) {
            logError($e->getMessage());
            return false; // Return false to indicate failure
        }
    }
    
    private function updateOccupancyStatus($reservations) {
        try {
            // Begin transaction
            $this->db->beginTransaction();
    
            // Update resident status
            $residentSql = 'UPDATE residents SET occupancyStatus = "occupied" WHERE id = ?';
            $residentStmt = $this->db->prepare($residentSql);
    
            // Update room status
            $roomSql = 'UPDATE rooms SET occupiedStatus = 1 WHERE id = ?';
            $roomStmt = $this->db->prepare($roomSql);
    
            foreach ($reservations as $reservation) {
                // Update resident status
                $residentStmt->execute([$reservation['residentId']]);
                // Update room status
                $roomStmt->execute([$reservation['roomId']]);
            }
    
            // Commit transaction
            $this->db->commit();
            return true; // Return true to indicate success
        } catch (PDOException $e) {
            // Rollback transaction on error
            $this->db->rollBack();
            logError($e->getMessage());
            return false; // Return false to indicate failure
        }
    }
    


    
}

?>