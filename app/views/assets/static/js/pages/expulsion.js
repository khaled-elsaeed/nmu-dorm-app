// Utility Functions
import { confirmAction, handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader, postDataDB, deleteDataDB, getDataDB } from "../helper/utils.js";

function attachEventListener(buttonSelector, eventType, handler) {
   $(document).on(eventType, buttonSelector, function () {
      const membersId = $(this).data('members-id');
      handler(membersId);
   });
}

// Simulated expelledMembers Data
let expelledMembers = [];

async function fetchExpelledMembers() {
   expelledMembers = await getDataDB('member/getExpelledMembers');
   await populateTable();
}


// Populate the Table with expelledMembers
async function populateTable() {
   const table = $("#table1").DataTable();
   table.clear().draw(); //
   
   expelledMembers.forEach(apartment => {
      const row = constructTableRow(apartment);
      table.row.add($(row)).draw();
   });
}

function constructTableRow(expelledMember) {
   const username = expelledMember.firstName + " " + expelledMember.lastName;
   const statusContent = generateStatusContent(expelledMember.alerts[expelledMember.alerts.length - 1].type, expelledMember.id);
   const actionContent = generateActionContent(expelledMember.alerts[expelledMember.alerts.length - 1].type, expelledMember.id);

   return `
      <tr>
         <td>${username}</td>
         <td>${statusContent.badge}</td>
         <td>${statusContent.icons}</td>
         <td>${expelledMember.expulsionDuration}</td>
         <td>${actionContent}</td>
      </tr>`;
}

function generateStatusContent(status, memberId) {
   const badgeMap = {
      'alert': '<span class="badge bg-info text-dark">Alert</span>',
      'warning': '<span class="badge bg-warning text-dark">Warning</span>',
      'expulsion': '<span class="badge bg-danger">Expulsion</span>',
   };
   const iconMap = {
      'alert': `<i class="fas fa-info-circle text-info icon me-3 fa-lg" data-members-id="${memberId}" data-status="alert"></i>`,
      'warning': `<i class="fas fa-info-circle text-warning icon me-3 fa-lg" data-members-id="${memberId}" data-status="warning"></i>`,
      'expulsion': `<i class="fas fa-info-circle text-danger icon me-3 fa-lg" data-members-id="${memberId}" data-status="expulsion"></i>`,
   };
   
   let icons = iconMap[status] || '';

   // Add both alert and warning icons when status is 'warning'
   if (status === 'warning') {
      icons = iconMap['alert'] + iconMap['warning'];
   } else if (status === 'expulsion') {
      icons = iconMap['alert'] + iconMap['warning'] + iconMap['expulsion'];
   }

   const badge = badgeMap[status] || `<span class="badge">${status}</span>`;

   return {
      badge: badge,
      icons: icons
   };
}

function generateActionContent(status, memberId) {
   switch (status) {
      case 'alert':
         return `<button type="button" class="btn btn-outline-warning btn-sm warning-btn" data-members-id="${memberId}" title="Warning"> Warning</button>`;
      case 'warning':
         return `<button type="button" class="btn btn-outline-danger btn-sm expulsion-btn" data-members-id="${memberId}" title="Expulsion"> Expulsion</button>`;
      case 'expulsion':
         return `<button type="button" class="btn btn-outline-danger btn-sm expulsion-btn" data-members-id="${memberId}" title="Expulsion" disabled> Expulsion</button>`;
      default:
         return '';
   }
}


$(document).on('click', '.icon', function() {
   const membersId = $(this).data('members-id');
   console.log('Member ID:', membersId);

   const status = $(this).data('status');
   console.log('Status:', status);

   // Find the member based on id
   const member = expelledMembers.find(member => parseInt(member.id) === parseInt(membersId));

   if (member) {
      console.log('Member found:', member);
      
      const alert = member.alerts.find(alert => alert.type.toLowerCase() === status.toLowerCase());
      if (alert) {
         console.log('Alert found:', alert);
         $('#descriptionModal').modal('show');
         $('#alertDescription').text(alert.description);
      } else {
         console.log('No alert found for this status');
         $('#descriptionModal').modal('show');
         $('#alertDescription').text("No description available for this alert.");
      }
   } else {
      console.log('No member found for this ID');
      $('#descriptionModal').modal('show');
      $('#alertDescription').text("No description available for this member.");
   }
});




function handleWarning(membersId) {
   confirmAction("Confirm Warning", `Are you sure you want to Warn the members ${membersId}?`)
      .then(() => {
         getText("Enter the reason of Warning", "Description")
            .then(() => {
               updateDataDB("/start", { Id: membersId })
                  .then(() => handleSuccess(`Warning issued successfully for members ${membersId}.`))
                  .catch(() => handleFailure(`Failed to issue warning for members ${membersId}. Please try again later.`));
            })
            .catch(() => console.log('Input canceled'));
      })
      .catch(() => console.log('Warning action canceled'));
}

function handleExpulsion(Id) {
   confirmAction("Confirm Expulsion", `Are you sure you want to expel the members ${Id}?`)
      .then(() => {
         getText("Enter the reason for expulsion", "Description")
            .then(description => {
               updateDataDB("/expel", { Id })
                  .then(() => handleSuccess(`members ${Id} has been expelled successfully with reason: ${description}.`))
                  .catch(() => handleFailure(`Failed to expel members ${Id}. Please try again later.`));
            })
            .catch(() => console.log('Input canceled'));
      })
      .catch(() => console.log('Expulsion action canceled'));
}







// Download expelledMembers as an Excel File
function downloadExcel() {
   const csvHeader = ["Name", "Status", "Description", "Expulsion"];
   const csvRows = [csvHeader];

   expelledMembers.forEach(expelledmembers => {
      const row = [
         expelledmembers.name,
         expelledmembers.status,
         expelledmembers.description,
         expelledmembers.expulsion
      ];
      csvRows.push(row);
   });

   const wb = XLSX.utils.book_new();
   const ws = XLSX.utils.aoa_to_sheet(csvRows);
   XLSX.utils.book_append_sheet(wb, ws, "expelledMembers");

   const now = new Date();
   const filename = `expelledMembers_${now.toISOString().replace(/[:.]/g, '-')}.xlsx`;

   XLSX.writeFile(wb, filename);
}

// Document Ready Function
$(document).ready(function () {
   applyBlurEffect();
   showLoader();

   // Simulate fetching data after a delay
   setTimeout(() => {
      fetchExpelledMembers();
      populateTable();
      hideLoader();
      removeBlurEffect();
   }, 1000); // Simulate 5 seconds delay for fetching data

   // Attach event listeners to buttons
   attachEventListener('.warning-btn', 'click', handleWarning);
   attachEventListener('.expulsion-btn', 'click', handleExpulsion);
   attachEventListener('.csv-btn', 'click', downloadExcel);
});
