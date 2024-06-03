// Utility Functions
import { confirmAction, downloadExcel, handleWarning,handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader, postDataDB, deleteDataDB } from "../helper/utils.js";

function attachEventListener(buttonSelector, eventType, handler) {
    $(document).on(eventType, buttonSelector, function () {
        const roomId = $(this).data('id');
        const roomNumber = $(this).data('number');
        handler(roomId, roomNumber);
    });
}

let rooms = [];
let apartments = [];
let buildings = [];

function fetchRooms() {
    rooms = [
        { id: 2, number: 1, buildingId: 44, building: 25, apartment: 25, occupancy: 'fullyOccupied' },
        { id: 3, number: 2, building: 78, apartment: 13, occupancy: 'vacant' },
        { id: 1, number: 3, building: 98, apartment: 15, occupancy: 'partiallyOccupied' }
    ];
}

function fetchBuildings() {
    buildings = [
        { id: 2, number: 1, occupancy: 'fullyOccupied' },
        { id: 3, number: 2, occupancy: 'vacant' },
        { id: 1, number: 3, occupancy: 'partiallyOccupied' }
    ];
    populateBuildingSelect();
}

function fetchApartments() {
    apartments = [
        { id: 23, number: 5, buildingId: 2, occupancy: 'fullyOccupied' },
        { id: 33, number: 6, buildingId: 3, occupancy: 'vacant' },
        { id: 13, number: 7, buildingId: 1, occupancy: 'partiallyOccupied' }
    ];
}

function populateTable() {
    const table = $("#table1").DataTable();
    rooms.forEach(room => {
        const row = constructTableRow(room);
        table.row.add($(row)).draw();
    });
}

function constructTableRow(room) {
    const occupancyBadge = generateOccupancyBadge(room.occupancy);
    return `
        <tr>
            <td>${room.number}</td>
            <td>${room.building}</td>
            <td>${room.apartment}</td>
            <td>${occupancyBadge}</td>
            <td>
            <button type="button" class="btn btn-outline-danger btn-sm action-button remove-room-btn" data-id="${room.id}" data-number="${room.number}" title="Remove"><i class="fas fa-trash"></i> Delete</button>
            </td>
        </tr>
    `;
}

function generateOccupancyBadge(occupancyStatus) {
    const badgeMap = {
        'vacant': '<span class="badge bg-success">Vacant</span>',
        'fullyOccupied': '<span class="badge bg-danger">Fully Occupied</span>',
        'partiallyOccupied': '<span class="badge bg-warning">Partially Occupied</span>',
    };
    return badgeMap[occupancyStatus] || `<span class="badge">${occupancyStatus}</span>`;
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
    const buildingId = $(this).val(); // Get the value of the selected building ID
    console.log(buildingId);
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
    setTimeout(() => {
        fetchRooms();
        populateTable();
        fetchBuildings();
        fetchApartments();
        hideLoader();
        removeBlurEffect();
    }, 3000); // Simulate 5 seconds delay for fetching data

    // Attach event listeners to buttons
    attachEventListener('.remove-room-btn', 'click', handleRemoveRoom);
    attachEventListener('.add-room-btn', 'click', handleAddRoom);
    $('#roomBuildingNumber').on('change', populateApartmentSelect);

    attachEventListener('.csv-btn', 'click', downloadRoomsSheet);
});
