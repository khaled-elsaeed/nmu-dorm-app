<?php

require_once '../models/Database.php';
require_once '../helpers/utilities.php';

class DormModel {
    private $db;

    public function __construct() {
        try {
            $this->db = new Database();
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("Failed to connect to the database. Please try again later.");
        }
    }

    // Buildings

    public function fetchBuildings() {
        try {
            $sql = "SELECT b.*, COUNT(a.id) AS apartmentsCount 
                    FROM buildings b 
                    LEFT JOIN apartments a ON b.id = a.buildingId 
                    GROUP BY b.id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $buildings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($buildings);
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while fetching building data. Please try again later.");
        }
    }
    

    public function addBuilding($buildingNumber , $buildingCategory,$buildingMaxApartmentCapacity) {
        try {
            $sql = "INSERT INTO buildings (number,category,maxApartmentCapacity) VALUES (:buildingNumber,:buildingCategory,:buildingMaxApartmentCapacity)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':buildingNumber', $buildingNumber);
            $stmt->bindParam(':buildingCategory', $buildingCategory);
            $stmt->bindParam(':buildingMaxApartmentCapacity', $buildingMaxApartmentCapacity);


            $stmt->execute();
            // Check if any row was affected (building was deleted)
            if ($stmt->rowCount() > 0) {
                return successResponse("Building added successfully.");
            } else {
                return errorResponse("Building with ID {$buildingId} could not be Added.");
            }
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while adding the building. Please try again later.");
        }
    }

