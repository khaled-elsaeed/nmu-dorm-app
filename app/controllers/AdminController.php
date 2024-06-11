<?php

require_once '../models/Admin.php';
require_once '../helpers/utilities.php';

class AdminController {
    private $adminModel;

    public function __construct() {
        $this->adminModel = new AdminModel();
    }

    public function handleAction($action, $data) {
        switch ($action) {
            case 'admin/login':
                return $this->loginAdmin($data);
            case 'admin/register':
                return $this->registerAdmin($data);
            case 'admin/logout':
                return $this->logoutAdmin();
            default:
                // Unknown action
                return errorResponse('Invalid Action');
        }
    }

    public function registerAdmin($data) {
        if (empty($data['firstName']) || empty($data['middleName']) || empty($data['lastName'])  || empty($data['email']) || empty($data['password']) || empty($data['role']) ) {

            return errorResponse("All information are Required !");
        }
         else {
            $result = $this->adminModel->register($data['firstName'],$data['middleName'],$data['lastName'],$data['email'], $data['password'],$data['role']);
            if ($result['success'] === true) {
                return successResponse();
            } else {
                return errorResponse($result['error']);
            }
        }
    }

    public function loginAdmin($data) {
        if (empty($data['email']) || empty($data['password'])) {

            return errorResponse("email and password are required.");
        }
         else {
            $result = $this->adminModel->login($data['email'], $data['password']);
            if ($result['success'] === true) {
                return successResponse($result['data']);
            } else {
                return errorResponse($result['error']);
            }
        }
    }


    public function logoutAdmin (){
        $result = $this->adminModel->logout();
        if ($result['success'] === true) {
            return successResponse();
        } else {
            return errorResponse($result['error']);
        }    
    }

}

?>
