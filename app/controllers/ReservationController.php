<?php

require_once '../models/Reservation.php';
require_once '../helpers/utilities.php';

class ReservationController {
    private $ReservationModel;

    public function __construct() {
        $this->ReservationModel = new ReservationModel();
    }

    public function handleAction($action, $data) {
        switch ($action) {
            case 'reservation/getCriteriaFields':
                return $this->getCriteriaFields();
            case 'reservation/getCriteria':
                return $this->getCriteria();
            case 'reservation/addNewCriteria':
                return $this->addNewCriteria($data);
            case 'reservation/deleteCriteria';
                return $this->deleteCriteria($data);
            default:
                // Unknown action
                return errorResponse('Invalid Action');
        }
    }

    

    public function getCriteriaFields() {
        $result = $this->ReservationModel->getCriteriaFields();
        if ($result['success'] === true) {
            return successResponse($result['data']);
        } else {
            return errorResponse($result['error']);
        }    
    }

    public function getCriteria() {
        $result = $this->ReservationModel->getCriteria();
        if ($result['success'] === true) {
            return successResponse($result['data']);
        } else {
            return errorResponse($result['error']);
        }    
    }

    public function addNewCriteria($data) {
        try {
            $fieldId = $data['fieldId'];
            $criteria = $data['criteria'];
            $criteriaType = $data['type'];
            $weight = $data['weight'];
            $result = $this->ReservationModel->addNewCriteria($fieldId, $criteria, $criteriaType, $weight);
            if ($result['success'] === true) {
                return successResponse();
            } else {
                return errorResponse($result['error']);
            }    
        } catch (Exception $e) {
            logError($e->getMessage());
            return errorResponse("An unexpected error occurred. Please try again later.");
        }
    }

    public function deleteCriteria($data) {
        try {
            $criteriaId = $data['criteriaId'];

            $result = $this->ReservationModel->deleteCriteria($criteriaId);
            if ($result['success'] === true) {
                return successResponse();
            } else {
                return errorResponse($result['error']);
            }    
        } catch (Exception $e) {
            logError($e->getMessage());
            return errorResponse("An unexpected error occurred. Please try again later.");
        }
    }
    

    // public function getReservationInfo($data){
    //     $result = $this->ReservationModel->getReservationInfo($data['ReservationId']);
    //     if ($result['success'] === true) {
    //         return successResponse($result['data']);
    //     } else {
    //         return errorResponse($result['error']);
    //     }    
    // }

}

?>
