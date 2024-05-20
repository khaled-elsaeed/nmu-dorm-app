<?php
// Function to decode base64 encoded hash
function decodeHash($hash) {
    return base64_decode($hash);
}

// Function to get the action based on the hashed value
function getActionFromHash($hashedAction) {
    $actions = [
        hash('sha256', 'building/delete') => 'building/delete',
        hash('sha256', 'building/create') => 'building/create',
        hash('sha256', 'apartment/create') => 'apartment/create',
        hash('sha256', 'apartment/delete') => 'apartment/delete',
        hash('sha256', 'room/create') => 'room/create',
        hash('sha256', 'room/delete') => 'room/delete'


    ];

    $decodedHash = decodeHash($hashedAction);

    foreach ($actions as $hash => $action) {
        if ($hash === $decodedHash) {
            return $action;
        }
    }
    return null; // Unknown action
}

// Check if the 'action' parameter is provided in the query string
if (isset($_GET['action'])) {
    $hashedAction = $_GET['action'];
} else {
    http_response_code(400); // Bad request
    echo json_encode(["error" => "No hashed action provided"]);
    exit;
}

// Receive the raw POST data
$postData = file_get_contents('php://input');

// Decode the URL encoded data and then decode the base64 data
$decodedData = base64_decode(urldecode($postData));

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
// Perform tasks based on the action
switch ($action) {
    case 'building/delete':
    case 'building/create':
        // Handle both 'building/delete' and 'buildings/Create' actions
        // You can access the data using $data variable
        // Example: $data['buildingId'] for 'building/delete'
        // Example: $data['number'], $data['category'] for 'buildings/Create'
        // Perform your operations here
        echo json_encode(["success" => true]);
        break;

        case 'apartment/delete':
            case 'apartment/create':
        // Handle other actions
        // Example: $data['parameter']
        // Perform your operations here
        echo json_encode(["success" => true]);
        break;
        case 'room/delete':
            case 'room/create':
        // Handle other actions
        // Example: $data['parameter']
        // Perform your operations here
        echo json_encode(["success" => true]);
        break;

    default:
        // Unknown action
        http_response_code(400); // Bad request
        echo json_encode(["error" => "Unknown action"]);
        exit;
}

?>
