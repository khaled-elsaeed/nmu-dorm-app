<?php

function generate_csrfToken() {
    if (empty($_SESSION['csrfToken'])) {
        $_SESSION['csrfToken'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrfToken'];
}

function regenerate_csrfToken() {
    $_SESSION['csrfToken'] = bin2hex(random_bytes(32));
}

function validate_csrfToken($token) {
    return hash_equals($_SESSION['csrfToken'], $token);
}

function start_secure_session() {
    session_start();
    session_regenerate_id(true);
}

function is_logged_in() {
    return isset($_SESSION['userId']);
}

function redirect($url) {
    header("Location: $url");
    exit();
}


function log_error($message, $db = null) {
    $error_log_file ='../storage/logs/error.log'; 

    
    $error_message = date('Y-m-d H:i:s') . ' ' . $message;

    // If database connection is provided, check for database errors
    if ($db instanceof PDO) {
        $pdo_error_info = $db->errorInfo();
        if ($pdo_error_info[0] != PDO::ERR_NONE) {
            $error_message .= ' | Database Error: ' . implode(' ', $pdo_error_info);
        }
    }

    // Get the backtrace to find file name and line number
    $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
    if (isset($backtrace[1])) {
        $error_message .= ' | File: ' . $backtrace[1]['file'] . ' | Line: ' . $backtrace[1]['line'];
    }

    // Append the error message to the log file
    if (!file_exists($error_log_file)) {
        // Create the log file if it doesn't exist
        $result = touch($error_log_file);
        if (!$result) {
            // Log an error if file creation fails
            echo("Failed to create error log file: $error_log_file");
            return;
        }
    }

    // Append the error message to the log file
    file_put_contents($error_log_file, $error_message . PHP_EOL, FILE_APPEND | LOCK_EX);
}




function errorResponse($error = null) {
    $response = array("success" => false);
    if ($error !== null) {
        $response["error"] = $error;
    }
    return $response;
}

 function logError($error) {
    log_error("Error: " . $error);
}

 function successResponse($data = null, $message = null) {
    $response = array("success" => true);
    if ($data !== null) {
        $response["data"] = $data;
    }
    if ($message !== null) {
        $response["message"] = $message;
    }
    return $response;
}

function secureData($data) {
    if (is_array($data)) {
        $secured_data = array();
        foreach ($data as $key => $value) {
            $secured_data[$key] = secureData($value);
        }
        return $secured_data;
    } else {
        $clean_input = filter_var($data, FILTER_SANITIZE_STRING);
        $escaped_input = htmlspecialchars($clean_input, ENT_QUOTES, 'UTF-8');
        return $escaped_input;
    }
}



?>
