const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const fields = [
    "studentId", "fullName", "email", "phone", "birthDate",
    "program", "yearLevel", "password", "confirmPassword", "address"
];

function showError(field, message) {
    const input = document.getElementById(field);
    const error = document.getElementById(field + "Error");
    input.classList.add("error");
    error.textContent = message;
    input.setAttribute("aria-invalid", "true");
}

function clearError(field) {
    const input = document.getElementById(field);
    const error = document.getElementById(field + "Error");
    input.classList.remove("error");
    error.textContent = "";
    input.removeAttribute("aria-invalid");
}

function validateField(field) {
    const input = document.getElementById(field);
    const label = input.dataset.label;
    const value = input.value.trim();
    input.value = value;
    clearError(field);

    if (value === "") {
        showError(field, label + " is required.");
        return false;
    }

    if (field === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            showError(field, "Please enter a valid email address.");
            return false;
        }
    }

    if (field === "phone") {
        const phonePattern = /^09\d{9}$/;
        if (!phonePattern.test(value)) {
            showError(field, "Enter an 11-digit Philippine mobile number starting with 09.");
            return false;
        }
    }

    if (field === "birthDate") {
        const today = new Date();
        const selectedDate = new Date(value + "T00:00:00");
        if (selectedDate > today) {
            showError(field, "Date of birth cannot be in the future.");
            return false;
        }
    }

    if (field === "password" && value.length < 8) {
        showError(field, "Password must be at least 8 characters long.");
        return false;
    }

    if (field === "confirmPassword" && value !== password.value.trim()) {
        showError(field, "Passwords do not match.");
        return false;
    }

    return true;
}

function validateGender() {
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    const group = document.getElementById("genderGroup");
    const error = document.getElementById("genderError");
    group.classList.remove("error");
    error.textContent = "";

    if (!selectedGender) {
        group.classList.add("error");
        error.textContent = "Please select a gender.";
        return false;
    }
    return true;
}

function validateAgreement() {
    const agreement = document.getElementById("agreement");
    const error = document.getElementById("agreementError");
    agreement.classList.remove("error");
    error.textContent = "";

    if (!agreement.checked) {
        agreement.classList.add("error");
        error.textContent = "You must agree before submitting the form.";
        return false;
    }
    return true;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    successMessage.textContent = "";

    let isValid = true;

    fields.forEach(function(field) {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (!validateGender()) isValid = false;
    if (!validateAgreement()) isValid = false;

    if (isValid) {
        successMessage.textContent = "Registration successful!";
        form.setAttribute("data-submission-status", "success");
    } else {
        form.setAttribute("data-submission-status", "invalid");
        const firstError = form.querySelector(".error");
        if (firstError) firstError.focus();
    }
});

fields.forEach(function(field) {
    const input = document.getElementById(field);

    input.addEventListener("input", function() {
        validateField(field);
        successMessage.textContent = "";
        form.setAttribute("data-submission-status", "editing");

        if (field === "password" && confirmPassword.value.trim() !== "") {
            validateField("confirmPassword");
        }
    });

    input.addEventListener("change", function() {
        validateField(field);
    });
});

document.querySelectorAll('input[name="gender"]').forEach(function(radio) {
    radio.addEventListener("change", function() {
        validateGender();
        successMessage.textContent = "";
    });
});

document.getElementById("agreement").addEventListener("change", function() {
    validateAgreement();
    successMessage.textContent = "";
});

togglePassword.addEventListener("click", function() {
    const showPasswords = password.type === "password";

    password.type = showPasswords ? "text" : "password";
    confirmPassword.type = showPasswords ? "text" : "password";

    togglePassword.classList.toggle("active");
    togglePassword.textContent = showPasswords ? "Hide Passwords" : "Show Passwords";
    togglePassword.setAttribute("aria-pressed", String(showPasswords));
});

form.addEventListener("reset", function() {
    window.setTimeout(function() {
        fields.forEach(function(field) {
            clearError(field);
        });

        document.getElementById("genderGroup").classList.remove("error");
        document.getElementById("genderError").textContent = "";
        document.getElementById("agreement").classList.remove("error");
        document.getElementById("agreementError").textContent = "";
        successMessage.textContent = "";

        password.type = "password";
        confirmPassword.type = "password";
        togglePassword.classList.remove("active");
        togglePassword.textContent = "Show Passwords";
        togglePassword.setAttribute("aria-pressed", "false");

        form.setAttribute("data-submission-status", "idle");
    }, 0);
});
