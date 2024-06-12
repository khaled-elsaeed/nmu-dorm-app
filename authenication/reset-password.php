<?php
require_once('../../includes/functions.php'); 
start_secure_session();
$csrfToken = generate_csrfToken();
$_SESSION['csrfToken'] = $csrfToken;

?>
<!DOCTYPE html>
<html lang="en"> 
<head>
    <title>Reset Password</title>
    
    <!-- Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <meta name="description" content="Portal - Bootstrap 5 Admin Dashboard Template For Developers">
    <meta name="author" content="Xiaoying Riley at 3rd Wave Media">    
    <link rel="shortcut icon" href="assets/images/icons/nmudorm.ico"> 
    
    <!-- FontAwesome JS-->
    <script defer src="assets/plugins/fontawesome/js/all.min.js"></script>
    
    <!-- App CSS -->  
    <link id="theme-style" rel="stylesheet" href="assets/css/portal.css">
    <link rel="stylesheet" href="assets/css/login.css">

</head> 

<body class="app app-reset-password p-0">    	
    <div class="row g-0 app-auth-wrapper">
	    <div class="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5">
		    <div class="d-flex flex-column align-content-end">
			    <div class="app-auth-body mx-auto">	
				<div class="app-auth-branding mb-4"><img class="logo-icon me-2" src="assets\img\login_page\app-logo.svg" alt="logo"></div>
					<h2 class="auth-heading text-center mb-4">Password Reset</h2>

					<div class="auth-intro mb-4 text-center">Enter your email address or student id below. We'll email you a link to a page where you can easily create a new password.</div>
	
					<div class="auth-form-container text-left">
						
						<form class="auth-form resetpass-form">                
							<div class="email mb-3">
								<label class="sr-only" for="reg-email">Your Email</label>
								<input id="reg-email" name="reg-email" type="email" class="form-control login-email" placeholder="University Email or Student Id" required="required">
							</div><!--//form-group-->
							<div class="text-center">
								<button type="submit" class="btn app-btn-primary btn-block theme-btn mx-auto">Reset Password</button>
							</div>
						</form>
						
						<div class="auth-option text-center pt-5"><a class="app-link" href="login.php" >Log in</a> </div>
					</div><!--//auth-form-container-->


			    </div><!--//auth-body-->
		    
			    	
		    </div><!--//flex-column-->   
	    </div><!--//auth-main-col-->
	    <div class="col-12 col-md-5 col-lg-6 h-100 auth-background-col">
		    <div class="auth-background-holder">
		    </div>
		    <div class="auth-background-mask"></div>
	    </div><!--//auth-background-col-->
    
    </div><!--//row-->
    <script src="assets/js/login.js"></script>


</body>
</html> 

