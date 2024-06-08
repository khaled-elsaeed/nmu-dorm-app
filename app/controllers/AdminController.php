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
            default:
                // Unknown action
                return errorResponse('Invalid Action');
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

}

?>
