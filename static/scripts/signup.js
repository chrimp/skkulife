function toggleTickBoxWithText() {
    const checkbox = document.querySelector(".agree");
    checkbox.checked = !checkbox.checked;
}

function checkValidity() {
    const form = document.getElementById('signup-form');
    const submitButton = document.getElementById('signup-button');
    const requiredInputs = form.querySelectorAll('input[required]');
    let allValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            allValid = false;
        }
    });

    const password = form.querySelector('input[name="password"]').value;
    const passwordConfirm = form.querySelector('input[name="password-confirm"]').value;
    if (password !== passwordConfirm) {
        allValid = false;
    }

    /*
    const codeInput = form.querySelector('input[name="code"]');
    if (codeInput.value != "000000") {
        allValid = false;
    }
    */

    submitButton.disabled = !allValid;
}

function validateEmail(email) {
    email = String(email).toLowerCase();
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const domain = email.split('@')[1];
    test = email.match(re) && (domain == 'g.skku.edu');
    return test;
}

function buttonAction() {
    const emailInput = document.querySelector('input[name="email"]');
    const email = emailInput.value;
    // Placeholder

    const codeInput = document.querySelector('input[name="code"]');
    codeInput.style.display = 'block';
    codeInput.focus();
}

function initializeProfileUpload() {
    // Script for profile image upload
    const profileImageContainer = document.querySelector('.profile-image-container');
    const profileImage = profileImageContainer.querySelector('.image');
    const fileInput = profileImageContainer.querySelector('input[type="file"]');
    const signupForm = document.getElementById('signup-form');

    profileImage.addEventListener('click', function() {
        fileInput.click();
    });
    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(signupForm);
        if (file) {
            formData.append('profile-image', file);
        }

        fetch('/signup', {
            method: 'POST', body: formData
        })
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Hide code input initially
    //const codeInput = document.querySelector('input[name="code"]');
    //codeInput.style.display = 'none';

    // Event listener for enabling/disabling the signup button
    const form = document.getElementById('signup-form');
    const inputs = form.querySelectorAll('input[required], input[type="checkbox"]');
    inputs.forEach(input => {
        input.addEventListener('input', checkValidity);
        input.addEventListener('change', checkValidity);
    });
    
    // Event listener for enabling/disabling the validate button
    /*
    const emailInput = form.querySelector('input[name="email"]');
    const emailButton = document.getElementById('validate');
    emailButton.addEventListener('click', buttonAction);
    function updateValidateButtonState() {
        if (validateEmail(emailInput.value)) {
            emailButton.disabled = false;
        } else {
            emailButton.disabled = true;
        }
    }
    emailInput.addEventListener('input', updateValidateButtonState);
    */

    // Initial update
    //updateValidateButtonState();
    checkValidity();

    // Initialize profile image upload
    initializeProfileUpload();
});