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
      document.getElementById("autoFilledNameBadge").style.display =
        "inline";
    }
  }
});

// Validation helpers
const showContactError = (id, msg) => {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add("show");
  const inputId = id.replace("error", "").toLowerCase();
  const inputElement = document.getElementById(inputId);
  if (inputElement) inputElement.classList.add("contact-error");
};

const clearContactError = (id) => {
  const el = document.getElementById(id);
  el.textContent = "";
  el.classList.remove("show");
  const inputId = id.replace("error", "").toLowerCase();
  const inputElement = document.getElementById(inputId);
  if (inputElement) inputElement.classList.remove("contact-error");
};

// Validation functions
const validateName = (val) => {
  const trimmed = val.trim();
  if (trimmed.length === 0)
    return { valid: false, message: "Name is required" };
  if (trimmed.length < 2)
    return {
      valid: false,
      message: "Name must be at least 2 characters",
    };
  return { valid: true };
};

const validatePhone = (val) => {
  const trimmed = val.trim();
  if (trimmed.length === 0)
    return { valid: false, message: "Phone number is required" };
  const cleaned = trimmed.replace(/[\s\-()]/g, "");
  const pattern1 = /^[6-9]\d{9}$/;
  const pattern2 = /^\+91[6-9]\d{9}$/;
  const pattern3 = /^91[6-9]\d{9}$/;

  if (
    !(
      pattern1.test(cleaned) ||
      pattern2.test(cleaned) ||
      pattern3.test(cleaned)
    )
  ) {
    return {
      valid: false,
      message: "Enter a valid 10-digit mobile number starting with 6-9",
    };
  }
  return { valid: true };
};

const validateSubject = (val) => {
  if (!val) return { valid: false, message: "Please select a subject" };
  return { valid: true };
};

const validateMessage = (val) => {
  const trimmed = val.trim();
  if (trimmed.length === 0)
    return { valid: false, message: "Message is required" };
  if (trimmed.length < 10)
    return {
      valid: false,
      message: "Message must be at least 10 characters",
    };
  return { valid: true };
};

const validateServiceType = () => {
  if (!document.querySelector('input[name="serviceType"]:checked')) {
    return { valid: false, message: "Please select a service type" };
  }
  return { valid: true };
};

// Real-time validation
const nameField = document.getElementById("name");
if (nameField) {
  nameField.addEventListener("blur", () => {
    if (!nameField.disabled) {
      const result = validateName(nameField.value);
      if (!result.valid) {
        showContactError("errorName", result.message);
      } else {
        clearContactError("errorName");
      }
    }
  });
}

document.getElementById("email").addEventListener("blur", function () {
  if (!this.disabled) {
    const result = validateEmail(this.value);
    if (!result.valid) {
      showContactError("errorEmail", result.message);
    } else {
      clearContactError("errorEmail");
    }
  }
});

document.getElementById("phone").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9+\s\-()]/g, "");
});

document.getElementById("phone").addEventListener("blur", function () {
  const result = validatePhone(this.value);
  if (!result.valid) {
    showContactError("errorPhone", result.message);
  } else {
    clearContactError("errorPhone");
  }
});

document
  .getElementById("subject")
  .addEventListener("change", function () {
    const result = validateSubject(this.value);
    if (!result.valid) {
      showContactError("errorSubject", result.message);
    } else {
      clearContactError("errorSubject");
    }
  });

document.getElementById("message").addEventListener("blur", function () {
  const result = validateMessage(this.value);
  if (!result.valid) {
    showContactError("errorMessage", result.message);
  } else {
    clearContactError("errorMessage");
  }
});

// Form submission
document
  .getElementById("contactForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;
    let firstErrorField = null;

    // Validate name
    const nameInput = document.getElementById("name");
    if (!nameInput.disabled) {
      const nameResult = validateName(nameInput.value);
      if (!nameResult.valid) {
        showContactError("errorName", nameResult.message);
        if (!firstErrorField) firstErrorField = nameInput;
        isValid = false;
      }
    }

    // Validate email
    const emailInput = document.getElementById("email");
    if (!emailInput.disabled) {
      const emailResult = validateEmail(emailInput.value);
      if (!emailResult.valid) {
        showContactError("errorEmail", emailResult.message);
        if (!firstErrorField) firstErrorField = emailInput;
        isValid = false;
      }
    }

    // Validate phone
    const phone = validatePhone(this.phone.value);
    if (!phone.valid) {
      showContactError("errorPhone", phone.message);
      if (!firstErrorField) firstErrorField = this.phone;
      isValid = false;
    }

    // Validate subject
    const subject = validateSubject(this.subject.value);
    if (!subject.valid) {
      showContactError("errorSubject", subject.message);
      if (!firstErrorField) firstErrorField = this.subject;
      isValid = false;
    }

    // Validate service type
    const serviceType = validateServiceType();
    if (!serviceType.valid) {
      showContactError("errorService", serviceType.message);
      if (!firstErrorField)
        firstErrorField = document.getElementById("residential");
      isValid = false;
    }

    // Validate message
    const message = validateMessage(this.message.value);
    if (!message.valid) {
      showContactError("errorMessage", message.message);
      if (!firstErrorField) firstErrorField = this.message;
      isValid = false;
    }

    if (isValid) {
      const formData = {
        name: this.name.value.trim(),
        email: this.email.value.trim(),
        phone: this.phone.value.replace(/[\s\-()]/g, ""),
        subject: this.subject.value,
        serviceType: document.querySelector(
          'input[name="serviceType"]:checked'
        ).value,
        message: this.message.value.trim(),
        submittedAt: new Date().toISOString(),
        userId: getCurrentUser()?.userId || null,
      };

      console.log("Contact Form Data:", formData);

      // Store in localStorage (optional)
      const contacts = JSON.parse(
        localStorage.getItem("dreamspace_contacts") || "[]"
      );
      contacts.push(formData);
      localStorage.setItem(
        "dreamspace_contacts",
        JSON.stringify(contacts)
      );

      showToast(
        "Thank you! We'll get back to you within 24 hours. 📧",
        "success"
      );

      // Reset form
      this.reset();

      // Re-apply autofill after reset
      setTimeout(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const nameField = document.getElementById("name");
          const emailField = document.getElementById("email");

          if (currentUser.email) {
            emailField.value = currentUser.email;
            emailField.disabled = true;
            emailField.style.backgroundColor = "hsl(var(--muted))";
            emailField.style.cursor = "not-allowed";
          }

          if (currentUser.name) {
            nameField.value = currentUser.name;
            nameField.disabled = true;
            nameField.style.backgroundColor = "hsl(var(--muted))";
            nameField.style.cursor = "not-allowed";
          }
        }
      }, 100);
    } else if (firstErrorField) {
      firstErrorField.focus();
    }
  });

// Reset handler
document.getElementById("contactForm").addEventListener("reset", () => {
  [
    "errorName",
    "errorEmail",
    "errorPhone",
    "errorSubject",
    "errorService",
    "errorMessage",
  ].forEach(clearContactError);

  // Re-apply autofill
  setTimeout(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const nameField = document.getElementById("name");
      const emailField = document.getElementById("email");

      if (currentUser.email) {
        emailField.value = currentUser.email;
        emailField.disabled = true;
        emailField.style.backgroundColor = "hsl(var(--muted))";
        emailField.style.cursor = "not-allowed";
      }

      if (currentUser.name) {
        nameField.value = currentUser.name;
        nameField.disabled = true;
        nameField.style.backgroundColor = "hsl(var(--muted))";
        nameField.style.cursor = "not-allowed";
      }
    }
  }, 100);
});
