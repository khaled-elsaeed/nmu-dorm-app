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
    
}

?>