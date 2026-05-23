function formatTime(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return h12 + ":" + minutes + " " + ampm;
}

const user = JSON.parse(localStorage.getItem("user"));
user.staff_role; // e.g. 'Maintenance', 'Trainer', 'Receptionist'

if (!user) window.location.href = "index.html";

document.getElementById("sidebarUser").textContent =
  user.first_name + " " + user.last_name;
document.getElementById("topbarUser").textContent =
  "Hi, " + user.first_name + "!";

const role = user.staff_role || user.role; // staff_role from gym_staff, role from users
const roleEl = document.getElementById("sidebarRole");
roleEl.textContent = role;
roleEl.className = "role-badge role-" + role.toLowerCase();

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

// Switch sections
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

  // reload data when switching sections
  if (name === "attendance") loadAttendance();
  if (name === "payments") loadPayments();
  if (name === "members") loadMembers();
  if (name === "equipment") loadEquipment();
  if (name === "programs") loadPrograms();
  if (name === "plans") loadPlans();
}

// Search/filter any table
function filterTable(tableId, query) {
  const rows = document.querySelectorAll("#" + tableId + " tbody tr");
  const q = query.toLowerCase();
  rows.forEach((row) => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
  });
}

// Load all data
async function loadStats() {
  const res = await fetch("api/dashboard.php");
  const data = await res.json();
  document.getElementById("totalMembers").textContent = data.members;
  document.getElementById("totalAttendance").textContent = data.attendance;
  document.getElementById("totalPayments").textContent =
    "₱" + Number(data.payments).toLocaleString();
  document.getElementById("totalEquipment").textContent = data.equipment;
}

async function loadMembers() {
  const res = await fetch("api/members.php");
  const data = await res.json();
  const body = document.getElementById("membersBody");
  body.innerHTML = data
    .map(
      (m) => `
    <tr>
      <td>${m.member_id}</td>
      <td>${m.first_name} ${m.last_name}</td>
      <td>${m.gender}</td>
      <td>${m.phone_number}</td>
      <td>${m.email}</td>
      <td>${m.city}</td>
      <td>${m.birthday}</td>
    </tr>
  `,
    )
    .join("");
}

async function loadAttendance() {
  const res = await fetch("api/attendance.php");
  const data = await res.json();
  const body = document.getElementById("attendanceBody");
  if (!data.length) {
    body.innerHTML =
      '<tr><td colspan="5" style="text-align:center; color:#888;">No attendance records</td></tr>';
    return;
  }
  body.innerHTML = data
    .map(
      (a) => `
    <tr>
      <td>${a.attendance_id}</td>
      <td>${a.member_name}</td>
      <td>${a.date}</td>
      <td>${formatTime(a.time_in)}</td>
      <td>${a.time_out === "00:00:00" ? "Not yet" : formatTime(a.time_out)}</td>
    </tr>
  `,
    )
    .join("");
}

// Check role and hide maintenance buttons if not maintenance
function checkRole() {
  if (user.staff_role !== "Maintenance") {
    document.body.classList.add("hide-maintenance");
  }
}

// call it on load
checkRole();

let deleteTargetId = null;

// Updated loadEquipment with edit/delete buttons
async function loadEquipment() {
  const res = await fetch("api/equipment.php");
  const data = await res.json();
  const body = document.getElementById("equipmentBody");
  body.innerHTML = data
    .map(
      (e) => `
    <tr>
      <td>${e.equipment_id}</td>
      <td>${e.equipment_name}</td>
      <td>${e.category}</td>
      <td>${e.quantity}</td>
      <td>₱${Number(e.amount).toLocaleString()}</td>
      <td class="maintenance-only">
        <button class="btn-edit" onclick="openEditEquipment('${e.equipment_id}', '${e.equipment_name}', '${e.category}', ${e.quantity}, ${e.amount})">
          Edit
        </button>
        <button class="btn-delete" onclick="openDeleteModal('${e.equipment_id}', '${e.equipment_name}')">
          Delete
        </button>
      </td>
    </tr>
  `,
    )
    .join("");
}

// Open modal for adding
function openAddEquipment() {
  document.getElementById("modalTitle").textContent = "Add Equipment";
  document.getElementById("equipmentId").value = "";
  document.getElementById("equipmentName").value = "";
  document.getElementById("equipmentCategory").value = "Cardio";
  document.getElementById("equipmentQty").value = "";
  document.getElementById("equipmentAmount").value = "";
  document.getElementById("equipmentModal").style.display = "flex";
}

// Open modal for editing — pre-fill the form
function openEditEquipment(id, name, category, qty, amount) {
  document.getElementById("modalTitle").textContent = "Edit Equipment";
  document.getElementById("equipmentId").value = id;
  document.getElementById("equipmentName").value = name;
  document.getElementById("equipmentCategory").value = category;
  document.getElementById("equipmentQty").value = qty;
  document.getElementById("equipmentAmount").value = amount;
  document.getElementById("equipmentModal").style.display = "flex";
}

// Close modal
function closeModal() {
  document.getElementById("equipmentModal").style.display = "none";
}

// Save — handles both add and edit
async function saveEquipment() {
  const id = document.getElementById("equipmentId").value;
  const name = document.getElementById("equipmentName").value.trim();
  const cat = document.getElementById("equipmentCategory").value;
  const qty = document.getElementById("equipmentQty").value;
  const amount = document.getElementById("equipmentAmount").value;

  if (!name || !qty || !amount) {
    alert("Please fill in all fields");
    return;
  }

  const body = {
    equipment_name: name,
    category: cat,
    quantity: qty,
    amount: amount,
  };

  // if id exists = edit, if not = add
  if (id) body.equipment_id = id;

  const res = await fetch("api/equipment_save.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (data.success) {
    closeModal();
    loadEquipment(); // reload the table
  } else {
    alert("Error: " + data.message);
  }
}

