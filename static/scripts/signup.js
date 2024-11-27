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

    const email = form.querySelector('input[name="email"]').value;
    if (!validateEmail(email)) {
        allValid = false;
    }

    const password = form.querySelector('input[name="pwd"]').value;
    const passwordConfirm = form.querySelector('input[name="password-confirm"]').value;
    if (password !== passwordConfirm) {
        allValid = false;
    }

    submitButton.disabled = !allValid;
}

function validateEmail(email) {
    email = String(email).toLowerCase();
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const domain = email.split('@')[1];
    test = email.match(re) || (domain == 'g.skku.edu');
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

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('사진 파일의 크기는 5MB를 넘을 수 없습니다.');
                this.value = '';
                return;
            }

            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let size, sx, sy;

                if (img.width > img.height) {
                    size = img.height;
                    sx = (img.width - img.height) / 2;
                    sy = 0;
                } else {
                    size = img.width;
                    sx = 0;
                    sy = (img.height - img.width) / 2;
                }

                canvas.width = size;
                canvas.height = size;
                ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

                canvas.toBlob(function(blob) {
                    const croppedFile = new File([blob], file.name, { type: file.type });
                    const croppedUrl = URL.createObjectURL(croppedFile);
                    document.querySelector('.image').src = croppedUrl;

                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(croppedFile);
                    fileInput.files = dataTransfer.files;
                }, file.type);
            };
            img.src = URL.createObjectURL(file);
        }
    });

    profileImage.addEventListener('click', function() {
        fileInput.click();
    });
    /*
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
    */
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
    initializeProfileUpload();
});