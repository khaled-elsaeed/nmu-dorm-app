<?php

require_once '../models/Resident.php';
require_once '../helpers/utilities.php';

class ResidentController {
    private $residentModel;

    public function __construct() {
        $this->residentModel = new ResidentModel();
    }

    public function handleAction($action, $data) {
        switch ($action) {
            case 'resident/login':
                return $this->loginResident($data);
            case 'resident/register':
                return $this->registerResident($data);
            case 'resident/logout':
                return $this->logoutResident();
            case 'resident/createAccount':
                return $this->CreateAccount();
            default:
                // Unknown action
                return errorResponse('Invalid Action');
        }
    }

    public function registerResident($data) {
        if (empty($data['firstName']) || empty($data['middleName']) || empty($data['lastName'])  || empty($data['email']) || empty($data['password']) || empty($data['role']) ) {

            return errorResponse("All information are Required !");
        }
         else {
            $result = $this->residentModel->register($data['firstName'],$data['middleName'],$data['lastName'],$data['email'], $data['password'],$data['role']);
            if ($result['success'] === true) {
                return successResponse();
            } else {
                return errorResponse($result['error']);
            }
        }
    }

    public function loginResident($data) {
        if (empty($data['email']) || empty($data['password'])) {

            return errorResponse("email and password are required.");
        }
         else {
            $result = $this->residentModel->login($data['email'], $data['password']);
            if ($result['success'] === true) {
                return successResponse($result['data']);
            } else {
                return errorResponse($result['error']);
            }
        }
    }


    public function logoutResident (){
        $result = $this->residentModel->logout();
        if ($result['success'] === true) {
            return successResponse();
        } else {
            return errorResponse($result['error']);
        }    
    }

    public function CreateAccount(){
        return errorResponse("khaleddd");
    }

}

?>
