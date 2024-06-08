<?php

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
    if (count($parts) === 2) {
        return $parts[0];
    }
    return null;
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
        hash('sha256', 'maintenance/start') => 'maintenance/start',
        hash('sha256', 'maintenance/reject') => 'maintenance/reject',
        hash('sha256', 'maintenance/complete') => 'maintenance/complete',
        hash('sha256', 'admin/login') => 'admin/login',
    ];

    $decodedHash = decodeHash($hashedAction);

    foreach ($actions as $hash => $action) {
        if ($hash === $decodedHash) {
            return $action;
        }
    }
    return 'errorrr'; // Unknown action
}

// Check if the 'action' parameter is provided in the query string
if (!isset($_GET['action'])) {
    http_response_code(400); // Bad request
    echo json_encode(["error" => "No hashed action provided"]);
    exit; 
}

$hashedAction = $_GET['action'];

// Receive the raw POST data
$postData = file_get_contents('php://input');

// Decode the URL encoded data and then decode the base64 data
$decodedData = urldecode($postData);
$decodedData = base64_decode($decodedData);

// Convert the JSON string to PHP array
$data = json_decode($decodedData, true);

// Check if the data was successfully decoded
if ($data === null || !is_array($data)) {
    http_response_code(400); // Bad request
    echo json_encode(["error" => "Failed to decode JSON data or decoded data is not an array"]);
    exit; 
}

// Get the action from the hashed action
$action = getActionFromHash($hashedAction);

// Define entity to controller mapping
$entityToController = [
    'admin' => 'AdminController',
    'building' => 'BuildingController',
    'apartment' => 'ApartmentController',
    'room' => 'RoomController',
    'maintenance' => 'MaintenanceController',
];

// Extract entity from the action
$entity = extractEntityFromAction($action);
if (!$entity) {
    http_response_code(400); // Bad request
    echo json_encode(["error" => "Invalid action format"]);
    exit; 
}

// Autoload controller class based on the matched entity
if (isset($entityToController[$entity])) {
    $controllerClass = $entityToController[$entity];
    $controller = new $controllerClass();
    handleServiceResult($controller->handleAction($action, $data));
    exit; 
}

// Unknown entity
http_response_code(400); // Bad request
echo json_encode(["error" => "Unknown entity"]);
exit; 

function handleServiceResult($result) {
    echo json_encode($result); 
}
?>
