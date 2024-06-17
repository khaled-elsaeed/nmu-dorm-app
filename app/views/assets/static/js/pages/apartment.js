// Utility Functions
import { confirmAction, handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader, postDataDB, deleteDataDB } from "../helper/utils.js";

function attachEventListener(buttonSelector, eventType, handler) {
    $(document).on(eventType, buttonSelector, function () {
       const apartmentId = $(this).data('id');
       const apartmentNumber = $(this).data('number');
       handler(apartmentId, apartmentNumber);
    });
 }


let apartments = [];
let buildings = [];

function fetchBuildings() {

   buildings = [{
         id: 2,
         number: 11,
         occupancy: 'fullyOccupied'
      },
      {
         id: 3,
         number: 22,
         occupancy: 'vacant'
      },
      {
         id: 1,
         number: 33,
         occupancy: 'partiallyOccupied'
      }
   ];
   populateBuildingSelect();
}

function fetchBuildings() {

   getDataDB("dorm/getapartments")
  .then(data => {
     apartments = data.map(apartment => ({
        apartmentId: apartment.id,
        number: apartment.number,
        category: apartment.category,
        maxApartmentCapacity: apartment.maxApartmentCapacity,
        apartmentsCount : apartment.apartmentsCount
     }));
     populateTable();
  })
}
function populateTable() {
   const table = $("#table1").DataTable();
   table.clear().draw(); // Clear existing data from the table
   
   apartments.forEach(apartment => {
      const row = constructTableRow(apartment);
      table.row.add($(row)).draw();
   });
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
               <button type="button" class="btn btn-outline-danger btn-sm action-button remove-apartment-btn" data-id="${apartment.id}" data-number="${apartment.number}" title="Remove"><i class="fas fa-trash"></i> Delete</button>
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

   const buildingSelect = $('#apartmentBuildingNumber');
   buildingSelect.empty();
   buildingSelect.append(`<option value="" disabled selected>Select Building</option>`);
   buildings.forEach(building => {
      buildingSelect.append(`<option value="${building.id}">${building.number}</option>`);
   });
}

function getNewApartmentData(){
   const apartmentNumber = $('#apartmentNumber').val();
   const buildingId = $('#apartmentBuildingNumber').val();


   if (!apartmentNumber || !buildingId) {
      handleWarning("Please Fill All Fields !");
      return;
   }

   const apartmentData = {
      number: apartmentNumber,
      buildingId: buildingId,
   };

   return apartmentData;
}



function handleAddApartment() {

   
   const apartmentData = getNewApartmentData();

   confirmAction("Confirm Complete", `Are you sure you want to add the apartment ${apartmentData.number}?`)
    .then(() => {
       postDataDB("apartment/add", { apartmentNumber : apartmentData.number , buildingId : apartmentData.buildingId })
          .then(() => handleSuccess(`apartment ${apartmentData.number} has been added successfully.`))
          .catch(() => handleFailure(`Failed to add the apartment ${apartmentData.number}. Please try again later.`));
    })
    .catch(() => console.log('Add action canceled'));
}


function handleRemoveApartment(apartmentId, apartmentNumber) {

   confirmAction("Confirm Remove", `Are you sure you want to remove the apartment ${apartmentNumber}?`)
   .then(() => {
      deleteDataDB("apartment/remove", { apartmentId : apartmentId })
         .then(() => handleSuccess(`apartment ${apartmentNumber} has been removed successfully.`))
         .catch(() => handleFailure(`Failed to remove the apartment ${apartmentNumber}. Please try again later.`));
   })
   .catch(() => console.log('Complete action canceled'));
}



function downloadExcel() {
   const csvHeader = ["Apartment Number", "Building", "Room (vacant)"];
   const csvRows = [csvHeader];

   apartments.forEach(apartment => {
       const row = [
         apartment.number,
         apartment.building,
         apartment.vacantRoom,
       ];
       csvRows.push(row);
   });

   const wb = XLSX.utils.book_new();
   const ws = XLSX.utils.aoa_to_sheet(csvRows);
   XLSX.utils.book_append_sheet(wb, ws, "Apartments");

   const now = new Date();
   const year = now.getFullYear();
   const month = String(now.getMonth() + 1).padStart(2, '0');
   const day = String(now.getDate()).padStart(2, '0');
   const hours = String(now.getHours()).padStart(2, '0');
   const minutes = String(now.getMinutes()).padStart(2, '0');
   const seconds = String(now.getSeconds()).padStart(2, '0');

   const filename = `apartments${year}-${month}-${day}_${hours}-${minutes}-${seconds}.xlsx`;

   XLSX.writeFile(wb, filename);
}

// Document Ready Function
$(document).ready(function () {
   applyBlurEffect();
   showLoader();

   // Simulate fetching data after a delay
   setTimeout(() => {
      fetchApartments();
      populateTable();
      fetchBuildings();
      hideLoader();
      removeBlurEffect();
   }, 1000); // Simulate 5 seconds delay for fetching data

   // Attach event listeners to buttons
   attachEventListener('.remove-apartment-btn', 'click', handleRemoveApartment);
   attachEventListener('.add-apartment-btn', 'click', handleAddApartment);

   attachEventListener('.csv-btn', 'click', downloadExcel);
});




