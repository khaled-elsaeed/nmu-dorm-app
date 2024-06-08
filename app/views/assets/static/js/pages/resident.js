// Utility Functions
import { downloadExcel,applyBlurEffect, removeBlurEffect, showLoader, hideLoader} from "../helper/utils.js";


let residents = [];

function fetchResidents() {
    residents = [{
            id: 1,
            name: 'Khaled Tahran',
            location: 'B1A12R5',
            register: '2024-05-01',
            governorate: 'Generator',
            faculty: 'Oil change and filter replacement',
        },
        {
            id: 2,
            name: 'Ahmed Ali',
            location: 'B2A13R6',
            register: '2024-05-03',
            governorate: 'HVAC System',
            faculty: 'Routine resident',

        },
        {
            id: 3,
            name: 'Fatima Ibrahim',
            location: 'B3A14R7',
            register: '2024-05-05',
            governorate: 'Fire Alarm',
            faculty: 'Emergency repair',

        },
        {
            id: 4,
            name: 'Youssef Mansour',
            location: 'B4A15R8',
            register: '2024-05-07',
            governorate: 'Electrical Panel',
            faculty: 'System upgrade',
        },
        {
            id: 5,
            name: 'Layla Mohamed',
            location: 'B5A16R9',
            register: '2024-05-09',
            governorate: 'Plumbing System',
            faculty: 'Component replacement',

        },
        {
            id: 6,
            name: 'Omar Hassan',
            location: 'B6A17R10',
            register: '2024-05-11',
            governorate: 'Generator',
            faculty: 'Routine resident',

        },
        {
            id: 7,
            name: 'Hana Samir',
            location: 'B7A18R11',
            register: '2024-05-13',
            governorate: 'HVAC System',
            faculty: 'Emergency repair',

        },
        {
            id: 8,
            name: 'Mahmoud Said',
            location: 'B8A19R12',
            register: '2024-05-15',
            governorate: 'Fire Alarm',
            faculty: 'System upgrade',

        },
        {
            id: 9,
            name: 'Nour Adel',
            location: 'B9A20R13',
            register: '2024-05-17',
            governorate: 'Electrical Panel',
            faculty: 'Routine resident',

        },
        {
            id: 10,
            name: 'Sara Amr',
            location: 'B10A21R14',
            register: '2024-05-19',
            governorate: 'Plumbing System',
            faculty: 'Component replacement',

        },
        {
            id: 11,
            name: 'Aliyah Kamal',
            location: 'B11A22R15',
            register: '2024-05-21',
            governorate: 'Generator',
            faculty: 'Emergency repair',

        }
    ];

}

function populateTable() {
    const table = $("#table1").DataTable();
    residents.forEach(resident => {
        const row = constructTableRow(resident);
        table.row.add($(row)).draw();
    });
}

function constructTableRow(resident) {
    return `
        <tr>
            <td>
            <div class="d-flex align-items-center">
               <img  src="../assets/compiled/jpg/istockphoto-597958694-612x612.jpg" ralt="Jerome Bell" class="profile-img me-2">
               <div>
                  <div>${resident.name}</div>
                  <div class="text-muted">deanna.curtis@example.com</div>
               </div>
            </div>
            </td>
            <td>${resident.location}</td>
            <td>${resident.register}</td>
            <td>${resident.faculty}</td>
            <td>${resident.governorate}</td>
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
    setTimeout(() => {
        fetchResidents();
        populateTable();
        hideLoader();
        removeBlurEffect();
    }, 1000); // Simulate 5 seconds delay for fetching data

    $(document).on('click', '.more-info-btn', residentMoreInfo);
    $('.csv-btn').on('click', downloadResidentsSheet);

});