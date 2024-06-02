// Utility Functions
import { confirmAction, handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader } from "../helper/utils.js";

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
   maintenanceRequests = [
      { maintenanceId: 1, name: 'Khaled Tahran', location: 'B1A12R5', date: '2024-05-01', equipment: 'Generator', description: 'Oil change and filter replacement', technician: 'John Doe', status: 'complete' },
      { maintenanceId: 2, name: 'Ahmed Ali', location: 'B2A13R6', date: '2024-05-03', equipment: 'HVAC System', description: 'Routine maintenance', technician: null, status: 'pending' },
      { maintenanceId: 3, name: 'Fatima Ibrahim', location: 'B3A14R7', date: '2024-05-05', equipment: 'Fire Alarm', description: 'Emergency repair', technician: null, status: 'inProgress' },
      { maintenanceId: 4, name: 'Youssef Mansour', location: 'B4A15R8', date: '2024-05-07', equipment: 'Electrical Panel', description: 'System upgrade', technician: null, status: 'pending' },
      { maintenanceId: 5, name: 'Layla Mohamed', location: 'B5A16R9', date: '2024-05-09', equipment: 'Plumbing System', description: 'Component replacement', technician: null, status: 'inProgress' },
      { maintenanceId: 6, name: 'Omar Hassan', location: 'B6A17R10', date: '2024-05-11', equipment: 'Generator', description: 'Routine maintenance', technician: 'Ali Ahmed', status: 'complete' },
      { maintenanceId: 7, name: 'Hana Samir', location: 'B7A18R11', date: '2024-05-13', equipment: 'HVAC System', description: 'Emergency repair', technician: null, status: 'pending' },
      { maintenanceId: 8, name: 'Mahmoud Sameh', location: 'B8A19R12', date: '2024-05-15', equipment: 'Fire Alarm', description: 'System upgrade', technician: 'Karim Mahmoud', status: 'inProgress' },
      { maintenanceId: 9, name: 'Nour Adel', location: 'B9A20R13', date: '2024-05-17', equipment: 'Electrical Panel', description: 'Routine maintenance', technician: null, status: 'complete' },
      { maintenanceId: 10, name: 'Sara Amr', location: 'B10A21R14', date: '2024-05-19', equipment: 'Plumbing System', description: 'Component replacement', technician: null, status: 'pending' },
      { maintenanceId: 11, name: 'Aliyah Kamal', location: 'B11A22R15', date: '2024-05-21', equipment: 'Generator', description: 'Emergency repair', technician: null, status: 'inProgress' }
   ];
}

// Populate the Table with Maintenance Requests
function populateTable() {
   const table = $("#table1").DataTable();
   maintenanceRequests.forEach(request => {
      const row = constructTableRow(request);
      table.row.add($(row)).draw();
   });
}

// Construct a Table Row for Each Request
function constructTableRow(request) {
   const statusBadge = generateStatusBadge(request.status);
   const actionContent = generateActionContent(request.status, request.maintenanceId, request.location);
   const technicianName = request.technician ? request.technician : 'No one';
   return `
      <tr>
         <td>${request.name}</td>
         <td>${request.location}</td>
         <td>${request.date}</td>
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

// Generate Action Buttons Based on Status
function generateActionContent(status, maintenanceId, room) {
   switch (status) {
      case 'complete':
         return `<button type="button" class="btn btn-outline-success btn-sm action-button" title="Complete" disabled><i class="fas fa-check"></i> Complete</button>`;
      case 'pending':
         return `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-primary btn-sm action-button start-btn" data-id="${maintenanceId}" data-room="${room}" title="Start"><i class="fas fa-play"></i> Start</button>
                <button type="button" class="btn btn-outline-success btn-sm action-button complete-btn" data-id="${maintenanceId}" data-room="${room}" title="Complete"><i class="fas fa-check"></i> Complete</button>
                <button type="button" class="btn btn-outline-danger btn-sm action-button reject-btn" data-id="${maintenanceId}" data-room="${room}" title="Reject"><i class="fas fa-times"></i> Reject</button>
            </div>`;
      case 'inProgress':
         return `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-success btn-sm action-button complete-btn" data-id="${maintenanceId}" data-room="${room}" title="Complete"><i class="fas fa-check"></i> Complete</button>
                <button type="button" class="btn btn-outline-danger btn-sm action-button reject-btn" data-id="${maintenanceId}" data-room="${room}" title="End"><i class="fas fa-times"></i> End</button>
            </div>`;
      default:
         return '';
   }
}


// Event Handlers for Maintenance Actions
function handleStart(maintenanceId, room) {
   confirmAction("Confirm Start", `Are you sure you want to start the task for room ${room}?`)
      .then(() => {
         getText("Enter the name of the person who will take the task", "Name")
            .then(name => {
               updateDataDB("maintenance/start", { maintenanceId })
                  .then(() => handleSuccess(`Task for room ${room} has been initiated successfully for ${name}.`))
                  .catch(() => handleFailure(`Failed to start the task for room ${room}. Please try again later.`));
            })
            .catch(() => console.log('Input canceled'));
      })
      .catch(() => console.log('Start action canceled'));
}

function handleReject(maintenanceId, room) {
   confirmAction("Confirm Rejection", `Are you sure you want to reject the task for room ${room}?`)
      .then(() => {
         getText("Enter the reason for rejecting the task", "Description")
            .then(description => {
               updateDataDB("maintenance/reject", { maintenanceId })
                  .then(() => handleSuccess(`Task for room ${room} has been rejected successfully with reason: ${description}.`))
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
            .then(() => handleSuccess(`Task for room ${room} has been completed successfully.`))
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
      populateTable();
      hideLoader();
      removeBlurEffect();
   }, 5000); // Simulate 5 seconds delay for fetching data

   // Attach event listeners to buttons
   attachEventListener('.start-btn', 'click', handleStart);
   attachEventListener('.complete-btn', 'click', handleComplete);
   attachEventListener('.reject-btn', 'click', handleReject);
   attachEventListener('.csv-btn', 'click', downloadExcel);
});
