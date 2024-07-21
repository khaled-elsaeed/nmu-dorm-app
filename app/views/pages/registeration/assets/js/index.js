/* 
  Function to fetch and post data from the specified URL using async/await.
*/
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        
        return null;
    }
}

// async function postData(url, payload) {
//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(payload)
//         });
        
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
        
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('There was a problem with the POST operation:', error);
//         return null;
//     }
// }


/* 
  Function to fetch nationalities from json files and populate them in select
*/

async function fetchNationalites() {
    try {
        const nationalities = await fetchData("assets/data/nationalities.json");
        return nationalities;
    } catch (error) {
        console.error('Error fetching nationalities:', error);
        return [];
    }
}


async function populateNationalites() {
    const nationalitiesSelect = document.getElementById("nationality");
    try {
        const nationalities = await fetchNationalites();

        
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a nationality";
        defaultOption.value = ""; 
        defaultOption.disabled = true; 
        defaultOption.selected = true; 
        nationalitiesSelect.appendChild(defaultOption);

        
        nationalities.forEach(nationality => {
            const option = document.createElement("option");
            option.textContent = nationality;
            option.value = nationality;
            nationalitiesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating nationalities:', error);
    }
}

populateNationalites();





/* 
  Function to fetch governorates and cities from json files and populate them in select
*/

async function fetchGovernorates() {
    try {
        const governorates = await fetchData("assets/data/governorates.json");
        return governorates[2].data;
    } catch (error) {
        console.error('Error fetching governorates:', error);
        return [];
    }
}


async function populateGovernorates() {
    const governoratesSelect = document.getElementById("governorate");
    try {
        const governorates = await fetchGovernorates();

        
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a governorate";
        defaultOption.value = ""; 
        defaultOption.disabled = true; 
        defaultOption.selected = true; 
        governoratesSelect.appendChild(defaultOption);

        
        governorates.forEach(governorate => {
            const option = document.createElement("option");
            option.textContent = governorate.governorate_name_en;
            option.value = governorate.governorate_name_en;
            option.setAttribute("data-governorateid", governorate.id); 
            governoratesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating governorates:', error);
    }
}


let cities = [];
async function fetchCities() {
    try {
        const data = await fetchData("assets/data/cities.json");
        cities =  data[2].data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
}


async function populateCities(governorateId) {
    const filteredCities = cities.filter(city => city.governorate_id === governorateId);

    const citiesSelect = document.getElementById("city");
    
    citiesSelect.innerHTML = "";
    try {
        
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a city";
        defaultOption.value = ""; 
        defaultOption.disabled = true; 
        defaultOption.selected = true; 
        citiesSelect.appendChild(defaultOption);

        
        filteredCities.forEach(city => {
            const option = document.createElement("option");
            option.textContent = city.city_name_en;
            option.value = city.city_name_en;
            option.setAttribute("data-cityid", city.id); 
            citiesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating cities:', error);
    }
}


const governorateSelect = document.getElementById("governorate");
governorateSelect.addEventListener("change", function() {
    const selectedOption = governorateSelect.options[governorateSelect.selectedIndex];
    const governorateId = selectedOption.getAttribute("data-governorateid");
    populateCities(governorateId);
});


populateGovernorates();
fetchCities();

/* 
  Function to fetch faculties and programs from json files and populate them in select
*/


async function fetchFaculties() {
    try {
        const faculties = await fetchData("assets/data/faculties.json");
        return faculties[2].data;
    } catch (error) {
        console.error('Error fetching faculties:', error);
        return [];
    }
}


async function populateFaculties() {
    const facultiesSelect = document.getElementById("faculty");
    try {
        const faculties = await fetchFaculties();

        
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a faculty";
        defaultOption.value = ""; 
        defaultOption.disabled = true; 
        defaultOption.selected = true; 
        facultiesSelect.appendChild(defaultOption);

        
        faculties.forEach(faculty => {
            const option = document.createElement("option");
            option.textContent = faculty.faculty_name_en;
            option.value = faculty.faculty_name_en;
            option.setAttribute("data-facultyid", faculty.id); 
            facultiesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating faculties:', error);
    }
}


let programs = [];
async function fetchPrograms() {
    try {
        const data = await fetchData("assets/data/programs.json");
        programs =  data[2].data;
    } catch (error) {
        console.error('Error fetching programs:', error);
        return [];
    }
}


async function populatePrograms(facultyId) {
    const filteredPrograms = programs.filter(program => program.faculty_id == facultyId);

    const programsSelect = document.getElementById("program");
    programsSelect.removeAttribute('disabled')
    programsSelect.innerHTML = "";
    try {
        
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a program";
        defaultOption.value = ""; 
        defaultOption.disabled = true; 
        defaultOption.selected = true; 
        programsSelect.appendChild(defaultOption);

        
        filteredPrograms.forEach(program => {
            const option = document.createElement("option");
            option.textContent = program.program_name_en;
            option.value = program.program_name_en;
            option.setAttribute("data-programid", program.id); 
            programsSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating programs:', error);
    }
}


const facultySelect = document.getElementById("faculty");
facultySelect.addEventListener("change", function() {
    const selectedOption = facultySelect.options[facultySelect.selectedIndex];
    const facultyId = selectedOption.getAttribute("data-facultyid");
    populatePrograms(facultyId);
});


populateFaculties();
fetchPrograms();

/* 
  Function to show and hide input of cgpa or certification  type & score depending on level selection
*/

var levelSelect = document.querySelector('select[name="level"]');
var cgpaContainer = document.getElementById('cgpaContainer');
var certContainer = document.getElementById('certContainer');
var cgpaInput = document.querySelector('input[name="cgpa"]');
var certTypeSelect = document.querySelector('select[name="certificate"]');
var scoreInput = document.querySelector('input[name="certificateScore"]');

function toggleInputs() {
    if (levelSelect.value === "0") {
        cgpaContainer.style.display = "none";
        cgpaInput.value = ""; 
        certContainer.style.display = "block";
    } else {
        cgpaContainer.style.display = "block";
        certContainer.style.display = "none";
        certTypeSelect.value = ""; 
        scoreInput.value = ""; 
    }
}

// Initially hide both inputs
cgpaContainer.style.display = "none";
certContainer.style.display = "none";


levelSelect.addEventListener("change", toggleInputs);




document.getElementById("profilePicture").onchange = function() {
    const file = this.files[0];

    const profileContainer = document.getElementById("profilePictureContainer");
    profileContainer.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
};









function resetForm(event) {
    event.preventDefault(); 
    document.querySelector("form").reset(); 
}

async function gatherFormData() {
    const form = document.getElementById('formnew');
    console.log(form.data);
    const formData = new FormData(form);
    
    // Handle file inputs separately
    const fileInput = document.getElementById('invoice_file');
    const files = fileInput.files;
    if (files.length > 0) {
        formData.append('invoice_file', files[0]); // Assuming you only have one file input
    }

    // Log the FormData object to the console
    console.log("Form Data:", formData);
    
    return formData;
}

function displayResponseMessage(responseType, rejectDetails) {
    const error = "Sorry Service unavailable "
    const successMessage = "Thank you for your submission!";
    const rejectMessage = "We are sorry!";
    const rejectMessageWithDetails = `We are sorry! ${rejectDetails}`;

    const responseMessage = document.getElementById("response-message");
    if (responseType === "reject") {
        responseMessage.textContent = rejectDetails ? rejectMessageWithDetails : rejectMessage;
    } else if (responseType == true) {
        responseMessage.textContent = successMessage;
    }else{
        responseMessage.textContent = error;

    }

    const formContainer = document.getElementById('form');
    const responseContainer = document.getElementById("response-container");

    formContainer.style.display = 'none'; 
    responseContainer.style.display = 'block'; 
}



// Function to get the root URL of the application
function getRootUrl() {
    const currentUrl = window.location.href;
    const index = currentUrl.indexOf("nmu-dorm-app");
    const rootUrl = currentUrl.substring(0, index + "nmu-dorm-app".length);
    return `${rootUrl}/app/api/?action=`;
}

// Hashing and Encoding Functions
async function hashAction(action) {
    const encoder = new TextEncoder();
    const data = encoder.encode(action);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return btoa(hashHex);
}

function encodeData(data) {
    const jsonString = JSON.stringify(data);
    const encodedData = btoa(jsonString);
    return encodeURIComponent(encodedData);
}

// Database Interaction Functions
async function postDataDB(action, data) {
    const encodedAction = await hashAction(action);
    const encodedData = encodeData(data);
    const rootUrl = getRootUrl();
    const url = `${rootUrl}${encodedAction}`;
    const response = await postData(url, encodedData);
    return response;
}

// AJAX Request Function
function ajaxRequest(method, url, data, successCallback, errorCallback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    successCallback(response.data || null);
                } else {
                    errorCallback(response.error);
                }
            } else {
                errorCallback('HTTP Error: ' + xhr.status);
            }
        }
    };
    xhr.send(JSON.stringify(data));
}

// Post Data Function
function postData(url, data) {
    return new Promise((resolve, reject) => {
        ajaxRequest('POST', url, data, resolve, reject);
    });
}

// Form Submission Function
async function submitForm(event) {
    event.preventDefault();
    
    const form = document.querySelector('form');
    
    try {
        if (form.checkValidity()) {
            const formData = new FormData(form);
            await postDataDB("resident/createAccount", formData);
            displayResponseMessage(true);

        } 
    } catch (error) {
        displayResponseMessage(false, error);
        form.reset();
    }
}


const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

 function applyBlurEffect() {
    const pageContent = document.querySelector('.container');
    pageContent.classList.add('blur');
}

 function removeBlurEffect() {
    const pageContent = document.querySelector('.container');
    pageContent.classList.remove('blur');
}

 function showLoader() {
    const loaderContainer = document.getElementById('preloader');
    loaderContainer.className = 'preloader';
    document.body.appendChild(loaderContainer);

    const rootUrl = window.location.origin; // Get the root URL dynamically
    const animData = {
        container: loaderContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `${rootUrl}/nmu-dorm-app/app/views/assets/static/loader/loader.json` // Construct the full path to the Lottie JSON file
    };

    lottie.loadAnimation(animData);
}

 function hideLoader() {
    const loaderContainer = document.querySelector('.preloader');
    const app = document.querySelector('.container');
    app.style.opacity = 100;
    if (loaderContainer) {
        loaderContainer.remove();
    }
}

// Document Ready Function
$(document).ready(function () {
    applyBlurEffect();
    showLoader();
 
    // Simulate fetching data after a delay
    setTimeout(() => {
       hideLoader();
       removeBlurEffect();
    }, 1000); // Simulate 5 seconds delay for fetching data

 });