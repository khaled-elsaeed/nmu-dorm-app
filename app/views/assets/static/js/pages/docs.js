// Utility Functions
import { confirmAction, handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader, postDataDB, deleteDataDB, getDataDB, updateDataDB } from "../helper/utils.js";

// Global variable for member data
let memberDocs = [];

// Function to simulate fetching data
async function fetchMembersDocs() {
    memberDocs = await getDataDB('member/getMembersDocs');
    await populateTable();
}

async function populateTable() {
    const table = $("#table1").DataTable();
    table.clear().draw(); // Clear existing data from the table
    
    memberDocs.forEach(memberDoc => {
       const row = constructTableRow(memberDoc);
       table.row.add($(row)).draw();
    });
 }
 

// Function to construct a table row
function constructTableRow(memberDoc) {
    const statusBadge = generateStatusBadge(memberDoc.status);
    const actionBtns = generateActionBtns(memberDoc.status, memberDoc.id);
    return `
        <tr>
            <td>${memberDoc.username}</td>
            <td>${memberDoc.registrationDate}</td>
            <td>${statusBadge}</td>
            <td>${actionBtns}</td>
            <td></td>
        </tr>
    `;
}

function generateStatusBadge(status) {
    const badgeMap = {
        'paid': '<span class="badge bg-success">Paid</span>',
        'pending': '<span class="badge bg-danger">Pending</span>',
    };
    return badgeMap[status] || `<span class="badge">${status}</span>`;
}

function generateActionBtns(status, id) {
    const btnMap = {
        'paid': `<button type="button" class="btn btn-outline-primary btn-sm m-1" id="viewDocs" data-id="${id}" title="Show Docs"><i class="fas fa-play"></i> View</button>`,
        'pending': `
            <button type="button" class="btn btn-outline-primary btn-sm m-1" id="viewDocs" data-id="${id}" title="Show Docs"><i class="fas fa-play"></i> View</button>
            <button type="button" class="btn btn-outline-success btn-sm m-1" id="acceptDocsBtn" data-id="${id}" title="Accept"><i class="fas fa-check"></i> Accept</button>
            <button type="button" class="btn btn-outline-danger btn-sm m-1" id="rejectDocsBtn" data-id="${id}" title="Reject"><i class="fas fa-times"></i> Reject</button>
        `,
    };
    return btnMap[status] || '';
}



// Function to update the modal content
function updateModalContent(memberId) {
    const member = memberDocs.find(s => s.id === memberId);
    if (member) {
        const modalContent = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Profile Picture</h6>
                    <img src="/nmu-dorm-app/app/storage/uploads/${member.profilePicturePath}" alt="Profile Picture" class="img-fluid">
                </div>
                <div class="col-md-6">
                    <h6>Invoice</h6>
                    <img src="/nmu-dorm-app/app/storage/uploads/${member.invoicePath}" alt="Invoice" class="img-fluid">
                </div>
            </div>
            <div class="mt-3">
                <h6>Member Information</h6>
                <p><strong>Name:</strong> ${member.username}</p>
                <p><strong>Email:</strong> ${member.email}</p>
            </div>
        `;
        $(".modal-body").html(modalContent);
    }
}

// Document Ready Function
$(document).ready(function () {
    applyBlurEffect();
    showLoader();
    // Simulate fetching data after a delay
    setTimeout(async () => {
       await fetchMembersDocs();
        hideLoader();
        removeBlurEffect();
    }, 500); 

    // Event delegation for view-docs buttons
    $(document).on('click', '#viewDocs', function () {
        const button = $(this); 
        const memberId = button.data('id'); 
        updateModalContent(memberId); 
        $('#viewDocsModal').modal('show');
    });

    $(document).on('click', '#acceptDocsBtn', async function () {
        const button = $(this); 
        const memberDocId = button.data('id');
        confirmAction("Confirm Paid","Are you sure All Docs is Ok ?")
        .then(async()=>{
            await updateDataDB('member/updateMemberDocsStatus',{paymentId : memberDocId,status:'paid'})
            await fetchMembersDocs();
            handleSuccess("Member has been paid");
        })
        });
});
