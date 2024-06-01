let residentRequests = [];

function fetchResidentRequests() {
    residentRequests = [{
            residentId: 1,
            name: 'Khaled Tahran',
            location: 'B1A12R5',
            register: '2024-05-01',
            governorate: 'Generator',
            faculty: 'Oil change and filter replacement',
        },
        {
            residentId: 2,
            name: 'Ahmed Ali',
            location: 'B2A13R6',
            register: '2024-05-03',
            governorate: 'HVAC System',
            faculty: 'Routine resident',

        },
        {
            residentId: 3,
            name: 'Fatima Ibrahim',
            location: 'B3A14R7',
            register: '2024-05-05',
            governorate: 'Fire Alarm',
            faculty: 'Emergency repair',

        },
        {
            residentId: 4,
            name: 'Youssef Mansour',
            location: 'B4A15R8',
            register: '2024-05-07',
            governorate: 'Electrical Panel',
            faculty: 'System upgrade',
        },
        {
            residentId: 5,
            name: 'Layla Mohamed',
            location: 'B5A16R9',
            register: '2024-05-09',
            governorate: 'Plumbing System',
            faculty: 'Component replacement',

        },
        {
            residentId: 6,
            name: 'Omar Hassan',
            location: 'B6A17R10',
            register: '2024-05-11',
            governorate: 'Generator',
            faculty: 'Routine resident',

        },
        {
            residentId: 7,
            name: 'Hana Samir',
            location: 'B7A18R11',
            register: '2024-05-13',
            governorate: 'HVAC System',
            faculty: 'Emergency repair',

        },
        {
            residentId: 8,
            name: 'Mahmoud SaresidentId',
            location: 'B8A19R12',
            register: '2024-05-15',
            governorate: 'Fire Alarm',
            faculty: 'System upgrade',

        },
        {
            residentId: 9,
            name: 'Nour Adel',
            location: 'B9A20R13',
            register: '2024-05-17',
            governorate: 'Electrical Panel',
            faculty: 'Routine resident',

        },
        {
            residentId: 10,
            name: 'Sara Amr',
            location: 'B10A21R14',
            register: '2024-05-19',
            governorate: 'Plumbing System',
            faculty: 'Component replacement',

        },
        {
            residentId: 11,
            name: 'Aliyah Kamal',
            location: 'B11A22R15',
            register: '2024-05-21',
            governorate: 'Generator',
            faculty: 'Emergency repair',

        }
    ];

}



function redirectToPageWithResidentID(residentId) {
    const baseURL = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, "/account-Profile.html");
    const url = `${baseURL}?id=${residentId}`;
    window.location.href = url;
}

// Example function to trigger redirection
function residentMoreInfo(residentId) {
    redirectToPageWithResidentID(residentId);
}


function generateActionContent(residentId) {
    return `
                <button type="button" class="btn btn-outline-primary btn-sm action-button" title="More Info" onclick="residentMoreInfo('${residentId}')">More Info</button>
            `;
}




function constructTableRow(request) {
    return `
        <tr>
            <td>
            <div class="d-flex align-items-center">
               <img  src="../assets/compiled/jpg/istockphoto-597958694-612x612.jpg" ralt="Jerome Bell" class="profile-img me-2">
               <div>
                  <div>${request.name}</div>
                  <div class="text-muted">deanna.curtis@example.com</div>
               </div>
            </div>
            </td>
            <td>${request.location}</td>
            <td>${request.register}</td>
            <td>${request.governorate}</td>
            <td>${request.faculty}</td>
            <td>${generateActionContent(request.residentId)}</td>
        </tr>
    `;
}


// Handle start action
function handleStart(residentId, room) {
    confirmAction("Confirm Start", `Are you sure you want to Start the task for room ${room}?`)
        .then(() => {
            getText("Enter the name of the person who will take the task", "Name")
                .then((name) => {
                    updateDataDB("resident/start", {
                            residentId: residentId
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
function handleReject(residentId, room) {
    confirmAction("Confirm Rejection", `Are you sure you want to reject the task for room ${room}?`)
        .then(() => {
            getText("Enter the reason for rejecting the task", "Description")
                .then((description) => {
                    updateDataDB("resident/reject", {
                            residentId: residentId
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
function handleComplete(residentId, room) {
    confirmAction("Confirm Complete", `Are you sure you want to reject the task for room ${room}?`)
        .then(() => {
            updateDataDB("resident/complete", {
                    residentId: residentId
                })
                .then(handleSuccess(`Task for room ${room} has been completed successfully.`))
                .catch(() => {
                    handleFailure(`Failed to complete the task for room ${room} . Please try again later.`);
                });
        })

}


function populateTable() {
    const table = $("#table1").DataTable();
    residentRequests.forEach(request => {
        const row = constructTableRow(request);
        table.row.add($(row)).draw();
    });
}

function downloadExcel() {
    const csvHeader = ["Resident", "Room", "Register", "Governorate", "Faculty"];

    const csvRows = [csvHeader];

    residentRequests.forEach(request => {
        const row = [
            request.name,
            request.location,
            request.register,
            request.governorate,
            request.faculty,
        ];
        csvRows.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(csvRows);
    XLSX.utils.book_append_sheet(wb, ws, "ResidentRequests");

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const filename = `residentRequests_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.xlsx`;

    XLSX.writeFile(wb, filename);
}

// Document ready function
$(document).ready(function() {
    fetchResidentRequests();
    populateTable();
});