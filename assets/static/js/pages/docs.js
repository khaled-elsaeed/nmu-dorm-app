// Utility Functions
import { applyBlurEffect, removeBlurEffect, showLoader, hideLoader } from "../helper/utils.js";

// Global variable for resident data
let residentDocs = [];

// Function to simulate fetching data
function fetchresidentDocs() {
    return [
        {
            id: "resident1",
            name: "John Doe",
            registrationDate: "2024-05-18",
            status: "Pending",
            profilePicture: "../assets/compiled/jpg/istockphoto-597958694-612x612.jpg",
            invoice: "../assets/compiled/jpg/invoice.jpg",
            email: "john.doe@example.com",
            gpa: 3.8
        },{
            id: "resident1",
            name: "John Doe",
            registrationDate: "2024-05-18",
            status: "Pending",
            profilePicture: "../assets/compiled/jpg/istockphoto-597958694-612x612.jpg",
            invoice: "../assets/compiled/jpg/invoice.jpg",
            email: "john.doe@example.com",
            gpa: 3.8
        },{
            id: "resident1",
            name: "John Doe",
            registrationDate: "2024-05-18",
            status: "Pending",
            profilePicture: "../assets/compiled/jpg/istockphoto-597958694-612x612.jpg",
            invoice: "../assets/compiled/jpg/invoice.jpg",
            email: "john.doe@example.com",
            gpa: 3.8
        },
        // Add more residents as necessary
    ];
}

// Function to construct a table row
function constructTableRow(resident) {
    return `
        <tr>
            <td>${resident.name}</td>
            <td>${resident.registrationDate}</td>
            <td>${resident.status}</td>
            <td>
                <button type="button" class="btn btn-outline-primary btn-sm m-2" data-id="${resident.id}" title="Show Docs"><i class="fas fa-play"></i> View</button>
                <button type="button" class="btn btn-outline-success btn-sm accept-btn m-2" data-id="${resident.id}" title="Accept"><i class="fas fa-check"></i> Accept</button>
                <button type="button" class="btn btn-outline-danger btn-sm reject-btn m-2" data-id="${resident.id}" title="Reject"><i class="fas fa-times"></i> Reject</button>
            </td>
        </tr>
    `;
}




function populateTable() {
    const table = $("#table1").DataTable();
    residentDocs.forEach(resident => {
        const row = constructTableRow(resident);
        table.row.add($(row)).draw();
    });
}

// Function to update the modal content
function updateModalContent(residentId) {
    console.log("heree");
    const resident = residentDocs.find(s => s.id === residentId);
    if (resident) {
        const modalContent = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Profile Picture</h6>
                    <img src="${resident.profilePicture}" alt="Profile Picture" class="img-fluid">
                </div>
                <div class="col-md-6">
                    <h6>Invoice</h6>
                    <img src="${resident.invoice}" alt="Invoice" class="img-fluid">
                </div>
            </div>
            <div class="mt-3">
                <h6>resident Information</h6>
                <p><strong>Name:</strong> ${resident.name}</p>
                <p><strong>Email:</strong> ${resident.email}</p>
                <p><strong>GPA:</strong> ${resident.gpa}</p>
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
    setTimeout(() => {
        residentDocs = fetchresidentDocs(); // Fetch resident data
        populateTable(); // Populate the table with the fetched data
        hideLoader();
        removeBlurEffect();
    }, 1000); // Simulate 3 seconds delay for fetching data

    $('#detailsModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget); // Button that triggered the modal
        const residentId = button.data('id'); // Extract info from data-* attributes
        updateModalContent(residentId); // Update the modal content
    });
});
