// Utility Functions
import { confirmAction, handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader, postDataDB,getDataDB, deleteDataDB } from "../helper/utils.js";

function attachEventListener(buttonSelector, eventType, handler) {
    $(document).on(eventType, buttonSelector, function () {
       const buildingId = $(this).data('id');
       const buildingNumber = $(this).data('number');
       handler(buildingId, buildingNumber);
    });
 }

let buildings = [];

function fetchBuildings() {

    getDataDB("dorm/getBuildings")
   .then(data => {
      buildings = data.map(building => ({
         buildingId: building.id,
         number: building.number,
         category: building.category,
         maxApartmentCapacity: building.maxApartmentCapacity,
         apartmentsCount : building.apartmentsCount
      }));
      populateTable();
   })
}
function populateTable() {
    const table = $("#table1").DataTable();
    table.clear().draw(); // Clear existing data from the table
    
    buildings.forEach(building => {
       const row = constructTableRow(building);
       table.row.add($(row)).draw();
    });
 }
 
function constructTableRow(building) {
    const occupancyBadge = generateOccupancyBadge(building.apartmentsCount,buildings.maxApartmentCapacity);
    return `
        <tr>
            <td>${building.number}</td>
            <td>${building.category}</td>
            <td>${building.apartmentsCount} / ${building.maxApartmentCapacity}</td>
            <td>${occupancyBadge}</td>
            <td>
                <button type="button" class="btn btn-outline-danger btn-sm action-button remove-building-btn" data-id="${building.buildingId}" data-number="${building.number}" title="Remove"><i class="fas fa-trash"></i> Delete</button>
            </td>
        </tr>
    `;
}


function generateOccupancyBadge(apartmentsCount, maxApartmentCapacity) {
    if (apartmentsCount === 0) {
        return '<span class="badge bg-success">Vacant</span>';
    } else if (apartmentsCount === maxApartmentCapacity) {
        return '<span class="badge bg-danger">Fully Occupied</span>';
    } else {
        return '<span class="badge bg-warning">Partially Occupied</span>';
    }
}


function getNewBuildingData(){
    const buildingNumber = $('#buildingNumber').val();
    const buildingCategory = $('#buildingCategory').val();
    // Validate input
    if (!buildingNumber || !buildingCategory) {
        handleWarning("Please Fill All Fields !");
        return;
    }

    const buildingData = {
        number: buildingNumber,
        category: buildingCategory
    };

    return buildingData;
}

function handleAddBuilding() {

    const buildingData = getNewBuildingData();

    confirmAction("Confirm Complete", `Are you sure you want to add the building ${buildingData.number}?`)
    .then(() => {
       postDataDB("dorm/addBuilding", { buildingNumber : buildingData.number , buildingCategory : buildingData.category })
          .then(() => handleSuccess(`Building ${buildingData.number} has been added successfully.`))
          .catch(() => handleFailure(`Failed to add the building ${buildingData.number}. Please try again later.`));
    })
    .catch(() => console.log('Add action canceled'));
}

function handleRemoveBuilding(buildingId, buildingNumber) {
    // Confirm action with the user
    confirmAction("Confirm Remove", `Are you sure you want to remove the building ${buildingNumber}?`)
        .then(() => {
            deleteDataDB("dorm/removeBuilding", { buildingId: buildingId })
                .then(() => {
                    fetchBuildings();
                    handleSuccess(`Building ${buildingNumber} has been removed successfully.`);
                })
                .catch(() => {
                    handleFailure(`Failed to remove the building ${buildingNumber}. Please try again later.`);
                });
        })
        .catch(() => {
            console.log('Complete action canceled');
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


// Document Ready Function
$(document).ready(function () {
    applyBlurEffect();
    showLoader();
 
    // Simulate fetching data after a delay
    setTimeout(() => {
        fetchBuildings();
       hideLoader();
       removeBlurEffect();
    }, 1000); // Simulate 5 seconds delay for fetching data
 
    // Attach event listeners to buttons
    attachEventListener('.remove-building-btn', 'click', handleRemoveBuilding);
    attachEventListener('.add-building-btn', 'click', handleAddBuilding);

    attachEventListener('.csv-btn', 'click', downloadExcel);
 });