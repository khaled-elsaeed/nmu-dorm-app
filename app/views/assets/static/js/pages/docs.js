// Utility Functions
import { applyBlurEffect, removeBlurEffect, showLoader, hideLoader } from "../helper/utils.js";

// Global variable for resident data
let residentDocs = [];

// Function to simulate fetching data
function fetchresidentDocs() {
    residentDocs = [
        {
            id: "resident1",
            name: "John Doe",
            registrationDate: "2024-05-18",
            status: "Pending",
            profilePicture: "../assets/compiled/jpg/istockphoto-597958694-612x612.jpg",
            invoice: "../assets/compiled/jpg/invoice.jpg",
            email: "john.doe@example.com",
            gpa: 3.8
        },
        {
            id: "resident2",
            name: "Jane Doe",
            registrationDate: "2024-05-19",
            status: "Approved",
            profilePicture: "../assets/compiled/jpg/istockphoto-597958694-612x612.jpg",
            invoice: "../assets/compiled/jpg/invoice.jpg",
            email: "jane.doe@example.com",
            gpa: 3.9
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
                <button type="button" class="btn btn-outline-primary btn-sm view-docs m-1" data-id="${resident.id}" title="Show Docs"><i class="fas fa-play"></i> View</button>
                <button type="button" class="btn btn-outline-success btn-sm accept-docs-btn m-1" data-id="${resident.id}" title="Accept"><i class="fas fa-check"></i> Accept</button>
                <button type="button" class="btn btn-outline-danger btn-sm reject-docs-btn m-1" data-id="${resident.id}" title="Reject"><i class="fas fa-times"></i> Reject</button>
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
                <h6>Resident Information</h6>
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
        fetchresidentDocs(); // Fetch resident data
        populateTable(); // Populate the table with the fetched data
        hideLoader();
        removeBlurEffect();
    }, 1000); // Simulate 3 seconds delay for fetching data

    // Event delegation for view-docs buttons
    $(document).on('click', '.view-docs', function (event) {
        const button = $(this); // Button that triggered the modal
        const residentId = button.data('id'); // Extract info from data-* attributes
        updateModalContent(residentId); // Update the modal content
        $('#viewDocsModal').modal('show');
    });
});
