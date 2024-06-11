<?php
require_once('../helpers/utilities.php');
// Autoload models
spl_autoload_register(function ($class) {
    require_once  '../controllers/' . $class . '.php';
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
        hash('sha256', 'building/delete') => 'building/delete',
        hash('sha256', 'building/create') => 'building/create',
        hash('sha256', 'apartment/create') => 'apartment/create',
        hash('sha256', 'apartment/delete') => 'apartment/delete',
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
    // Ensure the result is an array or an object
    if (!is_array($result) && !is_object($result)) {
        // If not, create an array with the result and encode it
        $result = array('result' => $result);
    }

    // Set the Content-Type header to indicate JSON
    header('Content-Type: application/json');

    // Encode the result as JSON and return it
    echo json_encode($result);
}


// Main script
if (!isset($_GET['action'])) {
    http_response_code(400);
    handleServiceResult(errorResponse("No hashed action provided"));
    exit; 
}

$hashedAction = $_GET['action'];
$postData = file_get_contents('php://input');
$decodedData = base64_decode(urldecode($postData));
$data = json_decode($decodedData, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($data === null || !is_array($data))) {
    // http_response_code(400);
    handleServiceResult(errorResponse("Failed to process the request. Please ensure the provided data is valid and in the correct format."));
    exit; 
}



$action = getActionFromHash($hashedAction);
$entity = extractEntityFromAction($action);

if (!$entity) {
    http_response_code(400);
    handleServiceResult(errorResponse("Invalid action format"));
    exit; 
}

$entityToController = [
    'admin' => 'AdminController',
    'building' => 'BuildingController',
    'apartment' => 'ApartmentController',
    'room' => 'RoomController',
    'maintenance' => 'MaintenanceController',
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
