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
        if (!isset($data['buildingNumber']) || !isset($data['buildingCategory'])) {
            return errorResponse("Building name or Category is missing.");
        }

        $result = $this->dormModel->addBuilding($data['buildingNumber'],$data['buildingCategory']);
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

    // Implement methods for apartments and rooms similar to buildings

}

?>
