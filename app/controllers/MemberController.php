<?php

require_once '../models/Member.php';
require_once '../helpers/utilities.php';

class MemberController {
    private $memberModel;

    public function __construct() {
        $this->memberModel = new MemberModel();
    }

    public function handleAction($action, $data) {
        switch ($action) {
            case 'member/login':
                return $this->loginMember($data);
            case 'member/register':
                // return $this->registerMember($data);
            case 'member/logout':
                return $this->logoutMember();
            case 'member/createProfile':
                return $this->createProfile($data);
            default:
                // Unknown action
                return errorResponse('Invalid Action');
        }
    }

    // public function registerMember($data) {
    //     if (empty($data['firstName']) || empty($data['middleName']) || empty($data['lastName'])  || empty($data['email']) || empty($data['password']) || empty($data['role']) ) {

    //         return errorResponse("All information are Required !");
    //     }
    //      else {
    //         $result = $this->memberModel->register($data['firstName'],$data['middleName'],$data['lastName'],$data['email'], $data['password'],$data['role']);
    //         if ($result['success'] === true) {
    //             return successResponse();
    //         } else {
    //             return errorResponse($result['error']);
    //         }
    //     }
    // }

    public function loginMember($data) {
        if (empty($data['email']) || empty($data['password'])) {

            return errorResponse("email and password are required.");
        }
         else {
            $result = $this->memberModel->login($data['email'], $data['password']);
            if ($result['success'] === true) {
                return successResponse($result['data']);
            } else {
                return errorResponse($result['error']);
            }
        }
    }


    public function logoutMember (){
        $result = $this->memberModel->logout();
        if ($result['success'] === true) {
            return successResponse();
        } else {
            return errorResponse($result['error']);
        }    
    }

    public function createProfile($member){
        $result = $this->memberModel->createProfile($member);
        if ($result['success'] === true) {
            return successResponse();
        } else {
            return errorResponse($result['error']);
        }    
    }


}

?>
