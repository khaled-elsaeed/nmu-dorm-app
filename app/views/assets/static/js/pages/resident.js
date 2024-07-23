// Utility Functions
import {applyBlurEffect, removeBlurEffect, showLoader, hideLoader, postDataDB, deleteDataDB, getDataDB } from "../helper/utils.js";


let residents = [];

async function fetchResidents() {
    residents = await getDataDB('member/getAllMembers');
    await populateTable();
}

async function populateTable() {
    const table = $("#table1").DataTable();
    table.clear().draw();
    residents.forEach(resident => {
        const row = constructTableRow(resident);
        table.row.add($(row)).draw();
    });
}

function constructTableRow(resident) {
    const location = "R"+resident.roomNumber + " / " + "A"+resident.apartmentNumber+" / B"+resident.buildingNumber; 
    return `
        <tr>
            <td>
            <div class="d-flex align-items-center">
               <img  src="/nmu-dorm-app/app/storage/uploads/${resident.profilePicturePath}" ralt="Jerome Bell" class="profile-img me-2">
               <div>
                  <div>${resident.username}</div>
                  <div class="text-muted">${resident.email}</div>
               </div>
            </div>
            </td>
            <td>${location}</td>
            <td>${resident.faculty}</td>
            <td>${resident.program}</td>
            <td>${resident.level}</td>
            <td>${generateActionContent(resident.id)}</td>
        </tr>
    `;
}

function generateActionContent(residentId) {
    return `
                <button type="button" class="btn btn-outline-primary btn-sm action-button more-info-btn" title="More Info" data-id="${residentId}">More Info</button>

            `;
}

// redirection function with resident id 
function residentMoreInfo() {
    console.log("clicked");
    const residentId = $(this).data('id');

    const baseURL = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, "/account-Profile.html");
    const url = `${baseURL}?id=${residentId}`;
    window.location.href = url;
}

function downloadResidentsSheet() {
    const residentHeaders = ["name", "location", "register", "faculty", "governorate"];
    downloadExcel('Residents', residents, residentHeaders);
}


// Document Ready Function
$(document).ready(function () {
    applyBlurEffect();
    showLoader();

    // Simulate fetching data after a delay
    setTimeout( async () => {
        await fetchResidents();
        hideLoader();
        removeBlurEffect();
    }, 1000); // Simulate 5 seconds delay for fetching data

    $(document).on('click', '.more-info-btn', residentMoreInfo);
    $('.csv-btn').on('click', downloadResidentsSheet);

});