    public function removeBuilding($buildingId) {
        try {
            $sql = "DELETE FROM buildings WHERE id = :buildingId";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':buildingId', $buildingId);
            $stmt->execute();
    
            // Check if any row was affected (building was deleted)
            if ($stmt->rowCount() > 0) {
                return successResponse("Building removed successfully.");
            } else {
                return errorResponse("Building with ID {$buildingId} not found or could not be deleted.");
            }
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while removing the building. Please try again later.");
        }
    }
    

    // Apartments

    public function fetchApartments($buildingId = NULL) {
        try {
            if($buildingId == NULL){
                $sql = "SELECT a.*, COUNT(r.id) AS roomsCount
                FROM apartments AS a
                LEFT JOIN rooms AS r ON r.apartmentId = a.id
                GROUP BY a.id";        
                $stmt = $this->db->prepare($sql);
            }
            else{
                $sql = "SELECT * FROM apartments WHERE building_id = :buildingId";
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':buildingId', $buildingId);
            }

            $stmt->execute();
            $apartments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($apartments);
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while fetching apartment data. Please try again later.");
        }
    }

    public function addApartment($apartmentNumber,$buildingId) {
        try {
            
            $maxApartmentCapacity = $this->getMaxApartmentCapacity($buildingId);
            if ($maxApartmentCapacity === false) {
                return errorResponse("Failed to retrieve maximum apartment capacity for this building.");
            }
            
            
            $existingApartmentsCount = $this->getExistingApartmentsCount($buildingId);
            
            
            if ($existingApartmentsCount >= $maxApartmentCapacity) {
                return errorResponse("Cannot add more apartments. Maximum capacity reached for this building.");
            }
            
            $sql = "INSERT INTO apartments (number,buildingId) VALUES (:number,:buildingId)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':buildingId', $buildingId);
            $stmt->bindParam(':number', $apartmentNumber);

            $stmt->execute();
            
            return successResponse("Apartment added successfully.");
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while adding the apartment. Please try again later.");
        }
    }

    private function getMaxApartmentCapacity($buildingId) {
        $sql = "SELECT maxApartmentCapacity FROM buildings WHERE id = :buildingId";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':buildingId', $buildingId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['maxApartmentCapacity'] : false;
    }
    
    private function getExistingApartmentsCount($buildingId) {
        $sql = "SELECT COUNT(*) AS apartmentCount FROM apartments WHERE buildingId = :buildingId";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':buildingId', $buildingId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['apartmentCount'] : 0;
    }

    public function removeApartment($apartmentId) {
        try {    
            $sql = "DELETE FROM apartments WHERE id = :apartmentId";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':apartmentId', $apartmentId);
    
            if ($stmt->execute() && $stmt->rowCount() > 0) {
                return successResponse("Apartment removed successfully.");
            } else {
                return errorResponse("Failed to remove the apartment. Apartment may not exist or an error occurred.");
            }
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while removing the apartment. Please try again later.");
        }
    }

    
    

    // Rooms

    public function fetchRooms() {
        try {
                $sql = "SELECT * from rooms";        
                $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $apartments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($apartments);
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while fetching apartment data. Please try again later.");
        }
    }


    public function addRoom($apartmentId) {
        try {
            if ($maxRoomCapacity === false) {
                return errorResponse("Failed to retrieve maximum room capacity for this apartment.");
            }
            $existingRoomsCount = $this->getExistingRoomsCount($apartmentId);
            
            if ($existingRoomsCount >= $maxRoomCapacity) {
                return errorResponse("Cannot add more rooms. Maximum capacity reached for this apartment.");
            }
            
            
            $sql = "INSERT INTO rooms (apartment_id) VALUES (:apartmentId)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':apartmentId', $apartmentId);
            $stmt->execute();
            
            return successResponse("Room added successfully.");
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while adding the room. Please try again later.");
        }
    }

    private function getMaxRoomCapacity($apartmentId) {
        $sql = "SELECT max_room_capacity FROM apartments WHERE id = :apartmentId";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':apartmentId', $apartmentId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['max_room_capacity'] : false;
    }

    private function getExistingRoomsCount($apartmentId) {
        $sql = "SELECT COUNT(*) AS roomCount FROM rooms WHERE apartment_id = :apartmentId";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':apartmentId', $apartmentId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['roomCount'] : 0;
    }

    public function removeRoom($roomId) {
        try {
            $sql = "DELETE FROM rooms WHERE id = :roomId";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':roomId', $roomId);
            $stmt->execute();
            return successResponse("Room removed successfully.");
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while removing the room. Please try again later.");
        }
    }

    public function calculateOccupancyRate($entityType, $entityId) {
        try {
            switch ($entityType) {
                case 'apartment':
                    $existingCount = $this->getExistingRoomsCount($entityId);
                    $maxCapacity = $this->getMaxRoomCapacity($entityId);
                    $entityName = 'Apartment';
                    break;
                case 'building':
                    $existingCount = $this->getExistingApartmentsCount($entityId);
                    $maxCapacity = $this->getMaxApartmentCapacity($entityId);
                    $entityName = 'Building';
                    break;
                default:
                    return errorResponse("Invalid entity type.");
            }

            if ($maxCapacity === false) {
                return errorResponse("Failed to retrieve maximum capacity for this $entityName.");
            }

            $occupancyRate = ($existingCount / $maxCapacity) * 100;

            return successResponse("Occupancy rate for the $entityName: $occupancyRate%");
        } catch (PDOException $e) {
            logError($e->getMessage());
            return errorResponse("An error occurred while calculating occupancy rate for the $entityName. Please try again later.");
        }
    }



    public function calculateOccupancyRateForAllRooms() {
        $totalOccupiedRoomsCount = $this->getTotalOccupiedRoomsCount();
        $totalVacantRoomsCount = $this->getTotalVacantRoomsCount();
    
        if ($totalVacantRoomsCount === 0) {
            return errorResponse("No vacant rooms found in the dorm.");
        }
    
        $occupancyRate = ($totalOccupiedRoomsCount / ($totalOccupiedRoomsCount + $totalVacantRoomsCount)) * 100;
    
        return successResponse("Occupancy rate for all rooms in the dorm: $occupancyRate%");
    }
    
    private function getTotalOccupiedRoomsCount() {
        $sql = "SELECT COUNT(*) AS occupied_rooms_count FROM rooms WHERE occupied = 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['occupied_rooms_count'];
    }
    
    private function getTotalVacantRoomsCount() {
        $sql = "SELECT COUNT(*) AS vacant_rooms_count FROM rooms WHERE occupied = 0";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['vacant_rooms_count'];
    }
    



    
    


}