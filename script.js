let currentRole = "member";

// Switch between Member and Staff role
function switchRole(role) {
  currentRole = role;

  document
    .getElementById("memberRoleBtn")
    .classList.toggle("active", role === "member");
  document
    .getElementById("staffRoleBtn")
    .classList.toggle("active", role === "staff");

  // Reset to login tab when switching roles
  showTab("login");
}

// Switch between login and register tabs
function showTab(tab) {
  // hide all forms first
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("staffLoginForm").style.display = "none";
  document.getElementById("staffRegisterForm").style.display = "none";

  document
    .getElementById("loginTab")
    .classList.toggle("active", tab === "login");
  document
    .getElementById("signupTab")
    .classList.toggle("active", tab === "signup");

  if (currentRole === "member") {
    document.getElementById("loginForm").style.display =
      tab === "login" ? "flex" : "none";
    document.getElementById("signupForm").style.display =
      tab === "signup" ? "flex" : "none";
  } else {
    document.getElementById("staffLoginForm").style.display =
      tab === "login" ? "flex" : "none";
    document.getElementById("staffRegisterForm").style.display =
      tab === "signup" ? "flex" : "none";
  }
}

// Member login
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("api/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (data.success) {
    localStorage.setItem("user", JSON.stringify(data.user));

    // Redirect based on role
    if (data.user.role === "member") {
      window.location.href = "member_dashboard.html";
    } else {
      window.location.href = "dashboard.html";
    }
  }
}

// Member signup
async function handleSignup(e) {
  e.preventDefault();
  const body = {
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    gender: document.getElementById("gender").value,
    birthday: document.getElementById("birthday").value,
    phone: document.getElementById("phone").value,
    street: document.getElementById("street").value,
    city: document.getElementById("city").value,
    email: document.getElementById("signupEmail").value,
    password: document.getElementById("signupPassword").value,
    role: "member",
  };

  const res = await fetch("api/signup.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (data.success) {
    alert("Account created! Please sign in.");
    showTab("login");
  } else {
    document.getElementById("signupError").textContent = data.message;
  }
}

// Staff login
async function handleStaffLogin(e) {
  e.preventDefault();
  const staff_id = document.getElementById("staffLoginId").value;
  const password = document.getElementById("staffLoginPassword").value;

  const res = await fetch("api/staff_login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ staff_id, password }),
  });
  const data = await res.json();

  if (data.success) {
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("staffLoginError").textContent = data.message;
  }
}

// Staff register — verify staff_id exists, then set password
async function handleStaffRegister(e) {
  e.preventDefault();
  const staff_id = document.getElementById("staffId").value;
  const password = document.getElementById("staffPassword").value;
  const confirm = document.getElementById("staffConfirmPassword").value;

  if (password !== confirm) {
    document.getElementById("staffRegisterError").textContent =
      "Passwords do not match";
    return;
  }

  const res = await fetch("api/staff_register.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ staff_id, password }),
  });
  const data = await res.json();

  if (data.success) {
    alert("Staff account created! You can now sign in.");
    showTab("login");
  } else {
    document.getElementById("staffRegisterError").textContent = data.message;
  }
}

// Run on page load
showTab("login");
