// Password toggle for both fields
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

togglePassword.addEventListener("click", () => {
  togglePasswordVisibility(passwordInput, "eyeIcon", "eyeOffIcon");
});

toggleConfirmPassword.addEventListener("click", () => {
  togglePasswordVisibility(confirmPasswordInput, "eyeIcon2", "eyeOffIcon2");
});

function togglePasswordVisibility(input, eyeId, eyeOffId) {
  const type = input.type === "password" ? "text" : "password";
  input.type = type;

  const eyeIcon = document.getElementById(eyeId);
  const eyeOffIcon = document.getElementById(eyeOffId);

  if (type === "text") {
    eyeIcon.style.display = "none";
    eyeOffIcon.style.display = "block";
  } else {
    eyeIcon.style.display = "block";
    eyeOffIcon.style.display = "none";
  }
  lucide.createIcons();
}

// Password strength indicator
passwordInput.addEventListener("input", () => {
  const strength = checkPasswordStrength(passwordInput.value);
  updatePasswordStrength(strength);
});

function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  return strength;
}

function updatePasswordStrength(strength) {
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");

  const levels = [
    { text: "Very Weak", width: "20%", color: "hsl(0 84% 60%)" },
    { text: "Weak", width: "40%", color: "hsl(25 95% 53%)" },
    { text: "Fair", width: "60%", color: "hsl(45 93% 47%)" },
    { text: "Good", width: "80%", color: "hsl(142 76% 36%)" },
    { text: "Strong", width: "100%", color: "hsl(142 76% 36%)" },
  ];

  const level = levels[strength] || levels[0];
  strengthBar.style.width = level.width;
  strengthBar.style.background = level.color;
  strengthText.textContent = level.text;
  strengthText.style.color = level.color;
}

// Signup form submission
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms").checked;

  // Validate
  let hasError = false;

  if (name.length < 2) {
    showFieldError("name", "Name must be at least 2 characters");
    hasError = true;
  }

  if (!validateEmail(email)) {
    showFieldError("email", "Please enter a valid email address");
    hasError = true;
  }

  if (password.length < 8) {
    showFieldError("password", "Password must be at least 8 characters");
    hasError = true;
  }

  if (password !== confirmPassword) {
    showFieldError("confirmPassword", "Passwords do not match");
    hasError = true;
  }

  if (!terms) {
    showToast("Please accept the terms and conditions", "error");
    hasError = true;
  }

  if (hasError) return;

  // Register
  const result = await register(name, email, password);

  if (result.success) {
    showToast("Account created successfully! Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "./login.html";
    }, 1500);
  } else {
    showToast(result.message, "error");
  }
});

// Field validation helpers
function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "Error");
  input.classList.add("error");
  error.textContent = message;
  error.classList.add("show");
}

function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "Error");
  input.classList.remove("error");
  error.classList.remove("show");
}

// Clear errors on input
document.querySelectorAll(".form-field input").forEach((input) => {
  input.addEventListener("input", () => {
    clearFieldError(input.id);
  });
});

// Redirect if already logged in
if (isAuthenticated()) {
  window.location.href = "./index.html";
}
