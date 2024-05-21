let maintenanceRequests = [];

// Fetch maintenance requests (simulated)
function fetchMaintenanceRequests() {
   // Simulate fetch call
   maintenanceRequests = [{
         maintenanceId: 1,
         name: 'Khaled Tahran',
         location: 'B1A12R5',
         date: '2024-05-01',
         equipment: 'Generator',
         description: 'Oil change and filter replacement',
         technician: 'John Doe',
         status: 'complete'
      },
      {
         maintenanceId: 2,
         name: 'Ahmed Ali',
         location: 'B2A13R6',
         date: '2024-05-03',
         equipment: 'HVAC System',
         description: 'Routine maintenance',
         technician: 'null',
         status: 'pending'
      },
      {
         maintenanceId: 3,
         name: 'Fatima Ibrahim',
         location: 'B3A14R7',
         date: '2024-05-05',
         equipment: 'Fire Alarm',
         description: 'Emergency repair',
         technician: 'null',
         status: 'inProgress'
      },
      {
         maintenanceId: 4,
         name: 'Youssef Mansour',
         location: 'B4A15R8',
         date: '2024-05-07',
         equipment: 'Electrical Panel',
         description: 'System upgrade',
         technician: 'null',
         status: 'pending'
      },
      {
         maintenanceId: 5,
         name: 'Layla Mohamed',
         location: 'B5A16R9',
         date: '2024-05-09',
         equipment: 'Plumbing System',
         description: 'Component replacement',
         technician: 'null',
         status: 'inProgress'
      },
      {
         maintenanceId: 6,
         name: 'Omar Hassan',
         location: 'B6A17R10',
         date: '2024-05-11',
         equipment: 'Generator',
         description: 'Routine maintenance',
         technician: 'Ali Ahmed',
         status: 'complete'
      },
      {
         maintenanceId: 7,
         name: 'Hana Samir',
         location: 'B7A18R11',
         date: '2024-05-13',
         equipment: 'HVAC System',
         description: 'Emergency repair',
         technician: 'null',
         status: 'pending'
      },
      {
         maintenanceId: 8,
         name: 'Mahmoud SamaintenanceId',
         location: 'B8A19R12',
         date: '2024-05-15',
         equipment: 'Fire Alarm',
         description: 'System upgrade',
         technician: 'Karim Mahmoud',
         status: 'inProgress'
      },
      {
         maintenanceId: 9,
         name: 'Nour Adel',
         location: 'B9A20R13',
         date: '2024-05-17',
         equipment: 'Electrical Panel',
         description: 'Routine maintenance',
         technician: 'null',
         status: 'complete'
      },
      {
         maintenanceId: 10,
         name: 'Sara Amr',
         location: 'B10A21R14',
         date: '2024-05-19',
         equipment: 'Plumbing System',
         description: 'Component replacement',
         technician: 'null',
         status: 'pending'
      },
      {
         maintenanceId: 11,
         name: 'Aliyah Kamal',
         location: 'B11A22R15',
         date: '2024-05-21',
         equipment: 'Generator',
         description: 'Emergency repair',
         technician: 'null',
         status: 'inProgress'
      }
   ];

}


function generateActionContent(status, maintenanceId, room) {
   switch (status) {
      case 'complete':
         return 'No action';
      case 'pending':
         return `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-primary btn-sm action-button" title="Start" onclick="handleStart('${maintenanceId}','${room}')"><i class="fas fa-play"></i> Start</button>
                <button type="button" class="btn btn-outline-success btn-sm action-button" title="Complete" onclick="handleComplete('${maintenanceId}','${room}')"><i class="fas fa-check"></i> Complete</button>
                <button type="button" class="btn btn-outline-danger btn-sm action-button" title="Reject" onclick="handleReject('${maintenanceId}','${room}')"><i class="fas fa-times"></i> Reject</button>
            </div>
            `;
      case 'inProgress':
         return `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-success btn-sm action-button" title="Complete" onclick="handleComplete('${maintenanceId}','${room}')"><i class="fas fa-check"></i> Complete</button>
                <button type="button" class="btn btn-outline-danger btn-sm action-button" title="End" onclick="handleReject('${maintenanceId}','${room}')"><i class="fas fa-times"></i> End</button>
            </div>
            `;
      default:
         return '';
   }
}


// Generate status badge based on status
function generateStatusBadge(status) {
   const badgeMap = {
      'complete': '<span class="badge bg-success">Complete</span>',
      'pending': '<span class="badge bg-warning">Pending</span>',
      'inProgress': '<span class="badge bg-info">In Progress</span>',
   };
   return badgeMap[status] || `<span class="badge">${status}</span>`;
}

function constructTableRow(request) {
   const statusBadge = generateStatusBadge(request.status);
   const actionContent = generateActionContent(request.status, request.maintenanceId, request.location);
   const technicianName = request.technician !== 'null' ? request.technician : 'No one';
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
        </tr>
    `;
}


// Handle start action
function handleStart(maintenanceId, room) {
   confirmAction("Confirm Start", `Are you sure you want to Start the task for room ${room}?`)
      .then(() => {
         getText("Enter the name of the person who will take the task", "Name")
            .then((name) => {
               updateDataDB("maintenance/start", {
                     maintenanceId: maintenanceId
                  })
                  .then(handleSuccess(`Task for room ${room} has been initiated successfully for ${name}.`))
                  .catch(() => {
                     handleFailure(`Failed to start the task for room ${room}. Please try again later.`);
                  });
            })
            .catch(() => {
               console.log('Input canceled');
            });
      })
      .catch(() => {
         console.log('Start action canceled');
      });
}

// Handle reject action
function handleReject(maintenanceId, room) {
   confirmAction("Confirm Rejection", `Are you sure you want to reject the task for room ${room}?`)
      .then(() => {
         getText("Enter the reason for rejecting the task", "Description")
            .then((description) => {
               updateDataDB("maintenance/reject", {
                     maintenanceId: maintenanceId
                  })
                  .then(handleSuccess(`Task for room ${room} has been rejected successfully with reason: ${description}.`))
                  .catch(() => {
                     handleFailure(`Failed to reject the task for room ${room}. Please try again later.`);
                  });
            })
            .catch(() => {
               console.log('Input canceled');
            });
      })
      .catch((error) => {
         console.log(error); // Log the rejection reason
         console.log('Reject action canceled');
      });
}


// Handle complete action
function handleComplete(maintenanceId, room) {
   confirmAction("Confirm Complete", `Are you sure you want to reject the task for room ${room}?`)
      .then(() => {
         updateDataDB("maintenance/complete", {
               maintenanceId: maintenanceId
            })
            .then(handleSuccess(`Task for room ${room} has been completed successfully.`))
            .catch(() => {
               handleFailure(`Failed to complete the task for room ${room} . Please try again later.`);
            });
      })

}


function populateTable() {
   const table = $("#table1").DataTable();
   maintenanceRequests.forEach(request => {
      const row = constructTableRow(request);
      table.row.add($(row)).draw();
   });
}

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
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const filename = `maintenanceRequests_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.xlsx`;

    XLSX.writeFile(wb, filename);
}

// Document ready function
$(document).ready(function () {
   fetchMaintenanceRequests();
   populateTable();
});