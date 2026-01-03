// Password toggle
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const eyeIcon = document.getElementById("eyeIcon");
const eyeOffIcon = document.getElementById("eyeOffIcon");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;

  if (type === "text") {
    eyeIcon.style.display = "none";
    eyeOffIcon.style.display = "block";
  } else {
    eyeIcon.style.display = "block";
    eyeOffIcon.style.display = "none";
  }
  lucide.createIcons();
});

// Login form submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember").checked;

  // Validate
  if (!validateEmail(email)) {
    showFieldError("email", "Please enter a valid email address");
    return;
  }

  if (password.length < 6) {
    showFieldError("password", "Password must be at least 6 characters");
    return;
  }

  // Login
  const result = await login(email, password, remember);

  if (result.success) {
    showToast("Login successful! Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 1000);
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
