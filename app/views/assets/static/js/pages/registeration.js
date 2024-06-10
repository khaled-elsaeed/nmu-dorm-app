import {  handleFailure,postDataDB , handleWarning, handleSuccess } from "../helper/utils.js";


document.getElementById('registerationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    var formData = new FormData(this); // Get form data
    
    var formData = new FormData(event.target);
    var firstName = formData.get('firstName');
    var middleName = formData.get('middleName');
    var lastName = formData.get('lastName');
    var email = formData.get('email');
    var password = formData.get('password');
    var confirmPassword = formData.get('confirmPassword');
    var role = formData.get('role');

    // First Name validation
    if (!firstName) {
        handleWarning('Please enter your first name.');
        return;
    }

    // Middle Name validation
    if (!middleName) {
        handleWarning('Please enter your middle name.');
        return;
    }

    // Last Name validation
    if (!lastName) {
        handleWarning('Please enter your last name.');
        return;
    }

    // Email validation
    if (!validateEmail(email)) {
        handleWarning('Please enter a valid email address.');
        return;
    }


    // Password validation
    if (password.length < 8) {
        handleWarning('Password must be at least 8 characters long.');
        return;
    }

    if (password !== confirmPassword) {
        handleWarning('Passwords do not match.');
        return;
    }

    // Role validation
    if (!role) {
        handleWarning('Please select a role.');
        return;
    }

 
    postDataDB("admin/register", {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        role: role
    })
        .then(response => {
            handleSuccess(response)
        })
        .catch(error => {
            handleFailure(error);
        });
 });

 function validateEmail(email) {
    // Basic email validation regex
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}