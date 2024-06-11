<?php

require_once '../models/Maintenance.php';
require_once('../helpers/utilities.php');

class MaintenanceController {

    public function __construct() {
        $this->maintenanceModel = new MaintenanceModel();
    }
    
    public function handleAction($action, $data) {
        switch ($action) {
            case 'maintenance/getMaintenance':
                return $this->getMaintenance();
            case 'maintenance/start':
                return $this->startMaintenance($data);
            case 'maintenance/reject':
                return $this->rejectMaintenance($data);
            case 'maintenance/complete':
                return $this->completeMaintenance($data);
            default:
                return errorResponse("Unknown action");
        }
    }

    public function getMaintenance (){
        $result = $this->maintenanceModel->fetchMaintenance();
        if ($result['success'] === true) {
            return successResponse($result['data']);
        } else {
            return errorResponse($result['error']);
        }    
    }

    private function startMaintenance($data) {
        if (!isset($data['maintenanceId']) || !isset($data['technician'])) {
            return errorResponse("Maintenance ID or technician is missing.");
        }
        
        $result = $this->maintenanceModel->startMaintenance($data['maintenanceId'], $data['technician']);
        if ($result['success'] === true) {
            return successResponse();
        } else {
            return errorResponse($result['error']);
        }
    }

    private function rejectMaintenance($data) {
        if (!isset($data['maintenanceId']) || !isset($data['description'])) {
            return errorResponse("Maintenance ID or description is missing.");
        }
        
        $result = $this->maintenanceModel->rejectMaintenance($data['maintenanceId'], $data['description']);
        if ($result['success'] === true) {
            return successResponse();
        } else {
            return errorResponse($result['error']);
        }
    }

    private function completeMaintenance($data) {
        if (!isset($data['maintenanceId'])) {
            return errorResponse("Maintenance ID is missing.");
        }
        
        $result = $this->maintenanceModel->completeMaintenance($data['maintenanceId']);
        if ($result['success'] === true) {
            return successResponse();
        } else {
            return errorResponse($result['error']);
        }
    }
}

?>
