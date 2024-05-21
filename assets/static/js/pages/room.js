let rooms = [];
let apartments = [];
let buildings = [];

function fetchBuildings() {
    buildings = [
        { id: 2, number: 1, occupancy: 'fullyOccupied' },
        { id: 3, number: 2, occupancy: 'vacant' },
        { id: 1, number: 3, occupancy: 'partiallyOccupied' }
    ];
    populateBuildingSelect();
}

function populateBuildingSelect() {
    const buildingSelect = $('#roomBuildingNumber');
    buildingSelect.empty(); 
    buildingSelect.append(`<option value="" disabled selected>Select Building</option>`);
    buildings.forEach(building => {
        buildingSelect.append(`<option value="${building.id}">${building.number}</option>`); 
    });
}

function fetchApartments() {
    apartments = [
        { id: 23, number: 1, buildingId: 2, occupancy: 'fullyOccupied' },
        { id: 33, number: 2, buildingId: 3, occupancy: 'vacant' },
        { id: 13, number: 3, buildingId: 1, occupancy: 'partiallyOccupied' }
    ];
}

function populateApartmentSelect(buildingId) {
    const apartmentSelect = $('#roomApartmentNumber');
    apartmentSelect.empty(); 
    apartmentSelect.append(`<option value="" disabled selected>Select Apartment</option>`);
    apartments.filter(apartment => apartment.buildingId == buildingId)
              .forEach(apartment => {
                  apartmentSelect.append(`<option value="${apartment.id}">${apartment.number}</option>`); 
              });
}

function fetchRooms() {
    rooms = [
        { id: 2, number: 1, buildingId: 44, building: 25, apartment: 25, occupancy: 'fullyOccupied' },
        { id: 3, number: 2, building: 78, apartment: 13, occupancy: 'vacant' },
        { id: 1, number: 3, building: 98, apartment: 15, occupancy: 'partiallyOccupied' }
    ];
}

function generateOccupancyBadge(occupancyStatus) {
    const badgeMap = {
        'vacant': '<span class="badge bg-success">Vacant</span>',
        'fullyOccupied': '<span class="badge bg-danger">Fully Occupied</span>',
        'partiallyOccupied': '<span class="badge bg-warning">Partially Occupied</span>',
    };
    return badgeMap[occupancyStatus] || `<span class="badge">${occupancyStatus}</span>`;
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
                <button type="button" class="btn btn-outline-danger btn-sm action-button" title="Delete" onclick="handleDeleteRoom(${room.id}, '${room.number}')"><i class="fas fa-trash"></i> Delete</button>
            </td>
        </tr>
    `;
}

function handleDeleteRoom(id, roomNumber) {
    const roomData = { roomId: id };
    confirmAction("Confirm Delete", `Are you sure you want to delete room ${roomNumber}?`)
        .then(() => {
            deleteDataDB("room/delete", roomData)
                .then(() => {
                    handleSuccess(`Room ${roomNumber} has been deleted successfully.`);
                })
                .catch((error) => {
                    handleFailure(`Failed to delete room ${roomNumber}. Please try again later. Error: ${error}`);
                });
        })
        .catch(() => {
            console.log('Delete canceled');
        });
}

function validateRoomInput(roomNumber, roomBuildingNumber, roomApartmentNumber) {
    if (!roomNumber || !roomBuildingNumber || !roomApartmentNumber) {
        handleWarning("Please Fill All Fields!");
        return false;
    }
    return true;
}

function addRoom(roomData) {
    return new Promise((resolve, reject) => {
        confirmAction('Confirm Addition', `Are you sure you want to add room ${roomData.number}?`)
            .then(() => {
                postDataDB("room/create", roomData)
                    .then(() => {
                        resolve(`Room ${roomData.number} has been added successfully.`);
                    })
                    .catch((error) => {
                        reject(`Failed to add room ${roomData.number}. Please try again later. Error: ${error}`);
                    });
            })
            .catch((error) => {
                reject('Error during confirmation: ' + error);
            });
    });
}

function handleAddRoom() {
    const roomNumber = $('#roomNumber').val();
    const roomBuildingNumber = $('#roomBuildingNumber').val();
    const roomApartmentNumber = $('#roomApartmentNumber').val();

    if (!validateRoomInput(roomNumber, roomBuildingNumber, roomApartmentNumber)) {
        return;
    }

    const roomData = {
        number: roomNumber,
        building: roomBuildingNumber,
        apartment: roomApartmentNumber
    };

    addRoom(roomData)
        .then((message) => {
            handleSuccess(message);
            clearInputFields(['roomBuildingNumber', 'roomNumber']);
        })
        .catch((error) => {
            if (error.includes("false")) {
            } else {
                handleFailure(error);
            }
        })
        .finally(() => {
            $('#addRoomModal').modal('hide');
        });
}

function populateTable() {
    const table = $("#table1").DataTable();
    rooms.forEach(room => {
        const row = constructTableRow(room);
        table.row.add($(row)).draw();
    });
}

function downloadExcel() {
    const csvHeader = ["Room Number", "Building", "Apartment", "Occupancy"];
    const csvRows = [csvHeader];

    rooms.forEach(room => {
        const row = [
            room.number,
            room.building,
            room.apartment,
            room.occupancy
        ];
        csvRows.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(csvRows);
    XLSX.utils.book_append_sheet(wb, ws, "Rooms");

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const filename = `rooms_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.xlsx`;

    XLSX.writeFile(wb, filename);
}

// Initialization
$(document).ready(function() {
    fetchRooms();
    populateTable();
    $("#addRoomBtn").on("click", function() {
        handleAddRoom();
    });

    fetchBuildings();
    fetchApartments();

    $('#roomBuildingNumber').on('change', function() {
        const selectedBuildingId = $(this).val();
        populateApartmentSelect(selectedBuildingId);
    });
});

