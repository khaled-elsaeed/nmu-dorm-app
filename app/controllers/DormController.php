<?php

require_once '../models/Dorm.php';
require_once('../helpers/utilities.php');

class DormController {

    public function __construct() {
        $this->dormModel = new DormModel();
    }

    public function handleAction($action, $data) {
        switch ($action) {
            case 'dorm/getBuildings':
                return $this->getBuildings();
            case 'dorm/addBuilding':
                return $this->addBuilding($data);
            case 'dorm/removeBuilding':
                return $this->removeBuilding($data);
            case 'dorm/getApartments':
                return $this->getApartments($data);
            case 'dorm/addApartment':
                return $this->addApartment($data);
            case 'dorm/removeApartment':
                return $this->removeApartment($data);
            case 'dorm/getRooms':
                return $this->getRooms($data);
            case 'dorm/addRoom':
                return $this->addRoom($data);
            case 'dorm/removeRoom':
                return $this->removeRoom($data);
            default:
                return errorResponse("Unknown action");
        }
    }

    public function getBuildings() {
        $result = $this->dormModel->fetchBuildings();
        if ($result['success'] === true) {
            return successResponse($result['data']);
        } else {
            return errorResponse($result['error']);
        }
    }

    public function addBuilding($data) {
        if (!isset($data['buildingNumber']) || !isset($data['buildingCategory']) || !isset($data['buildingMaxApartmentCapacity'])) {
            return errorResponse("Building name or Category or apartment Capicity is missing.");
        }

        $result = $this->dormModel->addBuilding($data['buildingNumber'],$data['buildingCategory'],$data['buildingMaxApartmentCapacity']);
        if ($result['success'] === true) {
            return successResponse();
        } else {
            return errorResponse($result['error']);
        }
    }

    public function removeBuilding($data) {
        
        if (!isset($data['buildingId'])) {
            return errorResponse("Building ID is missing.");
        }

        $result = $this->dormModel->removeBuilding($data['buildingId']);

        if ($result['success'] === true) {
            return successResponse();
        } else {
            return errorResponse($result['error']);
        }
    }

    public function getApartments() {
        $result = $this->dormModel->fetchApartments();
        if ($result['success'] === true) {
            return successResponse($result['data']);
        } else {
            return errorResponse($result['error']);
        }
    }

    public function removeApartment($data) {
        
        if (!isset($data['apartmentId'])) {
            return errorResponse("Apartment ID is missing.");
        }

        $result = $this->dormModel->removeApartment($data['apartmentId']);

        if ($result['success'] === true) {
            return successResponse();
        } else {
            return errorResponse($result['error']);
        }
    }

    public function addApartment($data) {
        if (!isset($data['apartmentNumber'])  || !isset($data['buildingId'])) {
            return errorResponse("apartment name  or apartment building is missing.");
        }

        $result = $this->dormModel->addapartment($data['apartmentNumber'],$data['buildingId']);
        if ($result['success'] === true) {
            return successResponse();
        } else {
            return errorResponse($result['error']);
        }
    }

    public function getRooms() {
        $result = $this->dormModel->fetchRooms();
        if ($result['success'] === true) {
            return successResponse($result['data']);
        } else {
            return errorResponse($result['error']);
        }
    }

}

?>
