<?php

require_once('../helpers/utilities.php');

// Autoload models
spl_autoload_register(function ($class) {
    require_once '../controllers/' . $class . '.php';
});

// Function to decode base64 encoded hash
function decodeHash($hash) {
    return base64_decode($hash);
}

// Function to extract entity from the action string
function extractEntityFromAction($actionString) {
    $parts = explode('/', $actionString);
    return count($parts) === 2 ? $parts[0] : null;
}

// Function to get the action based on the hashed value
function getActionFromHash($hashedAction) {
    $actions = [
        hash('sha256', 'dorm/getBuildings') => 'dorm/getBuildings',
        hash('sha256', 'dorm/removeBuilding') => 'dorm/removeBuilding',
        hash('sha256', 'dorm/addBuilding') => 'dorm/addBuilding',
        hash('sha256', 'dorm/getApartments') => 'dorm/getApartments',
        hash('sha256', 'dorm/removeApartment') => 'dorm/removeApartment',
        hash('sha256', 'dorm/addApartment') => 'dorm/addApartment',
        hash('sha256', 'dorm/getRooms') => 'dorm/getRooms',
        hash('sha256', 'dorm/addRoom') => 'dorm/addRoom',
        hash('sha256', 'dorm/removeRoom') => 'dorm/removeRoom',
        hash('sha256', 'member/createProfile') => 'member/createProfile',
        hash('sha256', 'member/getAllMembers') => 'member/getAllMembers',
        hash('sha256', 'member/getMemberInfo') => 'member/getMemberInfo',
        hash('sha256', 'member/getMembersDocs') => 'member/getMembersDocs',
        hash('sha256', 'member/updateMemberDocsStatus') => 'member/updateMemberDocsStatus',



        hash('sha256', 'reservation/getCriteriaFields') => 'reservation/getCriteriaFields',
        hash('sha256', 'reservation/getCriteria') => 'reservation/getCriteria',
        hash('sha256', 'reservation/addNewCriteria') => 'reservation/addNewCriteria',
        hash('sha256', 'reservation/deleteCriteria') => 'reservation/deleteCriteria',
        hash('sha256', 'reservation/getReservations') => 'reservation/getReservations',
        hash('sha256', 'reservation/reservationProcess') => 'reservation/reservationProcess',
        hash('sha256', 'room/create') => 'room/create',
        hash('sha256', 'room/delete') => 'room/delete',
        hash('sha256', 'maintenance/getMaintenance') => 'maintenance/getMaintenance',
        hash('sha256', 'maintenance/start') => 'maintenance/start',
        hash('sha256', 'maintenance/reject') => 'maintenance/reject',
        hash('sha256', 'maintenance/complete') => 'maintenance/complete',
        hash('sha256', 'admin/login') => 'admin/login',
        hash('sha256', 'admin/register') => 'admin/register',
        hash('sha256', 'admin/logout') => 'admin/logout',
    ];

    $decodedHash = decodeHash($hashedAction);
    return $actions[$decodedHash] ?? 'Unknown action';
}

// Function to handle service result and return JSON response
function handleServiceResult($result) {
    if (!is_array($result) && !is_object($result)) {
        $result = array('result' => $result);
    }
    header('Content-Type: application/json');
    echo json_encode($result);
}

// Function to handle file input
function handleFileInput($inputName, &$data) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES[$inputName]) && $_FILES[$inputName]['error'] === 0) {
        $targetDir = "../storage/uploads/";

        // Create the uploads directory if it doesn't exist
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        // Extract the file extension from the original file name
        $fileExtension = pathinfo($_FILES[$inputName]['name'], PATHINFO_EXTENSION);

        // Generate a new file name
        if ($inputName === 'profilePicture') {
            $newFileName = $data['lastName'] . '_' . $data['studentId'] . '.' . $fileExtension;
        } else if ($inputName === 'invoice') {
            $newFileName = $data['lastName'] . '_' . $data['studentId'] . '_invoice.' . $fileExtension;
        } else {
            // Handle unexpected input names
            echo "Unexpected file input: $inputName";
            exit;
        }

        $targetFile = $targetDir . $newFileName;

        // Move the uploaded file to the target directory
        if (move_uploaded_file($_FILES[$inputName]['tmp_name'], $targetFile)) {
            // Update the data array with the new file name and path
            $data[$inputName] = [
                'name' => $newFileName,
                'path' => $targetFile
            ];
        } else {
            echo "Error uploading file from input: $inputName or file too large.";
            exit;
        }
    }
}

// Main script
if (!isset($_GET['action'])) {
    http_response_code(400);
    handleServiceResult(errorResponse("No hashed action provided"));
    exit;
}

$hashedAction = $_GET['action'];
$action = getActionFromHash($hashedAction);
$entity = extractEntityFromAction($action);

if ($action === "member/createProfile") {
    $data = $_POST;

    // Validate presence of required fields
    if (!isset($data['lastName']) || !isset($data['studentId'])) {
        http_response_code(400);
        handleServiceResult(errorResponse("Required data missing"));
        exit;
    }

    handleFileInput('profilePicture', $data);
    handleFileInput('invoice', $data);
} else {
    $postData = file_get_contents('php://input');
    $decodedData = base64_decode(urldecode($postData));
    $data = json_decode($decodedData, true);
}


// Validate request data
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($data === null || !is_array($data))) {
    http_response_code(400);
    handleServiceResult(errorResponse("Failed to process the request. Please ensure the provided data is valid and in the correct format."));
    exit;
}

if (!$entity) {
    http_response_code(400);
    handleServiceResult(errorResponse("Invalid action format"));
    exit;
}

$entityToController = [
    'admin' => 'AdminController',
    'dorm' => 'DormController',
    'maintenance' => 'MaintenanceController',
    'member' => 'MemberController',
    'reservation' => 'ReservationController'
];

if (isset($entityToController[$entity])) {
    $controllerClass = $entityToController[$entity];
    $controller = new $controllerClass();
    handleServiceResult($controller->handleAction($action, $data));
    exit;
}

http_response_code(400);
handleServiceResult(errorResponse("Unknown entity"));
exit;

?>
