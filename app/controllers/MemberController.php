<?php

require_once '../models/Member.php';
require_once '../helpers/utilities.php';

class MemberController {
    private $memberModel;

    public function __construct() {
        $this->memberModel = new Member(); // Assuming class name is Member
    }

    public function handleAction($action, $data) {
        switch ($action) {
            case 'member/login':
                return $this->loginMember($data);
            case 'member/register':
                // Uncomment if you want to use this method
                // return $this->registerMember($data);
            case 'member/logout':
                return $this->logoutMember();
            case 'member/createProfile':
                return $this->createProfile($data);
            case 'member/getAllMembers':
                return $this->getAllMembers();
            case 'member/getMemberInfo':
                return $this->getMemberInfo($data);
            case 'member/getMembersDocs':
                return $this->getMembersDocs();
            case 'member/updateMemberDocsStatus':
                return $this->updateMemberDocsStatuses($data);
            default:
                // Unknown action
                return errorResponse('Invalid Action');
        }
    }

    // Uncomment if you want to use this method
    // public function registerMember($data) {
    //     if (empty($data['firstName']) || empty($data['middleName']) || empty($data['lastName'])  || empty($data['email']) || empty($data['password']) || empty($data['role']) ) {
    //         return errorResponse("All information is required!");
    //     } else {
    //         $result = $this->memberModel->register($data['firstName'], $data['middleName'], $data['lastName'], $data['email'], $data['password'], $data['role']);
    //         if ($result['success'] === true) {
    //             return successResponse();
    //         } else {
    //             return errorResponse($result['error']);
    //         }
    //     }
    // }

    public function loginMember($data) {
        if (empty($data['email']) || empty($data['password'])) {
            return errorResponse("Email and password are required.");
        } else {
            $result = $this->memberModel->login($data['email'], $data['password']);
            return $result['success'] ? successResponse($result['data']) : errorResponse($result['error']);
        }
    }

    public function logoutMember() {
        $result = $this->memberModel->logout();
        return $result['success'] ? successResponse() : errorResponse($result['error']);
    }

    public function createProfile($data) {
        $result = $this->memberModel->createProfile($data);
        return $result['success'] ? successResponse() : errorResponse($result['error']);
    }

    public function getAllMembers() {
        $result = $this->memberModel->getAllMembers();
        return $result['success'] ? successResponse($result['data']) : errorResponse($result['error']);
    }

    public function getMemberInfo($data) {
        if (empty($data['memberId'])) {
            return errorResponse("Member ID is required.");
        }
        $result = $this->memberModel->getMemberInfo($data['memberId']);
        return $result['success'] ? successResponse($result['data']) : errorResponse($result['error']);
    }

    public function getMembersDocs() {
        $result = $this->memberModel->getMembersDocs();
        return $result['success'] ? successResponse($result['data']) : errorResponse($result['error']);
    }

    public function updateMemberDocsStatuses($data) {
        if (empty($data['paymentId']) || empty($data['status'])) {
            return errorResponse("Payment ID and status are required.");
        }
        $result = $this->memberModel->updateMemberDocsStatuses($data['paymentId'], $data['status']);
        return $result['success'] ? successResponse() : errorResponse($result['error']);
    }
}

?>
