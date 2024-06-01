function getCurrentURL() {
    const fullURL = window.location.href;
    console.log('Full URL:', fullURL);
    const queryString = window.location.search;
    console.log('Query String:', queryString);
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    console.log('ID:', id);
}

document.addEventListener("DOMContentLoaded", function() {
    // Select page content and add blur effect
    const pageContent = document.querySelector('#page-main');
    pageContent.classList.add('blur');

    // Create loader container
    const loaderContainer = document.createElement('div');
    loaderContainer.className = 'backdrop';
    document.body.appendChild(loaderContainer);

    // Load Lottie animation
    const animData = {
        container: loaderContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '../assets/static/loader/loader.json' // Path to your Lottie JSON file
    };

    lottie.loadAnimation(animData);

    // Simulate fetching data after a delay
    setTimeout(() => {
        const mockData = {
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
        populateForm(mockData);
        hideLoader(loaderContainer);
        pageContent.classList.remove('blur'); // Remove blur effect
    }, 10000); // Simulate 5 seconds delay for fetching data
});

// Function to populate form with data
function populateForm(data) {
    // Implement your form population logic here
}

// Function to hide loader
function hideLoader(loaderContainer) {
    if (loaderContainer) {
        loaderContainer.remove();
    }
}






async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/getResidentData'); // Replace with your actual API endpoint
        const data = await response.json();
        populateForm(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        hideLoader();
    }
}

function populateForm(data) {
    document.getElementById('firstName').value = data.firstName;
    document.getElementById('lastName').value = data.lastName;
    document.getElementById('gender').value = data.gender;
    document.getElementById('residentId').value = data.residentId;
    document.getElementById('score').value = data.score;
    document.getElementById('moveInDate').value = data.moveInDate;
    document.getElementById('email').value = data.email;
    document.getElementById('password').value = data.password;
    document.getElementById('lastLogin').value = data.lastLogin;
    document.getElementById('universityEmail').value = data.universityEmail;
    document.getElementById('mobileNumber').value = data.mobileNumber;
    document.getElementById('birthdate').value = data.birthdate;
    document.getElementById('governorate').value = data.governorate;
    document.getElementById('city').value = data.city;
    document.getElementById('street').value = data.street;
    document.getElementById('additionalInfo').value = data.additionalInfo;
    document.getElementById('faculty').value = data.faculty;
    document.getElementById('program').value = data.program;
    document.getElementById('level').value = data.level;
    document.getElementById('cgpa').value = data.cgpa;
    document.getElementById('certifificate').value = data.certifificate;
    document.getElementById('certifificateScore').value = data.certifificateScore;
    document.getElementById('relation').value = data.relation;
    document.getElementById('parentFirstName').value = data.parentFirstName;
    document.getElementById('parentLastName').value = data.parentLastName;
    document.getElementById('parentEmail').value = data.parentEmail;
    document.getElementById('parentPhone').value = data.parentPhone;
    document.getElementById('emergencyFirstName').value = data.emergencyFirstName;
    document.getElementById('emergencyLastName').value = data.emergencyLastName;
    document.getElementById('emergencyRelation').value = data.emergencyRelation;
    document.getElementById('emergencyPhone').value = data.emergencyPhone;
}
