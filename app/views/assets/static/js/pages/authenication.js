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
    
       .then(() => { 
        window.location.href = '../home.html';
       })
       .catch(error => {
           handleFailure(error);
       });
});





