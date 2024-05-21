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

function fetchApartments() {

   apartments = [{
         id: 2,
         number: 1,
         building: 2,
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

function populateBuildingSelect() {

   const buildingSelect = $('#apartmentBuildingNumber');
   buildingSelect.empty();
   buildingSelect.append(`<option value="" disabled selected>Select Building</option>`);
   buildings.forEach(building => {
      buildingSelect.append(`<option value="${building.id}">${building.number}</option>`);
   });
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

function populateTable() {

   const table = $("#table1").DataTable();
   apartments.forEach(apartment => {
      const row = constructTableRow(apartment);
      table.row.add($(row)).draw();
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
   const filename = `apartments_${now.toISOString().replace(/[:]/g, '-')}.xlsx`;

   XLSX.writeFile(wb, filename);
}

function handleDeleteApartment(id, apartmentNumber) {

   const apartmentData = {
      apartmentId: id
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

function handleAddApartment() {

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


   confirmAction('Confirm Addition', `Are you sure you want to add apartment ${apartmentData.number}?`)
      .then(() => {

         return postDataDB("apartment/create", apartmentData);
      })
      .then(() => {
         handleSuccess(`Apartment ${apartmentData.number} has been added successfully.`);

         clearInputFields(['apartmentNumber', 'apartmentBuildingNumber']);

         $('#addApartmentModal').modal('hide');
      })
      .catch((error) => {
         if (error !== 'User cancelled the action') {
            handleFailure(`Failed to add apartment ${apartmentData.number}. Please try again later. Error: ${error}`);
            $('#addApartmentModal').modal('hide');
         }
      });
}


$(document).ready(function () {
   fetchApartments();
   populateTable();
   fetchBuildings();
   $("#addApartmentBtn").on("click", function () {
      handleAddApartment();
   });
});