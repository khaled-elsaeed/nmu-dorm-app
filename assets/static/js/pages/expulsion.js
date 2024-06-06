// Utility Functions
import { confirmAction, getText, updateDataDB, handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader } from "../helper/utils.js";

function attachEventListener(buttonSelector, eventType, handler) {
   $(document).on(eventType, buttonSelector, function () {
      const residentId = $(this).data('resident-id');
      handler(residentId);
   });
}

// Simulated expelledResidents Data
let expelledResidents = [];

function fetchExpelledResidents() {
   expelledResidents = [
      {
         name: "John Doe",
         status: "expulsion",
         description: {
            'alert': "bad boy",
            'warning': "hill",
            'expulsion': "badyy"
         },
         id: "1",
         expulsion: "Spring 2024",

      },
      {
         name: "Jane Smith",
         status: "warning",
         description: {
            'alert': null,
            'warning': "Plagiarism in research paper",
            'expulsion': null
         },
         id: "2",expulsion: "N/A",

      },
      {
         name: "David Johnson",
         status: "alert",
         description: {
            'alert': "Low attendance and poor performance in exams",
            'warning': null,
            'expulsion': null
         },
         id: "3",expulsion: "N/A"
      }
   ];
}


// Populate the Table with expelledResidents
function populateTable() {
   const table = $("#table1").DataTable();
   expelledResidents.forEach(expelledresident => {
      const row = constructTableRow(expelledresident);
      table.row.add($(row)).draw();
   });
}

function constructTableRow(expelledresident) {
   const statusContent = generateStatusContent(expelledresident.status, expelledresident.id);
   const actionContent = generateActionContent(expelledresident.status, expelledresident.id);

   return `
      <tr>
         <td>${expelledresident.name}</td>
         <td>${statusContent.badge}</td>
         <td>${statusContent.icons}</td>
         <td>${expelledresident.expulsion}</td>
         <td>${actionContent}</td>
      </tr>`;
}


function generateStatusContent(status, residentId) {
   const badgeMap = {
      'alert': '<span class="badge bg-info text-dark">Alert</span>',
      'warning': '<span class="badge bg-warning text-dark">Warning</span>',
      'expulsion': '<span class="badge bg-danger">Expulsion</span>',
   };
   const iconMap = {
      'alert': `<i class="fas fa-info-circle text-info icon me-3 fa-lg" data-resident-id="${residentId}" data-status="alert"></i>`,
      'warning': `<i class="fas fa-info-circle text-warning icon me-3 fa-lg" data-resident-id="${residentId}" data-status="warning"></i>`,
      'expulsion': `<i class="fas fa-info-circle text-danger icon me-3 fa-lg" data-resident-id="${residentId}" data-status="expulsion"></i>`,
   };
   
   let icons = iconMap[status] || '';

   // Add both alert and warning icons when status is 'warning'
   if (status === 'warning') {
      icons = iconMap['alert'] + iconMap['warning'] ;
   }else if (status ==='expulsion'){
      icons = iconMap['alert'] + iconMap['warning'] + iconMap['expulsion'];
   }

   const badge = badgeMap[status] || `<span class="badge">${status}</span>`;

   return {
      badge: badge,
      icons: icons
   };
}



$(document).on('click', '.icon', function() {
   const residentId = $(this).data('resident-id');
   console.log(residentId);
   const status = $(this).data('status');
   console.log(status);

   const resident = expelledResidents.find(resident =>  parseInt(resident.id) === parseInt(residentId));

   if (resident && status && resident.description[status]) {
      $('#descriptionModal').modal('show');
      $('#alertDescription').text(resident.description[status]);
   } else {
      $('#descriptionModal').modal('show');
      $('#alertDescription').text("No description available for this resident.");
   }
});





function generateActionContent(status, residentId) {
   switch (status) {
      case 'alert':
         return `<button type="button" class="btn btn-outline-warning btn-sm warning-btn" data-resident-id="${residentId}" title="Warning"> Warning</button>`;
      case 'warning':
         return `
               <button type="button" class="btn btn-outline-danger btn-sm expulsion-btn" data-resident-id="${residentId}" title="Expulsion"></i> Expulsion</button>
            `;
      case 'expulsion':
         return `
               <button type="button" class="btn btn-outline-danger btn-sm expulsion-btn" data-resident-id="${residentId}" title="Expulsion" disabled></i> Expulsion</button>
            `;
      default:
         return '';
   }
}

function handleWarning(residentId) {
   confirmAction("Confirm Warning", `Are you sure you want to Warn the resident ${residentId}?`)
      .then(() => {
         getText("Enter the reason of Warning", "Description")
            .then(() => {
               updateDataDB("/start", { Id: residentId })
                  .then(() => handleSuccess(`Warning issued successfully for resident ${residentId}.`))
                  .catch(() => handleFailure(`Failed to issue warning for resident ${residentId}. Please try again later.`));
            })
            .catch(() => console.log('Input canceled'));
      })
      .catch(() => console.log('Warning action canceled'));
}

function handleExpulsion(Id) {
   confirmAction("Confirm Expulsion", `Are you sure you want to expel the resident ${Id}?`)
      .then(() => {
         getText("Enter the reason for expulsion", "Description")
            .then(description => {
               updateDataDB("/expel", { Id })
                  .then(() => handleSuccess(`Resident ${Id} has been expelled successfully with reason: ${description}.`))
                  .catch(() => handleFailure(`Failed to expel resident ${Id}. Please try again later.`));
            })
            .catch(() => console.log('Input canceled'));
      })
      .catch(() => console.log('Expulsion action canceled'));
}







// Download expelledResidents as an Excel File
function downloadExcel() {
   const csvHeader = ["Name", "Status", "Description", "Expulsion"];
   const csvRows = [csvHeader];

   expelledResidents.forEach(expelledresident => {
      const row = [
         expelledresident.name,
         expelledresident.status,
         expelledresident.description,
         expelledresident.expulsion
      ];
      csvRows.push(row);
   });

   const wb = XLSX.utils.book_new();
   const ws = XLSX.utils.aoa_to_sheet(csvRows);
   XLSX.utils.book_append_sheet(wb, ws, "expelledResidents");

   const now = new Date();
   const filename = `expelledResidents_${now.toISOString().replace(/[:.]/g, '-')}.xlsx`;

   XLSX.writeFile(wb, filename);
}

// Document Ready Function
$(document).ready(function () {
   applyBlurEffect();
   showLoader();

   // Simulate fetching data after a delay
   setTimeout(() => {
      fetchExpelledResidents();
      populateTable();
      hideLoader();
      removeBlurEffect();
   }, 1000); // Simulate 5 seconds delay for fetching data

   // Attach event listeners to buttons
   attachEventListener('.warning-btn', 'click', handleWarning);
   attachEventListener('.expulsion-btn', 'click', handleExpulsion);
   attachEventListener('.csv-btn', 'click', downloadExcel);
});
