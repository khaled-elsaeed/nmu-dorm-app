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

function handleAddBuilding() {
    const buildingNumber = $('#buildingNumber').val();
    const buildingCategory = $('#buildingCategory').val();

    // Validate input
    if (!buildingNumber || !buildingCategory) {
        handleWarning("Please Fill All Fields !");
        return;
    }

    const buildingData = {
        number: buildingNumber,
        category: buildingCategory,
        apartment: '',
        occupancy: 'Vacant'
    };

       // Confirm action
       confirmAction('Confirm Addition', `Are you sure you want to add building ${buildingData.number}?`)
       .then(() => {
           // Post data to the server
           return postDataDB("apartment/create", buildingData);
       })
       .then(() => {
           handleSuccess(`Apartment ${buildingData.number} has been added successfully.`);
           clearInputFields(['apartmentNumber', 'apartmentBuildingNumber']);
           $('#addBuildingModal').modal('hide');
       })
       .catch((error) => {
           if (error !== 'User cancelled the action') {
               handleFailure(`Failed to add apartment ${buildingData.number}. Please try again later. Error: ${error}`);
               $('#addBuildingModal').modal('hide');
           }
       });
}





function populateTable() {
    const table = $("#table1").DataTable();
    buildings.forEach(building => {
        const row = constructTableRow(building);
        table.row.add($(row)).draw();
    });
}

function downloadExcel() {
    const csvHeader = ["Building Number", "Category", "Apartment (vacant)"];
    const csvRows = [csvHeader];

    buildings.forEach(building => {
        const row = [
            building.number,
            building.category,
            building.apartment
        ];
        csvRows.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(csvRows);
    XLSX.utils.book_append_sheet(wb, ws, "Buildings");

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const filename = `buildings_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.xlsx`;

    XLSX.writeFile(wb, filename);
}


// Initialization
$(document).ready(function() {
    fetchBuildings();
    populateTable();
    $("#addBuildingBtn").on("click", function() {
        handleAddBuilding();
    });
});
