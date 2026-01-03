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
const showFeedbackError = (id, msg) => {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add("show");
  const inputId = id.replace("error", "").toLowerCase();
  const inputElement = document.getElementById(inputId);
  if (inputElement) inputElement.classList.add("feedback-error");
};

const clearFeedbackError = (id) => {
  const el = document.getElementById(id);
  el.textContent = "";
  el.classList.remove("show");
  const inputId = id.replace("error", "").toLowerCase();
  const inputElement = document.getElementById(inputId);
  if (inputElement) inputElement.classList.remove("feedback-error");
};

// Validation functions
const validateFeedbackName = (name) => {
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return {
      valid: false,
      message: "Name must be at least 2 characters",
    };
  }
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    return {
      valid: false,
      message:
        "Name can only contain letters, spaces, hyphens, and apostrophes",
    };
  }
  return { valid: true };
};

const validateFeedbackRating = () => {
  const ratingSelected = document.querySelector(
    'input[name="rating"]:checked'
  );
  if (!ratingSelected) {
    return { valid: false, message: "Please select a rating" };
  }
  return { valid: true };
};

const validateFeedbackService = (service) => {
  if (!service) {
    return { valid: false, message: "Please select a service" };
  }
  return { valid: true };
};

const validateFeedbackLikes = () => {
  const likesSelected =
    document.querySelectorAll('input[name="likes"]:checked').length > 0;
  if (!likesSelected) {
    return { valid: false, message: "Please select at least one option" };
  }
  return { valid: true };
};

// Real-time validation
const form = document.getElementById("feedbackForm");

form.name.addEventListener("blur", () => {
  const result = validateFeedbackName(form.name.value);
  if (!result.valid) {
    showFeedbackError("errorName", result.message);
  } else {
    clearFeedbackError("errorName");
  }
});

form.email.addEventListener("blur", () => {
  const result = validateEmail(form.email.value);
  if (!result.valid) {
    showFeedbackError("errorEmail", result.message);
  } else {
    clearFeedbackError("errorEmail");
  }
});

document.querySelectorAll('input[name="rating"]').forEach((input) => {
  input.addEventListener("change", () => {
    const result = validateFeedbackRating();
    if (result.valid) {
      clearFeedbackError("errorRating");
    }
  });
});

form.serviceType.addEventListener("change", () => {
  const result = validateFeedbackService(form.serviceType.value);
  if (!result.valid) {
    showFeedbackError("errorService", result.message);
  } else {
    clearFeedbackError("errorService");
  }
});

document.querySelectorAll('input[name="likes"]').forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const result = validateFeedbackLikes();
    if (result.valid) {
      clearFeedbackError("errorLikes");
    }
  });
});

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameResult = validateFeedbackName(form.name.value);
  const emailResult = validateEmail(form.email.value);
  const ratingResult = validateFeedbackRating();
  const serviceResult = validateFeedbackService(form.serviceType.value);
  const likesResult = validateFeedbackLikes();

  let valid = true;
  let firstErrorField = null;

  if (!nameResult.valid) {
    showFeedbackError("errorName", nameResult.message);
    if (!firstErrorField) firstErrorField = form.name;
    valid = false;
  }

  if (!emailResult.valid) {
    showFeedbackError("errorEmail", emailResult.message);
    if (!firstErrorField) firstErrorField = form.email;
    valid = false;
  }

  if (!ratingResult.valid) {
    showFeedbackError("errorRating", ratingResult.message);
    if (!firstErrorField)
      firstErrorField = document.getElementById("rate5");
    valid = false;
  }

  if (!serviceResult.valid) {
    showFeedbackError("errorService", serviceResult.message);
    if (!firstErrorField) firstErrorField = form.serviceType;
    valid = false;
  }

  if (!likesResult.valid) {
    showFeedbackError("errorLikes", likesResult.message);
    if (!firstErrorField)
      firstErrorField = document.getElementById("quality");
    valid = false;
  }

  if (valid) {
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      rating: document.querySelector('input[name="rating"]:checked')
        .value,
      serviceType: form.serviceType.value,
      likes: Array.from(
        document.querySelectorAll('input[name="likes"]:checked')
      ).map((cb) => cb.value),
      comments: form.comments.value.trim(),
    };

    console.log("Feedback Data:", formData);
    showToast(
      "Thank you for your feedback! We appreciate your input. 🎉",
      "success"
    );
    form.reset();
    [
      "errorName",
      "errorEmail",
      "errorRating",
      "errorService",
      "errorLikes",
    ].forEach(clearFeedbackError);
  } else if (firstErrorField) {
    firstErrorField.focus();
  }
});

// Reset handler
form.addEventListener("reset", () => {
  [
    "errorName",
    "errorEmail",
    "errorRating",
    "errorService",
    "errorLikes",
  ].forEach(clearFeedbackError);
});