// Open delete confirmation
function openDeleteModal(id, name) {
  deleteTargetId = id;
  document.getElementById("deleteEquipmentName").textContent = name;
  document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
  deleteTargetId = null;
}

// Confirm delete
async function confirmDelete() {
  const res = await fetch("api/equipment_delete.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ equipment_id: deleteTargetId }),
  });
  const data = await res.json();

  if (data.success) {
    closeDeleteModal();
    loadEquipment(); // reload the table
  } else {
    alert("Error: " + data.message);
  }
}

async function loadPayments() {
  const res = await fetch("api/payments.php");
  const data = await res.json();
  const body = document.getElementById("paymentsBody");
  body.innerHTML = data
    .map(
      (p) => `
    <tr>
      <td>${p.payment_id}</td>
      <td>${p.member_name}</td>
      <td>₱${Number(p.amount).toLocaleString()}</td>
      <td>${p.date}</td>
      <td>${p.payment_method}</td>
    </tr>
  `,
    )
    .join("");
}

async function loadPrograms() {
  const res = await fetch("api/programs.php");
  const data = await res.json();
  const body = document.getElementById("programsBody");
  body.innerHTML = data
    .map(
      (p) => `
    <tr>
      <td>${p.program_id}</td>
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

// Generate QR for staff
function generateStaffQR() {
  const qrId = user.staff_id;
  document.getElementById("staffQrIdText").textContent = qrId;
  document.getElementById("staffQrName").textContent =
    user.first_name + " " + user.last_name;
  document.getElementById("staffQrRole").textContent =
    user.staff_role || "Staff";

  new QRCode(document.getElementById("staffQR"), {
    text: qrId,
    width: 200,
    height: 200,
    colorDark: "#0F6E56",
    colorLight: "#ffffff",
  });
}

function downloadQR() {
  const canvas = document.querySelector("#staffQR canvas");
  const link = document.createElement("a");
  link.download = "gymro-qr-" + user.staff_id + ".png";
  link.href = canvas.toDataURL();
  link.click();
}

generateStaffQR();

// Check receptionist role
function checkRole() {
  if (user.staff_role !== "Maintenance") {
    document.body.classList.add("hide-maintenance");
  }
  if (user.staff_role !== "Receptionist") {
    document.body.classList.add("hide-receptionist");
  }
}

let selectedEnrollPlan = null;

async function loadPlans() {
  const res = await fetch("api/plans.php");
  const data = await res.json();

  // plans table
  document.getElementById("plansBody").innerHTML = data
    .map(
      (p) => `
    <tr>
      <td>${p.plan_name}</td>
      <td>${p.duration}</td>
      <td>₱${Number(p.plan_amount).toLocaleString()}</td>
      <td>₱${Number(p.joining_fee).toLocaleString()}</td>
      <td class="receptionist-only">
        <button class="btn-edit" onclick="openEnrollModal('${p.plan_id}', '${p.plan_name}', ${p.plan_amount}, ${p.joining_fee})">
          Enroll Member
        </button>
      </td>
    </tr>
  `,
    )
    .join("");

  // enrollments table
  const enRes = await fetch("api/enrollments.php");
  const enData = await enRes.json();

  document.getElementById("enrollBody").innerHTML = enData
    .map(
      (e) => `
    <tr>
      <td>${e.enrollment_id}</td>
      <td>${e.member_name}</td>
      <td>${e.plan_name}</td>
      <td>
        <span class="plan-status ${e.status === "Active" ? "status-active" : "status-inactive"}">
          ${e.status}
        </span>
      </td>
    </tr>
  `,
    )
    .join("");
}

function openEnrollModal(planId, planName, planAmount, joiningFee) {
  selectedEnrollPlan = { planId, planName, planAmount, joiningFee };
  const total = Number(planAmount) + Number(joiningFee);

  document.getElementById("enrollPlanInfo").innerHTML = `
    <h4>${planName}</h4>
    <div class="payment-row"><span>Plan Amount</span><span>₱${Number(planAmount).toLocaleString()}</span></div>
    <div class="payment-row"><span>Joining Fee</span><span>₱${Number(joiningFee).toLocaleString()}</span></div>
    <div class="payment-row"><span>Total</span><span>₱${total.toLocaleString()}</span></div>
  `;
  document.getElementById("enrollMemberId").value = "";
  document.getElementById("enrollModal").style.display = "flex";
}

function closeEnrollModal() {
  document.getElementById("enrollModal").style.display = "none";
  selectedEnrollPlan = null;
}

async function confirmEnroll() {
  const memberId = document.getElementById("enrollMemberId").value.trim();
  const method = document.getElementById("enrollPaymentMethod").value;
  const total =
    Number(selectedEnrollPlan.planAmount) +
    Number(selectedEnrollPlan.joiningFee);

  if (!memberId) {
    alert("Please enter a Member ID");
    return;
  }

  const res = await fetch("api/member_enroll.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      member_id: memberId,
      plan_id: selectedEnrollPlan.planId,
      amount: total,
      payment_method: method,
    }),
  });
  const data = await res.json();

  if (data.success) {
    closeEnrollModal();
    alert("Member enrolled successfully!");
    loadPlans();
  } else {
    alert("Error: " + data.message);
  }
}

// add to load calls
loadPlans();

// Run everything
loadStats();
loadMembers();
loadAttendance();
loadEquipment();
loadPayments();
loadPrograms();
