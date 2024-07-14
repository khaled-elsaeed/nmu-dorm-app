// Utility Functions
import { confirmAction, handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader, postDataDB, deleteDataDB, getDataDB } from "../helper/utils.js";

function attachEventListener(buttonSelector, eventType, handler) {
    $(document).on(eventType, buttonSelector, function () {
       const apartmentId = $(this).data('id');
       const apartmentNumber = $(this).data('number');
       handler(apartmentId, apartmentNumber);
    });
 }


var apartments = [];
var buildings = [];






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

async function fetchApartments() {
   try {
      const apartmentsData = await getDataDB("dorm/getApartments");
      apartments = apartmentsData;
      await populateTable(); // Wait for table population to complete
   } catch (error) {
      console.error("An error occurred while fetching apartments:", error);
      handleFailure("Failed to fetch apartments. Please try again later.");
   }
}



async function populateTable() {
   const table = $("#table1").DataTable();
   table.clear().draw(); // Clear existing data from the table
   
   apartments.forEach(apartment => {
      const row = constructTableRow(apartment);
      table.row.add($(row)).draw();
   });
}

function constructTableRow(apartment) {
   const occupancyBadge = generateOccupancyBadge(apartment.roomsCount);
   const building = buildings.find( (building)=> building.id === apartment.buildingId)
   console.log(building.number);
   return `
        <tr>
            <td>${apartment.number}</td>
            <td>${building.number}</td>
            <td>${apartment.roomsCount}</td>
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
           postDataDB("dorm/addApartment", { apartmentNumber : apartmentData.number , buildingId : apartmentData.buildingId })
           .then(async () => {
                   await fetchApartments();
                   $('#addApartmentModal').modal('hide');
                   handleSuccess(`Apartment ${apartmentData.number} has been added successfully.`);
               })
               .catch(() => {
                   handleFailure(`Failed to add the apartment ${apartmentData.number}. Please try again later.`);
               });
       })
       .catch(() => {
           console.log('Add action canceled');
       });
}

function handleRemoveApartment(apartmentId, apartmentNumber) {
   const apartment = apartments.find( (apartment)=> apartment.id === apartmentId)
   const building = buildings.find( (building)=> building.id === apartment.buildingId)

   confirmAction("Confirm Remove", `Are you sure you want to remove the apartment ${apartmentNumber} within building ${building.number}?`)
       .then(() => {
           deleteDataDB("dorm/removeApartment", { apartmentId : apartmentId })
               .then(async () => {
                   await fetchApartments();
                   handleSuccess(`apartment ${apartmentNumber} has been removed successfully.`);
               })
               .catch(() => {
                   handleFailure(`Failed to remove the apartment ${apartmentNumber}. Please try again later.`);
               });
       })
       .catch(() => {
           console.log('Complete action canceled');
       });
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
   setTimeout(async () => {
      await fetchBuildings();
      await fetchApartments();
      hideLoader();
      removeBlurEffect();
   }, 1000); // Simulate 5 seconds delay for fetching data

   // Attach event listeners to buttons
   attachEventListener('.remove-apartment-btn', 'click', handleRemoveApartment);
   attachEventListener('.add-apartment-btn', 'click', handleAddApartment);

   attachEventListener('.csv-btn', 'click', downloadExcel);
});




