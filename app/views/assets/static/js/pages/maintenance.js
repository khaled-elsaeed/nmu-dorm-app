// Utility Functions
import { confirmAction,getText,updateDataDB,getDataDB, handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader } from "../helper/utils.js";

function attachEventListener(buttonSelector, eventType, handler) {
   $(document).on(eventType, buttonSelector, function () {
      const maintenanceId = $(this).data('id');
      const room = $(this).data('room');
      handler(maintenanceId, room);
   });
}

// Simulated Maintenance Requests Data
let maintenanceRequests = [];

function fetchMaintenanceRequests() {
   getDataDB("maintenance/getMaintenance")
   .then(data => {
      console.log(data); // Log the data to inspect its structure
      maintenanceRequests = data.map(request => ({
         maintenanceId: request.id,
         name: request.residentName,
         location: request.residentId,
         requestDate: request.requestDate,
         completeDate : request.completeDate,
         equipment: request.equipment,
         description: request.description, 
         technician: request.technician, 
         status: request.status
      }));
      populateTable();
   })

}




function populateTable() {
   const table = $("#table1").DataTable();
   table.clear().draw(); // Clear existing data from the table
   
   maintenanceRequests.forEach(request => {
      const row = constructTableRow(request);
      table.row.add($(row)).draw();
   });
}


// Construct a Table Row for Each Request
function constructTableRow(request) {
   const statusBadge = generateStatusBadge(request.status);
   const actionContent = generateActionContent(request);
   const technicianName = request.technician ? request.technician : 'No one';
   return `
      <tr>
         <td>${request.name}</td>
         <td>${request.location}</td>
         <td>${request.requestDate}</td>
         <td>${request.equipment}</td>
         <td>${request.description}</td>
         <td>${technicianName}</td>
         <td>${statusBadge}</td>
         <td>${actionContent}</td>
      </tr>`;
}

// Generate Status Badges Based on Status
function generateStatusBadge(status) {
   const badgeMap = {
      'complete': '<span class="badge bg-success">Complete</span>',
      'pending': '<span class="badge bg-warning">Pending</span>',
      'inProgress': '<span class="badge bg-info">In Progress</span>',
   };
   return badgeMap[status] || `<span class="badge">${status}</span>`;
}

function generateActionContent(request) {
   const { status, maintenanceId, location, completeDate } = request; // Destructure the request object

   switch (status) {
      case 'complete':
         return `<button type="button" class="btn btn-outline-success btn-sm action-button" title="Complete" disabled>${completeDate ? completeDate : 'Complete'}</button>`;
         case 'pending':
         return `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-primary btn-sm action-button start-btn" data-id="${maintenanceId}" data-room="${location}" title="Start"><i class="fas fa-play"></i> Start</button>
                <button type="button" class="btn btn-outline-success btn-sm action-button complete-btn" data-id="${maintenanceId}" data-room="${location}" title="Complete"><i class="fas fa-check"></i> Complete</button>
                <button type="button" class="btn btn-outline-danger btn-sm action-button reject-btn" data-id="${maintenanceId}" data-room="${location}" title="Reject"><i class="fas fa-times"></i> Reject</button>
            </div>`;
      case 'inProgress':
         return `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-success btn-sm action-button complete-btn" data-id="${maintenanceId}" data-room="${location}" title="Complete"><i class="fas fa-check"></i> Complete</button>
                <button type="button" class="btn btn-outline-danger btn-sm action-button reject-btn" data-id="${maintenanceId}" data-room="${location}" title="End"><i class="fas fa-times"></i> End</button>
            </div>`;
      default:
         return '';
   }
}

function handleStart(maintenanceId, room) {
      confirmAction("Confirm Start", `Are you sure you want to start the task for room ${room}?`)
         .then(() => {
            getText("Enter the name of the person who will take the task", "Name")
               .then(technician => {
                  updateDataDB("maintenance/start", { maintenanceId : maintenanceId ,technician : technician })
                     .then(() => {
                         handleSuccess(`Task for room ${room} has been initiated successfully for ${technician}.`);
                         fetchMaintenanceRequests();
                     })
                     .catch(() => handleFailure(`Failed to start the task for room ${room}. Please try again later.`));
               })
               .catch(() => console.log('Input canceled'));
            })
         .catch(() => console.log('start action canceled'));
}




function handleReject(maintenanceId, room) {
   confirmAction("Confirm Rejection", `Are you sure you want to reject the task for room ${room}?`)
      .then(() => {
         getText("Enter the reason for rejecting the task", "Description")
            .then(description => {
               updateDataDB("maintenance/reject", { maintenanceId })
                  .then(() => {
                      handleSuccess(`Task for room ${room} has been rejected successfully with reason: ${description}.`)
                      fetchMaintenanceRequests();
                     })
                  .catch(() => handleFailure(`Failed to reject the task for room ${room}. Please try again later.`));
            })
            .catch(() => console.log('Input canceled'));
      })
      .catch(() => console.log('Reject action canceled'));
}

function handleComplete(maintenanceId, room) {
   confirmAction("Confirm Complete", `Are you sure you want to complete the task for room ${room}?`)
      .then(() => {
         updateDataDB("maintenance/complete", { maintenanceId })
            .then(() => { 
               handleSuccess(`Task for room ${room} has been completed successfully.`)
               fetchMaintenanceRequests();
            })
            .catch(() => handleFailure(`Failed to complete the task for room ${room}. Please try again later.`));
      })
      .catch(() => console.log('Complete action canceled'));
}


// Download Maintenance Requests as an Excel File
function downloadExcel() {
   const csvHeader = ["Resident", "Room", "Date", "Equipment", "Task Description", "Performed By", "Status"];
   const csvRows = [csvHeader];

   maintenanceRequests.forEach(request => {
      const row = [
         request.name,
         request.location,
         request.date,
         request.equipment,
         request.description,
         request.technician,
         request.status
      ];
      csvRows.push(row);
   });

   const wb = XLSX.utils.book_new();
   const ws = XLSX.utils.aoa_to_sheet(csvRows);
   XLSX.utils.book_append_sheet(wb, ws, "MaintenanceRequests");

   const now = new Date();
   const filename = `maintenanceRequests_${now.toISOString().replace(/[:.]/g, '-')}.xlsx`;

   XLSX.writeFile(wb, filename);
}

// Document Ready Function
$(document).ready(function () {
   applyBlurEffect();
   showLoader();

   // Simulate fetching data after a delay
   setTimeout(() => {
      fetchMaintenanceRequests();
      hideLoader();
      removeBlurEffect();
   });

   // Attach event listeners to buttons
   attachEventListener('.start-btn', 'click', handleStart);
   attachEventListener('.complete-btn', 'click', handleComplete);
   attachEventListener('.reject-btn', 'click', handleReject);
   attachEventListener('.csv-btn', 'click', downloadExcel);
});
