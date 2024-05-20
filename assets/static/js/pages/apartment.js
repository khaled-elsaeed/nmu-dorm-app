let apartments = [];

function fetchApartments() {

    apartments = [{
            id: 2,
            number: 1,
            building:2,
            buildingId: 5,

            vacantRoom: '25',
            occupancy: 'fullyOccupied'
        },
        {
            id: 3,
            number: 2,
            building: 3,
            buildingId: 5,

            vacantRoom: '13',
            occupancy: 'vacant'
        },
        {
            id: 1,
            number: 3,
            building: 5,
            buildingId: 5,

            vacantRoom: '15',
            occupancy: 'partiallyOccupied'
        },
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

function constructTableRow(apartment) {
    const occupancyBadge = generateOccupancyBadge(apartment.occupancy);
    return `
        <tr>
            <td>${apartment.number}</td>
            <td>${apartment.building}</td>
            <td>${apartment.vacantRoom}</td>
            <td>${occupancyBadge}</td>
            <td>
                <button type="button" class="btn btn-outline-danger btn-sm action-button" title="Delete" onclick="handleDeleteApartment(${apartment.id},'${apartment.buildingId}', '${apartment.number}')"><i class="fas fa-trash"></i> Delete</button>
            </td>
        </tr>
    `;
}


function handleDeleteApartment(id, apartmentNumber,buildingId) {
    const apartmentData = {
        apartmentId: id,
        buildingId:buildingId
    };
    confirmAction("Confirm Delete", `Are you sure you want to delete apartment ${apartmentNumber}?`)
        .then(() => {
            deleteDataDB("apartment/delete", apartmentData)
                .then(() => {
                    handleSuccess(`Apartment ${apartmentNumber} has been deleted successfully.`);
                })
                .catch((error) => {
                    handleFailure(`Failed to delete apartment ${apartmentNumber}. Please try again later. Error: ${error}`);
                });
        })
        .catch(() => {
            console.log('Delete canceled');
        });
}

function validateApartmentInput(apartmentNumber, apartmentapartment) {
    if (!apartmentNumber || !apartmentapartment) {
        handleWarning("Please Fill All Fields !");
        return false;
    }
    return true;
}

function addApartment(apartmentData) {
    return new Promise((resolve, reject) => {
        confirmAction('Confirm Addition', `Are you sure you want to add apartment ${apartmentData.number}?`)
            .then(() => {
                postDataDB("apartment/create", apartmentData)
                    .then(() => {
                        resolve(`Apartment ${apartmentData.number} has been added successfully.`);
                    })
                    .catch((error) => {
                        reject(`Failed to add apartment ${apartmentData.number}. Please try again later. Error: ${error}`);
                    });
            })
            .catch((error) => {
                reject('Error during confirmation: ' + error);
            });
    });
}



function handleAddApartment() {
    const apartmentNumber = $('#apartmentNumber').val();
    const buildingNumber = $('#buildingNumber').val();

    if (!validateApartmentInput(apartmentNumber, buildingNumber)) {
        return;
    }

    const apartmentData = {
        number: apartmentNumber,
        building: buildingNumber,
    };

    addApartment(apartmentData)
        .then((message) => {
            handleSuccess(message);
            // Clear input fields after successful addition
            clearInputFields(['apartmentNumber', 'buildingNumber']);
        })
        .catch((error) => {
            handleFailure(error);
        });

    $('#addApartmentModal').modal('hide');
}



function populateTable() {
    const table = $("#table1").DataTable();
    apartments.forEach(apartment => {
        const row = constructTableRow(apartment);
        table.row.add($(row)).draw();
    });
}

// Initialization
$(document).ready(function() {
    fetchApartments();
    populateTable();
    $("#addApartmentBtn").on("click", function() {
        handleAddApartment();
    });
});
