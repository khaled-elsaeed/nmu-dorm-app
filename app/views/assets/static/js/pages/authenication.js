// Utility Functions
import {  handleFailure,postDataDB , handleWarning } from "../helper/utils.js";

document.getElementById('login-form').addEventListener('submit', function(event) {
   event.preventDefault(); // Prevent form submission
   var formData = new FormData(this); // Get form data
   
   // Example of custom validation
   var email = formData.get('email');
   var password = formData.get('password');

   // Simple validation
   if (!email || !password) {
       handleWarning('Username and password are required.');
       return;
   }

   postDataDB("admin/login", { email: email, password: password })
       .then(response => {
           if (!response.ok) {
               handleFailure('Network response was not ok');
           }
           return response.json(); // Parse the JSON response
       })
       .then(response => {
           console.log(response);
           if (response.success) {
               // showMessage('Login successful. Redirecting...');
               // Redirect to dashboard or any other page
               setTimeout(function() {
                   window.location.href = 'dashboard.html'; // Redirect to dashboard page
               }, 2000); // Redirect after 2 seconds (2000 milliseconds) 
           } else {
               handleFailure(response.error);
           }
       })
       .catch(error => {
           handleFailure(error);
       });
});



