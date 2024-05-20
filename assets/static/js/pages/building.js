let buildings = [];

function fetchBuildings() {

    buildings = [{
            id: 2,
            number: 1,
            category: 'Male',
            apartment: '25',
            occupancy: 'fullyOccupied'
        },
        {
            id: 3,
            number: 2,
            category: 'Female',
            apartment: '13',
            occupancy: 'vacant'
        },
        {
            id: 1,
            number: 3,
            category: 'Stuff',
            apartment: '15',
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

function constructTableRow(building) {
    const occupancyBadge = generateOccupancyBadge(building.occupancy);
    return `
        <tr>
            <td>${building.number}</td>
            <td>${building.category}</td>
            <td>${building.apartment}</td>
            <td>${occupancyBadge}</td>
            <td>
                <button type="button" class="btn btn-outline-danger btn-sm action-button" title="Delete" onclick="handleDeleteBuilding(${building.id}, '${building.number}')"><i class="fas fa-trash"></i> Delete</button>
            </td>
        </tr>
    `;
}


function handleDeleteBuilding(id, buildingNumber) {
    const buildingData = {
        buildingId: id
    };
    confirmAction("Confirm Delete", `Are you sure you want to delete building ${buildingNumber}?`)
        .then(() => {
            deleteDataDB("building/delete", buildingData)
                .then(() => {
                    handleSuccess(`Building ${buildingNumber} has been deleted successfully.`);
                })
                .catch((error) => {
                    handleFailure(`Failed to delete building ${buildingNumber}. Please try again later. Error: ${error}`);
                });
        })
        .catch(() => {
            console.log('Delete canceled');
        });
}

function validateBuildingInput(buildingNumber, buildingCategory) {
    if (!buildingNumber || !buildingCategory) {
        handleWarning("Please Fill All Fields !");
        return false;
    }
    return true;
}

function addBuilding(buildingData) {
    return new Promise((resolve, reject) => {
        confirmAction('Confirm Addition', `Are you sure you want to add building ${buildingData.number}?`)
            .then(() => {
                postDataDB("building/create", buildingData)
                    .then(() => {
                        resolve(`Building ${buildingData.number} has been added successfully.`);
                    })
                    .catch((error) => {
                        reject(`Failed to add building ${buildingData.number}. Please try again later. Error: ${error}`);
                    });
            })
            .catch((error) => {
                reject('Error during confirmation: ' + error);
            });
    });
}

function handleAddBuilding() {
    const buildingNumber = $('#buildingNumber').val();
    const buildingCategory = $('#buildingCategory').val();

    if (!validateBuildingInput(buildingNumber, buildingCategory)) {
        return;
    }

    const buildingData = {
        number: buildingNumber,
        category: buildingCategory,
        apartment: '',
        occupancy: 'Vacant'
    };

    addBuilding(buildingData)
        .then((message) => {
            handleSuccess(message);
            clearInputFields(['buildingCategory', 'buildingNumber']);

        })
        .catch((error) => {
            handleFailure(error);
        });

    $('#addBuildingModal').modal('hide');
}


function populateTable() {
    const table = $("#table1").DataTable();
    buildings.forEach(building => {
        const row = constructTableRow(building);
        table.row.add($(row)).draw();
    });
}

// Initialization
$(document).ready(function() {
    fetchBuildings();
    populateTable();
    $("#addBuildingBtn").on("click", function() {
        handleAddBuilding();
    });
});
