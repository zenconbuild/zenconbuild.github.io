// Auto-fill user data if authenticated
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    // User is authenticated - pre-fill and disable fields
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");

    // Pre-fill email (preferred)
    if (currentUser.email) {
      emailField.value = currentUser.email;
      emailField.disabled = true;
      emailField.style.backgroundColor = "hsl(var(--muted))";
      emailField.style.cursor = "not-allowed";
      document.getElementById("autoFilledEmailBadge").style.display =
        "inline";
    }

    // Pre-fill name if available
    if (currentUser.name) {
      nameField.value = currentUser.name;
      nameField.disabled = true;
      nameField.style.backgroundColor = "hsl(var(--muted))";
      nameField.style.cursor = "not-allowed";
      document.getElementById("autoFilledBadge").style.display = "inline";
    }
  }
});

// Form validation
function validateForm() {
  let isValid = true;

  // Clear all errors
  document
    .querySelectorAll(".error-message")
    .forEach((el) => el.classList.remove("show"));
  document
    .querySelectorAll(".error")
    .forEach((el) => el.classList.remove("error"));

  // Phone validation
  const phone = document.getElementById("phone");
  const phoneRegex = /^[0-9]{10}$/;
  if (!phone.value.trim()) {
    showError("phone", "Please enter your phone number");
    isValid = false;
  } else if (!phoneRegex.test(phone.value.replace(/\D/g, ""))) {
    showError("phone", "Please enter a valid 10-digit phone number");
    isValid = false;
  }

  // Date validation
  const date = document.getElementById("date");
  const selectedDate = new Date(date.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!date.value) {
    showError("date", "Please select a date");
    isValid = false;
  } else if (selectedDate < today) {
    showError("date", "Please select a future date");
    isValid = false;
  }

  // Time validation
  const time = document.getElementById("time");
  if (!time.value) {
    showError("time", "Please select a time");
    isValid = false;
  }

  // Design type validation
  const designType = document.querySelector(
    'input[name="designType"]:checked'
  );
  if (!designType) {
    showError("Design", "Please select a project type");
    isValid = false;
  }

  // Addon validation
  const addon = document.querySelector('input[name="addon"]:checked');
  if (!addon) {
    showError("Service", "Please select an add-on service");
    isValid = false;
  }

  // Budget validation
  const budget = document.getElementById("budget");
  if (!budget.value) {
    showError("budget", "Please select your budget range");
    isValid = false;
  }

  return isValid;
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById("error" + capitalize(fieldId));

  if (field && !field.disabled) field.classList.add("error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("show");
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Phone number formatting (only numbers)
document.getElementById("phone").addEventListener("input", function (e) {
  this.value = this.value.replace(/\D/g, "").slice(0, 10);
});

// Set min date to today
const dateInput = document.getElementById("date");
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

// Form submission
document.getElementById("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();

  if (validateForm()) {
    const userName = document.getElementById("name").value.trim();
    const userEmail = document.getElementById("email").value.trim();
    const userDate = new Date(
      document.getElementById("date").value
    ).toLocaleDateString("en-IN");
    const userTime = document.getElementById("time").value;
    const designType = document.querySelector(
      'input[name="designType"]:checked'
    ).value;
    const addon = document.querySelector(
      'input[name="addon"]:checked'
    ).value;
    const budget = document.getElementById("budget").value;
    const description = document
      .getElementById("description")
      .value.trim();

    // Prepare booking data
    const bookingData = {
      name: userName,
      email: userEmail,
      phone: document.getElementById("phone").value,
      date: document.getElementById("date").value,
      time: userTime,
      designType: designType,
      addon: addon,
      budget: budget,
      description: description,
      bookedAt: new Date().toISOString(),
      userId: getCurrentUser()?.userId || null,
    };

    // Store booking (you can save to localStorage or send to backend)
    const bookings = JSON.parse(
      localStorage.getItem("dreamspace_bookings") || "[]"
    );
    bookings.push(bookingData);
    localStorage.setItem("dreamspace_bookings", JSON.stringify(bookings));

    console.log("Booking submitted:", bookingData);

    showToast(
      `Hi ${userName}! Your consultation is booked for ${userDate} at ${userTime}. We'll contact you soon! 🎉`,
      "success"
    );

    // Reset form after short delay
    setTimeout(() => {
      document.getElementById("bookingForm").reset();

      // Re-apply auto-fill after reset
      const currentUser = getCurrentUser();
      if (currentUser) {
        if (currentUser.email) {
          document.getElementById("email").value = currentUser.email;
          document.getElementById("email").disabled = true;
        }
        if (currentUser.name) {
          document.getElementById("name").value = currentUser.name;
          document.getElementById("name").disabled = true;
        }
      }
    }, 2000);
  }
});

// Reset button
document
  .querySelector('button[type="reset"]')
  .addEventListener("click", () => {
    document
      .querySelectorAll(".error-message")
      .forEach((el) => el.classList.remove("show"));
    document
      .querySelectorAll(".error")
      .forEach((el) => el.classList.remove("error"));

    // Re-apply auto-fill after reset
    setTimeout(() => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        if (currentUser.email) {
          document.getElementById("email").value = currentUser.email;
          document.getElementById("email").disabled = true;
        }
        if (currentUser.name) {
          document.getElementById("name").value = currentUser.name;
          document.getElementById("name").disabled = true;
        }
      }
    }, 100);
  });