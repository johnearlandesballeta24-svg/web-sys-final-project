function formatTime(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return h12 + ":" + minutes + ":" + seconds + " " + ampm;
}

const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "member") window.location.href = "index.html";

const memberId = user.member_id;

// Set user info
document.getElementById("sidebarUser").textContent =
  user.first_name + " " + user.last_name;
document.getElementById("topbarUser").textContent =
  "Hi, " + user.first_name + "!";

// Logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// Sidebar toggle
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("hidden");
  document.getElementById("mainContent").classList.toggle("expanded");
}

// Show section
function showSection(name, el) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("section-" + name).classList.add("active");
  document
    .querySelectorAll(".sidebar-menu a")
    .forEach((a) => a.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("sectionTitle").textContent =
    name.charAt(0).toUpperCase() + name.slice(1);
}

// Filter table
function filterTable(tableId, query) {
  const rows = document.querySelectorAll("#" + tableId + " tbody tr");
  const q = query.toLowerCase();
  rows.forEach((row) => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
  });
}

// BMI calculator
function calcBMI(height, weight) {
  const h = height / 100;
  return (weight / (h * h)).toFixed(1);
}

function bmiClass(bmi) {
  if (bmi < 18.5) return "bmi-underweight";
  if (bmi < 25) return "bmi-normal";
  if (bmi < 30) return "bmi-overweight";
  return "bmi-obese";
}

// Load overview stats
async function loadOverview() {
  const res = await fetch("api/member_stats.php?member_id=" + memberId);
  const data = await res.json();

  document.getElementById("welcomeName").textContent =
    "Welcome back, " + user.first_name + "!";
  document.getElementById("welcomePlan").textContent = data.plan
    ? "You are on the " + data.plan + " plan"
    : "No active membership plan";

  document.getElementById("totalVisits").textContent = data.visits;
  document.getElementById("statPlan").textContent = data.plan || "None";
  document.getElementById("totalPaid").textContent =
    "₱" + Number(data.total_paid || 0).toLocaleString();
  document.getElementById("totalAssessments").textContent = data.assessments;
}

// Load profile
async function loadProfile() {
  const res = await fetch("api/member_profile.php?member_id=" + memberId);
  const data = await res.json();

  const initials = data.first_name[0] + data.last_name[0];
  document.getElementById("profileAvatar").textContent = initials;

  document.getElementById("profileDetails").innerHTML = `
    <div class="profile-item">
      <label>First Name</label>
      <p>${data.first_name}</p>
    </div>
    <div class="profile-item">
      <label>Last Name</label>
      <p>${data.last_name}</p>
    </div>
    <div class="profile-item">
      <label>Gender</label>
      <p>${data.gender}</p>
    </div>
    <div class="profile-item">
      <label>Birthday</label>
      <p>${data.birthday}</p>
    </div>
    <div class="profile-item">
      <label>Phone</label>
      <p>${data.phone_number}</p>
    </div>
    <div class="profile-item">
      <label>Email</label>
      <p>${data.email}</p>
    </div>
    <div class="profile-item">
      <label>Street</label>
      <p>${data.street}</p>
    </div>
    <div class="profile-item">
      <label>City</label>
      <p>${data.city}</p>
    </div>
  `;
}

// Load membership
async function loadMembership() {
  const res = await fetch("api/member_membership.php?member_id=" + memberId);
  const data = await res.json();

  if (!data.plan_name) {
    document.getElementById("membershipBody").innerHTML =
      '<p style="color:#888; padding:1rem;">No membership plan found.</p>';
    return;
  }

  document.getElementById("membershipBody").innerHTML = `
    <div class="plan-card">
      <div class="plan-name">${data.plan_name}</div>
      <div class="plan-duration">${data.duration}</div>
      <div class="plan-amount">₱${Number(data.plan_amount).toLocaleString()} <span>/ plan</span></div>
      <div>
        <span class="plan-status ${data.status === "Active" ? "status-active" : "status-inactive"}">
          ${data.status}
        </span>
      </div>
    </div>
  `;
}

// Load attendance
async function loadAttendance() {
  const res = await fetch("api/member_attendance.php?member_id=" + memberId);
  const data = await res.json();
  const body = document.getElementById("attendanceBody");
  if (!data.length) {
    body.innerHTML =
      '<tr><td colspan="3" style="text-align:center; color:#888;">No attendance records</td></tr>';
    return;
  }
  body.innerHTML = data
    .map(
      (a) => `
    <tr>
      <td>${a.date}</td>
      <td>${formatTime(a.time_in)}</td>
      <td>${a.time_out === "00:00:00" ? "Not yet" : formatTime(a.time_out)}</td>
    </tr>
  `,
    )
    .join("");
}

// Load payments
async function loadPayments() {
  const res = await fetch("api/member_payments.php?member_id=" + memberId);
  const data = await res.json();
  const body = document.getElementById("paymentsBody");
  if (!data.length) {
    body.innerHTML =
      '<tr><td colspan="4" style="text-align:center; color:#888;">No payment records</td></tr>';
    return;
  }
  body.innerHTML = data
    .map(
      (p) => `
    <tr>
      <td>${p.payment_id}</td>
      <td>₱${Number(p.amount).toLocaleString()}</td>
      <td>${p.date}</td>
      <td>${p.payment_method}</td>
    </tr>
  `,
    )
    .join("");
}

// Load progress
async function loadProgress() {
  const res = await fetch("api/member_progress.php?member_id=" + memberId);
  const data = await res.json();
  const body = document.getElementById("progressBody");
  if (!data.length) {
    body.innerHTML =
      '<tr><td colspan="4" style="text-align:center; color:#888;">No progress records</td></tr>';
    return;
  }
  body.innerHTML = data
    .map((p) => {
      const bmi = calcBMI(p.height, p.weight);
      return `
      <tr>
        <td>${p.assessment_date}</td>
        <td>${p.height} cm</td>
        <td>${p.weight} kg</td>
        <td class="${bmiClass(bmi)}">${bmi}</td>
      </tr>
    `;
    })
    .join("");
}

// Load programs
async function loadPrograms() {
  const res = await fetch("api/programs.php");
  const data = await res.json();
  const body = document.getElementById("programsBody");
  body.innerHTML = data
    .map(
      (p) => `
    <tr>
      <td>${p.fitness_program}</td>
      <td>${p.date}</td>
      <td>${p.session}</td>
      <td>${p.duration_mins} mins</td>
      <td>${p.trainer}</td>
    </tr>
  `,
    )
    .join("");
}
// Generate QR code
async function generateQR() {
  const qrId = user.member_id;
  document.getElementById("qrIdText").textContent = qrId;
  document.getElementById("qrMemberName").textContent =
    user.first_name + " " + user.last_name;

  // Fetch their plan name to show on card
  const res = await fetch("api/member_membership.php?member_id=" + memberId);
  const data = await res.json();
  document.getElementById("qrMemberPlan").textContent =
    data.plan_name || "Member";

  new QRCode(document.getElementById("memberQR"), {
    text: qrId,
    width: 200,
    height: 200,
    colorDark: "#0F6E56",
    colorLight: "#ffffff",
  });
}

// Download QR as image
function downloadQR() {
  const canvas = document.querySelector("#memberQR canvas");
  const link = document.createElement("a");
  link.download = "gymro-qr-" + user.member_id + ".png";
  link.href = canvas.toDataURL();
  link.click();
}

generateQR();

// Run all
loadOverview();
loadProfile();
loadMembership();
loadAttendance();
loadPayments();
loadProgress();
loadPrograms();
