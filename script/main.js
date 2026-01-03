// Initialize Lucide icons ONCE
lucide.createIcons();

// AUTHENTICATION

// Storage keys
const USERS_KEY = "dreamspace_users";
const AUTH_KEY = "dreamspace_auth";
const SESSION_KEY = "dreamspace_session";

// Initialize users storage
function initStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
}

initStorage();

// Email validation
const validateEmail = (val) => {
  const trimmed = val.trim();
  if (trimmed.length === 0)
    return { valid: false, message: "Email is required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { valid: false, message: "Enter a valid email address" };
  }
  return { valid: true };
};

// Hash password
function hashPassword(password) {
  // Simple hash for demo
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Register new user
async function register(name, email, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY));

  // Check if user exists
  if (users.find((u) => u.email === email)) {
    return {
      success: false,
      message: "Email already registered",
    };
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name: name,
    email: email,
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return {
    success: true,
    message: "Registration successful",
  };
}

// Login user
async function login(email, password, remember = false) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY));
  const user = users.find(
    (u) => u.email === email && u.password === hashPassword(password)
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  // Create session
  const session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    loginTime: new Date().toISOString(),
    remember: remember,
  };

  // Store session
  if (remember) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return {
    success: true,
    message: "Login successful",
    user: { id: user.id, name: user.name, email: user.email },
  };
}

// Check if user is authenticated
function isAuthenticated() {
  const localAuth = localStorage.getItem(AUTH_KEY);
  const sessionAuth = sessionStorage.getItem(SESSION_KEY);
  return !!(localAuth || sessionAuth);
}

// Get current user
function getCurrentUser() {
  const localAuth = localStorage.getItem(AUTH_KEY);
  const sessionAuth = sessionStorage.getItem(SESSION_KEY);
  const authData = localAuth || sessionAuth;

  if (authData) {
    return JSON.parse(authData);
  }
  return null;
}

// Logout user
function logout() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = "./login.html";
}

// Redirect after login
function redirectAfterLogin() {
  const redirect = sessionStorage.getItem("redirectAfterLogin");
  sessionStorage.removeItem("redirectAfterLogin");
  return redirect || "./index.html";
}

// Update navigation based on auth state
function updateNavigation() {
  const user = getCurrentUser();

  // Get elements
  const authSection = document.getElementById("authSection");
  const userSection = document.getElementById("userSection");
  const userWelcome = document.getElementById("userWelcome");
  const userName = document.getElementById("userName");
  const userNameMobile = document.getElementById("userNameMobile");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    // User is authenticated
    // Hide auth buttons (login/signup)
    if (authSection) authSection.style.display = "none";

    // Show user section
    if (userSection) userSection.style.display = "flex";
    if (userWelcome) userWelcome.style.display = "flex";

    // Set user name
    if (userName) userName.textContent = user.name;
    if (userNameMobile) userNameMobile.textContent = user.name;

    // Add logout handler (only once)
    if (logoutBtn && !logoutBtn.dataset.listenerAdded) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // if (confirm("Are you sure you want to logout?")) {
        logout();
        // }
      });
      logoutBtn.dataset.listenerAdded = "true";
      lucide.createIcons();
    }
  } else {
    // User is NOT authenticated
    // Show auth buttons (login/signup)
    const currentPage = window.location.pathname;
    const isAuthPage =
      currentPage.includes("login") || currentPage.includes("signup");

    if (!isAuthPage && authSection) {
      authSection.style.display = "flex";
    }

    // Hide user section
    if (userSection) userSection.style.display = "none";
    if (userWelcome) userWelcome.style.display = "none";
  }

  // Re-initialize Lucide icons
  lucide.createIcons();
}

updateNavigation();

// Toast notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Close menu when clicking on a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;
const moonIcon = document.getElementById("moonIcon");
const sunIcon = document.getElementById("sunIcon");
const themeText = document.getElementById("themeText");

// Load saved theme immediately (before page renders)
const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", savedTheme);

// Set initial icon visibility
if (savedTheme === "dark") {
  if (moonIcon) {
    moonIcon.classList.remove("visible");
    moonIcon.classList.add("hidden");
  }
  if (sunIcon) {
    sunIcon.classList.remove("hidden");
    sunIcon.classList.add("visible");
  }
  if (themeText) themeText.textContent = "Light Mode";
} else {
  if (moonIcon) {
    moonIcon.classList.remove("hidden");
    moonIcon.classList.add("visible");
  }
  if (sunIcon) {
    sunIcon.classList.remove("visible");
    sunIcon.classList.add("hidden");
  }
  if (themeText) themeText.textContent = "Dark Mode";
}

if (themeToggle) {
  themeToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    // Update theme
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Toggle icons
    if (newTheme === "dark") {
      moonIcon?.classList.remove("visible");
      moonIcon?.classList.add("hidden");
      sunIcon?.classList.remove("hidden");
      sunIcon?.classList.add("visible");
      if (themeText) themeText.textContent = "Light Mode";
    } else {
      sunIcon?.classList.remove("visible");
      sunIcon?.classList.add("hidden");
      moonIcon?.classList.remove("hidden");
      moonIcon?.classList.add("visible");
      if (themeText) themeText.textContent = "Dark Mode";
    }
  });
}

// Toast Notification Function
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Newsletter form
document
  .querySelector(".newsletter-form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;

    // Simulate API call
    showToast("Successfully subscribed to newsletter!", "success");
    e.target.reset();
  });