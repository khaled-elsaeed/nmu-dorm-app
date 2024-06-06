import {applyBlurEffect, removeBlurEffect, showLoader, hideLoader} from "../helper/utils.js";

let residentInfo = [];

function fetchResidentInfo() {
    residentInfo = {
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        residentId: "123456",
        score: "90",
        moveInDate: "2024-05-31",
        email: "john@example.com",
        password: "password",
        lastLogin: "2024-05-30T15:00",
        universityEmail: "john.doe@university.edu",
        mobileNumber: "1234567890",
        birthdate: "1990-01-01",
        governorate: "Some Governorate",
        city: "Some City",
        street: "123 Main Street",
        additionalInfo: "Additional info goes here",
        faculty: "Faculty of Engineering",
        program: "Computer Science",
        level: "Undergraduate",
        cgpa: "3.8",
        certifificate: "Certification Name",
        certifificateScore: "95",
        relation: "Parent",
        parentFirstName: "Jane",
        parentLastName: "Doe",
        parentEmail: "jane@example.com",
        parentPhone: "9876543210",
        emergencyFirstName: "Emergency",
        emergencyLastName: "Contact",
        emergencyRelation: "Friend",
        emergencyPhone: "5555555555"
    };
}

function populateForms(residentInfo) {
    document.getElementById('firstName').value = residentInfo.firstName;
    document.getElementById('lastName').value = residentInfo.lastName;
    document.getElementById('gender').value = residentInfo.gender;
    document.getElementById('residentId').value = residentInfo.residentId;
    document.getElementById('score').value = residentInfo.score;
    document.getElementById('moveInDate').value = residentInfo.moveInDate;
    document.getElementById('email').value = residentInfo.email;
    document.getElementById('password').value = residentInfo.password;
    document.getElementById('lastLogin').value = residentInfo.lastLogin;
    document.getElementById('universityEmail').value = residentInfo.universityEmail;
    document.getElementById('mobileNumber').value = residentInfo.mobileNumber;
    document.getElementById('birthdate').value = residentInfo.birthdate;
    document.getElementById('governorate').value = residentInfo.governorate;
    document.getElementById('city').value = residentInfo.city;
    document.getElementById('street').value = residentInfo.street;
    document.getElementById('additionalInfo').value = residentInfo.additionalInfo;
    document.getElementById('faculty').value = residentInfo.faculty;
    document.getElementById('program').value = residentInfo.program;
    document.getElementById('level').value = residentInfo.level;
    document.getElementById('cgpa').value = residentInfo.cgpa;
    document.getElementById('certifificate').value = residentInfo.certifificate;
    document.getElementById('certifificateScore').value = residentInfo.certifificateScore;
    document.getElementById('relation').value = residentInfo.relation;
    document.getElementById('parentFirstName').value = residentInfo.parentFirstName;
    document.getElementById('parentLastName').value = residentInfo.parentLastName;
    document.getElementById('parentEmail').value = residentInfo.parentEmail;
    document.getElementById('parentPhone').value = residentInfo.parentPhone;
    document.getElementById('emergencyFirstName').value = residentInfo.emergencyFirstName;
    document.getElementById('emergencyLastName').value = residentInfo.emergencyLastName;
    document.getElementById('emergencyRelation').value = residentInfo.emergencyRelation;
    document.getElementById('emergencyPhone').value = residentInfo.emergencyPhone;
}

// Document Ready Function
$(document).ready(function () {
    applyBlurEffect();
    showLoader();

    // Simulate fetching data after a delay
    setTimeout(() => {
        ExtratResidentIdFromUrl();
        fetchResidentInfo();
        populateForms(residentInfo);
        hideLoader();
        removeBlurEffect();
    }, 1000); // Simulate 3 seconds delay for fetching data

    // Uncomment and define these functions if needed
    // $(document).on('click', '.more-info-btn', residentMoreInfo);
    // $('.csv-btn').on('click', downloadResidentsSheet);
});


function ExtratResidentIdFromUrl() {
    const fullURL = window.location.href;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    console.log('ID:', id);
}




