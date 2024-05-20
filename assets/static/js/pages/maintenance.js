let maintenanceRequests = [];

// Fetch maintenance requests (simulated)
function fetchMaintenanceRequests() {
    // Simulate fetch call
         maintenanceRequests = [
        {
            id: 1,
            name: 'Khaled Tahran',
            location: 'B1A12R5',
            date: '2024-05-01',
            equipment: 'Generator',
            description: 'Oil change and filter replacement',
            technician: 'John Doe',
            status: 'complete'
        },
        {
            id: 2,
            name: 'Ahmed Ali',
            location: 'B2A13R6',
            date: '2024-05-03',
            equipment: 'HVAC System',
            description: 'Routine maintenance',
            technician: 'null',
            status: 'pending'
        },
        {
            id: 3,
            name: 'Fatima Ibrahim',
            location: 'B3A14R7',
            date: '2024-05-05',
            equipment: 'Fire Alarm',
            description: 'Emergency repair',
            technician: 'null',
            status: 'inProgress'
        },
        {
            id: 4,
            name: 'Youssef Mansour',
            location: 'B4A15R8',
            date: '2024-05-07',
            equipment: 'Electrical Panel',
            description: 'System upgrade',
            technician: 'null',
            status: 'pending'
        },
        {
            id: 5,
            name: 'Layla Mohamed',
            location: 'B5A16R9',
            date: '2024-05-09',
            equipment: 'Plumbing System',
            description: 'Component replacement',
            technician: 'null',
            status: 'inProgress'
        },
        {
            id: 6,
            name: 'Omar Hassan',
            location: 'B6A17R10',
            date: '2024-05-11',
            equipment: 'Generator',
            description: 'Routine maintenance',
            technician: 'Ali Ahmed',
            status: 'complete'
        },
        {
            id: 7,
            name: 'Hana Samir',
            location: 'B7A18R11',
            date: '2024-05-13',
            equipment: 'HVAC System',
            description: 'Emergency repair',
            technician: 'null',
            status: 'pending'
        },
        {
            id: 8,
            name: 'Mahmoud Said',
            location: 'B8A19R12',
            date: '2024-05-15',
            equipment: 'Fire Alarm',
            description: 'System upgrade',
            technician: 'Karim Mahmoud',
            status: 'inProgress'
        },
        {
            id: 9,
            name: 'Nour Adel',
            location: 'B9A20R13',
            date: '2024-05-17',
            equipment: 'Electrical Panel',
            description: 'Routine maintenance',
            technician: 'null',
            status: 'complete'
        },
        {
            id: 10,
            name: 'Sara Amr',
            location: 'B10A21R14',
            date: '2024-05-19',
            equipment: 'Plumbing System',
            description: 'Component replacement',
            technician: 'null',
            status: 'pending'
        },
        {
            id: 11,
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



function generateActionContent(status, id, room) {
    switch (status) {
        case 'complete':
            return 'No action';
        case 'pending':
            return `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-primary btn-sm action-button" title="Start" onclick="handleStart('${id}','${room}')"><i class="fas fa-play"></i> Start</button>
                <button type="button" class="btn btn-outline-success btn-sm action-button" title="Complete" onclick="handleComplete('${id}','${room}')"><i class="fas fa-check"></i> Complete</button>
                <button type="button" class="btn btn-outline-danger btn-sm action-button" title="Reject" onclick="handleReject('${id}','${room}')"><i class="fas fa-times"></i> Reject</button>
            </div>
            `;
        case 'inProgress':
            return `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-success btn-sm action-button" title="Complete" onclick="handleComplete('${id}','${room}')"><i class="fas fa-check"></i> Complete</button>
                <button type="button" class="btn btn-outline-danger btn-sm action-button" title="End" onclick="handleReject('${id}','${room}')"><i class="fas fa-times"></i> End</button>
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
    const actionContent = generateActionContent(request.status, request.id, request.location);
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
function handleStart(id, room) {
    getText("Enter the name of the person who will take the task", "Name")
        .then((name) => {
            fetchDataDB("tasks/" + id + "/start", { name: name })
                .then(handleSuccess(`Task for room ${room} has been initiated successfully for ${name}.`))
                .catch(() => {
                    handleFailure(`Failed to start the task for room ${room} . Please try again later.`);
                });
        })
        .catch(() => {
            console.log('Input canceled');
        });
}

// Handle reject action
function handleReject(id, room) {
    getText("Enter the reason for rejecting the task", "Description")
        .then((description) => {
            fetchDataDB("tasks/" + id + "/reject", { description: description })
                .then(handleSuccess(`Task for room ${room} has been rejected successfully with reason: ${description}.`))
                .catch(() => {
                    handleFailure(`Failed to reject the task for room ${room} . Please try again later.`);
                });
        })
        .catch(() => {
            console.log('Input canceled');
        });
}

// Handle complete action
function handleComplete(id, room) {
    fetchDataDB("tasks/" + id + "/complete")
        .then(handleSuccess(`Task for room ${room} has been completed successfully.`))
        .catch(() => {
            handleFailure(`Failed to complete the task for room ${room} . Please try again later.`);
        });
}




function populateTable() {
    const table = $("#table1").DataTable();
    maintenanceRequests.forEach(request => {
        const row = constructTableRow(request);
        table.row.add($(row)).draw();
    });
}

// Document ready function
$(document).ready(function () {
    fetchMaintenanceRequests();
    populateTable();
});
