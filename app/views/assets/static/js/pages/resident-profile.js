import {applyBlurEffect, removeBlurEffect, showLoader, hideLoader, getDataDB, postDataDB} from "../helper/utils.js";

let residentInfo = [];

async function fetchResidentInfo(memberId) {
    residentInfo = await postDataDB('member/getMemberInfo',{memberId : memberId});
    console.log(residentInfo);
    await populateForms();
}

async function populateForms() {
    document.getElementById('profilePicture').src = "/nmu-dorm-app/app/storage/uploads/"+residentInfo.profilePicturePath;
    document.getElementById('firstName').value = residentInfo.firstName;
    document.getElementById('lastName').value = residentInfo.lastName;
    document.getElementById('userName').innerText = residentInfo.userName;
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
    // document.getElementById('emergencyFirstName').value = residentInfo.emergencyFirstName;
    // document.getElementById('emergencyLastName').value = residentInfo.emergencyLastName;
    // document.getElementById('emergencyRelation').value = residentInfo.emergencyRelation;
    // document.getElementById('emergencyPhone').value = residentInfo.emergencyPhone;
}

// Document Ready Function
$(document).ready(function () {
    applyBlurEffect();
    showLoader();
    // Simulate fetching data after a delay
    setTimeout(async () => {
        const memberId = await ExtratResidentIdFromUrl();
        await fetchResidentInfo(memberId);
        hideLoader();
        removeBlurEffect();
    }, 1000); // Simulate 3 seconds delay for fetching data
});


async function ExtratResidentIdFromUrl() {
    // const fullURL = window.location.href;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    return id;
}




