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
                return $this->getApartments();
            case 'dorm/addApartment':
                return $this->addApartment($data);
            case 'dorm/removeApartment':
                return $this->removeApartment($data);
            case 'dorm/getRooms':
                return $this->getRooms();
            case 'dorm/addRoom':
                return $this->addRoom($data);
            case 'dorm/removeRoom':
                return $this->removeRoom($data);
            default:
                return errorResponse("Unknown action");
        }
    }

    private function getBuildings() {
        return $this->processResult($this->dormModel->fetchBuildings());
    }

    private function addBuilding($data) {
        if ($this->isMissingKeys($data, ['buildingNumber', 'buildingCategory', 'buildingMaxApartmentCapacity'])) {
            return errorResponse("Building number, category, or maximum apartment capacity is missing.");
        }
        return $this->processResult($this->dormModel->addBuilding($data['buildingNumber'], $data['buildingCategory'], $data['buildingMaxApartmentCapacity']));
    }

    private function removeBuilding($data) {
        if ($this->isMissingKeys($data, ['buildingId'])) {
            return errorResponse("Building ID is missing.");
        }
        return $this->processResult($this->dormModel->removeBuilding($data['buildingId']));
    }

    private function getApartments() {
        return $this->processResult($this->dormModel->fetchApartments());
    }

    private function addApartment($data) {
        if ($this->isMissingKeys($data, ['apartmentNumber', 'buildingId'])) {
            return errorResponse("Apartment number or building ID is missing.");
        }
        return $this->processResult($this->dormModel->addApartment($data['apartmentNumber'], $data['buildingId']));
    }

    private function removeApartment($data) {
        if ($this->isMissingKeys($data, ['apartmentId'])) {
            return errorResponse("Apartment ID is missing.");
        }
        return $this->processResult($this->dormModel->removeApartment($data['apartmentId']));
    }

    private function getRooms() {
        return $this->processResult($this->dormModel->fetchRooms());
    }

    private function addRoom($data) {
        if ($this->isMissingKeys($data, ['roomNumber', 'apartmentId'])) {
            return errorResponse("Room number or apartment ID is missing.");
        }
        return $this->processResult($this->dormModel->addRoom($data['roomNumber'], $data['apartmentId'])); 
    }

    private function removeRoom($data) {
        if ($this->isMissingKeys($data, ['roomId'])) {
            return errorResponse("Room ID is missing.");
        }
        return $this->processResult($this->dormModel->removeRoom($data['roomId']));
    }

    private function isMissingKeys($data, $keys) {
        foreach ($keys as $key) {
            if (!isset($data[$key])) {
                return true;
            }
        }
        return false;
    }

    private function processResult($result) {
        if ($result['success'] === true) {
            return successResponse($result['data'] ?? null);
        } else {
            return errorResponse($result['error']);
        }
    }
}
?>
