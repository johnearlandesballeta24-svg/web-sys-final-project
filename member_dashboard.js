function formatTime(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return h12 + ":" + minutes + " " + ampm;
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

  // reload fresh data every time
  if (name === "attendance") loadAttendance();
  if (name === "payments") loadPayments();
  if (name === "progress") loadProgress();
  if (name === "membership") loadMembership();
  if (name === "plans") loadPlans();
  if (name === "overview") loadOverview();
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

let selectedPlan = null;

// Load plans section
async function loadPlans() {
  const res = await fetch("api/plans.php");
  const data = await res.json();

  // get current plan
  const memRes = await fetch("api/member_membership.php?member_id=" + memberId);
  const memData = await memRes.json();
  const currentPlanName = memData.plan_name || null;

  // show current plan card
  if (memData.plan_name) {
    document.getElementById("currentPlanBody").innerHTML = `
      <div class="plan-card">
        <div class="plan-name">${memData.plan_name}</div>
        <div class="plan-duration">${memData.duration}</div>
        <div class="plan-amount">₱${Number(memData.plan_amount).toLocaleString()} <span>/ plan</span></div>
        <span class="plan-status ${memData.status === "Active" ? "status-active" : "status-inactive"}">
          ${memData.status}
        </span>
      </div>
    `;
  } else {
    document.getElementById("currentPlanBody").innerHTML =
      '<p style="color:#888;">No active plan. Choose one below!</p>';
  }

  // show all plans
  document.getElementById("plansGrid").innerHTML = data
    .map((p) => {
      const isCurrent = p.plan_name === currentPlanName;
      const total = Number(p.plan_amount) + Number(p.joining_fee);
      return `
      <div class="plan-card-option ${isCurrent ? "current-plan" : ""}">
        ${isCurrent ? '<div class="plan-badge">Current Plan</div>' : ""}
        <h4>${p.plan_name}</h4>
        <p class="plan-dur">${p.duration}</p>
        <p class="plan-price">₱${Number(p.plan_amount).toLocaleString()}</p>
        <p class="plan-fee">${Number(p.joining_fee) > 0 ? "+ ₱" + Number(p.joining_fee).toLocaleString() + " joining fee" : "No joining fee"}</p>
        <button
          class="btn-join ${isCurrent ? "current" : ""}"
          onclick="${isCurrent ? "" : `openPaymentModal('${p.plan_id}', '${p.plan_name}', ${p.plan_amount}, ${p.joining_fee})`}"
          ${isCurrent ? "disabled" : ""}
        >
          ${isCurrent ? "Current Plan" : "Join Plan"}
        </button>
      </div>
    `;
    })
    .join("");
}

// Open payment modal
function openPaymentModal(planId, planName, planAmount, joiningFee) {
  selectedPlan = { planId, planName, planAmount, joiningFee };
  const total = Number(planAmount) + Number(joiningFee);

  document.getElementById("paymentSummary").innerHTML = `
    <h4>${planName}</h4>
    <div class="payment-row">
      <span>Plan Amount</span>
      <span>₱${Number(planAmount).toLocaleString()}</span>
    </div>
    <div class="payment-row">
      <span>Joining Fee</span>
      <span>₱${Number(joiningFee).toLocaleString()}</span>
    </div>
    <div class="payment-row">
      <span>Total</span>
      <span>₱${total.toLocaleString()}</span>
    </div>
  `;
  document.getElementById("paymentModal").style.display = "flex";
}

function closePaymentModal() {
  document.getElementById("paymentModal").style.display = "none";
  selectedPlan = null;
}

// Confirm payment and enroll
async function confirmPayment() {
  if (!selectedPlan) return;

  const method = document.getElementById("paymentMethod").value;
  const total =
    Number(selectedPlan.planAmount) + Number(selectedPlan.joiningFee);

  const res = await fetch("api/member_enroll.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      member_id: memberId,
      plan_id: selectedPlan.planId,
      amount: total,
      payment_method: method,
    }),
  });
  const data = await res.json();

  if (data.success) {
    closePaymentModal();
    alert("Successfully enrolled in " + selectedPlan.planName + "!");
    loadPlans(); // refresh plans
    loadOverview(); // refresh stats
    loadMembership(); // refresh membership section
  } else {
    alert("Error: " + data.message);
  }
}

// call loadPlans on load
loadPlans();

// Run all
loadOverview();
loadProfile();
loadMembership();
loadAttendance();
loadPayments();
loadProgress();
loadPrograms();
