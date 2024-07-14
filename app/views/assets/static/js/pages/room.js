// Utility Functions
import { confirmAction, downloadExcel, handleWarning,handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader, postDataDB, deleteDataDB, getDataDB } from "../helper/utils.js";

function attachEventListener(buttonSelector, eventType, handler) {
    $(document).on(eventType, buttonSelector, function () {
        const roomId = $(this).data('id');
        const roomNumber = $(this).data('number');
        handler(roomId, roomNumber);
    });
}

var rooms = [];
var apartments = [];
var buildings = [];

async function fetchRooms() {

    try {
        const roomsData = await getDataDB("dorm/getRooms");
        rooms = roomsData;
        await populateTable(); 
     } catch (error) {
        console.error("An error occurred while fetching rooms:", error);
        handleFailure("Failed to fetch rooms. Please try again later.");
     }
}

async function fetchBuildings(){
    try {
       const buildingsData = await getDataDB("dorm/getBuildings");
       buildings = buildingsData;
       populateBuildingSelect(); // Populate select options after buildings are fetched
    } catch (error) {
       console.error("An error occurred while fetching buildings:", error);
       handleFailure("Failed to fetch buildings. Please try again later.");
    }
 }


async function fetchApartments(){
   try {
      const apartmentsData = await getDataDB("dorm/getApartments");
      apartments = apartmentsData;
      populateApartmentSelect(); // Populate select options after apartments are fetched
   } catch (error) {
      console.error("An error occurred while fetching apartments:", error);
      handleFailure("Failed to fetch apartments. Please try again later.");
   }
}

async function populateTable() {
    const table = $("#table1").DataTable();
    rooms.forEach(room => {
        const row = constructTableRow(room);
        table.row.add($(row)).draw();
    });
}

function constructTableRow(room) {
    const occupancyBadge = generateOccupancyBadge(room.occupiedStatues);
    const apartment = apartments.find((apartment) => apartment.id == room.apartmentId);
    const building = buildings.find( (building) => building.id == apartment.buildingId)
    
    return `
        <tr>
            <td>${room.number}</td>
            <td>${building.number}</td>
            <td>${apartment.number}</td>
            <td>${occupancyBadge}</td>
            <td>
            <button type="button" class="btn btn-outline-danger btn-sm action-button remove-room-btn" data-id="${room.id}" data-number="${room.number}" title="Remove"><i class="fas fa-trash"></i> Delete</button>
            </td>
        </tr>
    `;
}

function generateOccupancyBadge(occupiedStatues) {
    if (occupiedStatues === 0) {
        return '<span class="badge bg-success">Vacant</span>';
    } else {
        return '<span class="badge bg-danger">Occupied</span>';
    } 
}

function populateBuildingSelect() {
    const buildingSelect = $('#roomBuildingNumber');
    buildingSelect.empty();
    buildingSelect.append(`<option value="" disabled selected>Select Building</option>`);
    buildings.forEach(building => {
        buildingSelect.append(`<option value="${building.id}" data-id="${building.id}">${building.number}</option>`);
    });
}

function populateApartmentSelect() {
    const buildingId = $(this).val(); 
    const apartmentSelect = $('#roomApartmentNumber');
    apartmentSelect.empty();
    apartmentSelect.append(`<option value="" disabled selected>Select Apartment</option>`);
    apartments.filter(apartment => apartment.buildingId == buildingId)
              .forEach(apartment => {
                  apartmentSelect.append(`<option value="${apartment.id}">${apartment.number}</option>`); 
              });
}

function handleRemoveRoom(roomId, roomNumber) {
    confirmAction("Confirm Remove", `Are you sure you want to remove the room ${roomNumber}?`)
        .then(() => {
            deleteDataDB("room/remove", { roomId: roomId })
                .then(() => handleSuccess(`Room ${roomNumber} has been removed successfully.`))
                .catch(() => handleFailure(`Failed to remove the room ${roomNumber}. Please try again later.`));
        })
        .catch(() => console.log('Complete action canceled'));
}

function getNewRoomData() {
    const roomNumber = $('#roomNumber').val();
    const roomBuildingNumber = $('#roomBuildingNumber').val();
    const roomApartmentNumber = $('#roomApartmentNumber').val();

    if (!roomNumber || !roomBuildingNumber || !roomApartmentNumber) {
        handleWarning("Please Fill All Fields !");
        return null;
    }

    return {
        number: roomNumber,
        buildingId: roomBuildingNumber,
        apartmentId: roomApartmentNumber
    };
}

function handleAddRoom() {
    const roomData = getNewRoomData();
    if (!roomData) return;

    confirmAction("Confirm Complete", `Are you sure you want to add the room ${roomData.number}?`)
        .then(() => {
            postDataDB("room/add", { roomNumber: roomData.number, buildingId: roomData.buildingId, apartmentId: roomData.apartmentId })
                .then(() => handleSuccess(`Room ${roomData.number} has been added successfully.`))
                .catch(() => handleFailure(`Failed to add the room ${roomData.number}. Please try again later.`));
        })
        .catch(() => console.log('Add action canceled'));
}

function downloadRoomsSheet() {
    const roomHeaders = ["number", "building", "apartment", "occupancy"];
    downloadExcel('Rooms', rooms, roomHeaders);
}

// Document Ready Function
$(document).ready(function () {
    applyBlurEffect();
    showLoader();

    // Simulate fetching data after a delay
    setTimeout(async () => {
        await fetchBuildings();
        await fetchApartments();
        await fetchRooms();
        hideLoader();
        removeBlurEffect();
    }, 1000); // Simulate 5 seconds delay for fetching data

    // Attach event listeners to buttons
    attachEventListener('.remove-room-btn', 'click', handleRemoveRoom);
    attachEventListener('.add-room-btn', 'click', handleAddRoom);
    $('#roomBuildingNumber').on('change', populateApartmentSelect);

    attachEventListener('.csv-btn', 'click', downloadRoomsSheet);
});
