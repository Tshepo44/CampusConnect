// ---------------------- LOGOUT ----------------------
function logout() {
  localStorage.removeItem("loggedInStudent");
  loggedInStudent = null;
  document.getElementById("login").classList.remove("hidden");
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById("logoutBtn").classList.add("hidden");
}

// ---------------------- PREDEFINED STUDENTS ----------------------
if (!localStorage.getItem("students")) {
  const students = [
    { studentNumber: "2025001", password: "pass1" },
    { studentNumber: "2025002", password: "pass2" },
    { studentNumber: "2025003", password: "pass3" }
  ];
  localStorage.setItem("students", JSON.stringify(students));
}

// ---------------------- ADMIN ACCOUNT ----------------------
const adminAccount = { username: "admin", password: "admin123" };

let loggedInStudent = null;

// ---------------------- LOGIN ----------------------
function login() {
  const studentNumber = document.getElementById("studentNumber").value.trim();
  const password = document.getElementById("password").value.trim();

  // --- ADMIN LOGIN ---
  if (studentNumber === adminAccount.username && password === adminAccount.password) {
    loggedInStudent = { studentNumber: "Admin", role: "admin" };
    localStorage.setItem("loggedInStudent", JSON.stringify(loggedInStudent));
    document.getElementById("login").classList.add("hidden");
    document.getElementById("logoutBtn").classList.remove("hidden");
    showSection("adminDashboard");
    alert("✅ Logged in as Admin!");
    return;
  }

  // --- STUDENT LOGIN ---
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const student = students.find(
    s => s.studentNumber === studentNumber && s.password === password
  );

  if (student) {
    loggedInStudent = student;
    localStorage.setItem("loggedInStudent", JSON.stringify(student));
    document.getElementById("login").classList.add("hidden");
    document.querySelectorAll("section.hidden").forEach(s => s.classList.remove("hidden"));
    document.getElementById("logoutBtn").classList.remove("hidden");
    displayTutors();
    displayItems();
    displayGroups();
    displayCounsellors();
  } else {
    alert("❌ Incorrect student number or password!");
  }
}

// ---------------------- TUTORS ----------------------
function addTutor() {
  const name = document.getElementById("tutorName").value;
  const module = document.getElementById("tutorModule").value;
  const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  tutors.push({ name, module });
  localStorage.setItem("tutors", JSON.stringify(tutors));
  displayTutors();
  document.getElementById("tutorName").value = "";
  document.getElementById("tutorModule").value = "";
}

function displayTutors() {
  const tutorList = document.getElementById("tutorList");
  tutorList.innerHTML = "";
  const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  tutors.forEach(tutor => {
    const div = document.createElement("div");
    div.textContent = `${tutor.name} - ${tutor.module}`;
    tutorList.appendChild(div);
  });
}

function showAddTutor() {
  document.getElementById("addTutorForm").classList.toggle("hidden");
}

// ---------------------- MARKETPLACE ----------------------
function addItem() {
  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const seller = document.getElementById("itemSeller").value;
  const items = JSON.parse(localStorage.getItem("items")) || [];
  items.push({ name, price, seller });
  localStorage.setItem("items", JSON.stringify(items));
  displayItems();
  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemSeller").value = "";
}

function displayItems() {
  const itemList = document.getElementById("itemList");
  itemList.innerHTML = "";
  const items = JSON.parse(localStorage.getItem("items")) || [];
  items.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.name} - R${item.price} (Seller: ${item.seller})`;
    itemList.appendChild(div);
  });
}

function showAddItem() {
  document.getElementById("addItemForm").classList.toggle("hidden");
}

// ---------------------- STUDY GROUPS ----------------------
function addGroup() {
  const subject = document.getElementById("groupSubject").value;
  const time = document.getElementById("groupTime").value;
  const location = document.getElementById("groupLocation").value;
  const organizer = document.getElementById("groupOrganizer").value;
  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  groups.push({ subject, time, location, organizer });
  localStorage.setItem("groups", JSON.stringify(groups));
  displayGroups();
  document.getElementById("groupSubject").value = "";
  document.getElementById("groupTime").value = "";
  document.getElementById("groupLocation").value = "";
  document.getElementById("groupOrganizer").value = "";
}

function displayGroups() {
  const groupList = document.getElementById("groupList");
  groupList.innerHTML = "";
  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  groups.forEach(group => {
    const div = document.createElement("div");
    div.textContent = `${group.subject} - ${group.time} - ${group.location} (Organizer: ${group.organizer})`;
    groupList.appendChild(div);
  });
}

function showAddGroup() {
  document.getElementById("addGroupForm").classList.toggle("hidden");
}

// ---------------------- COUNSELLING ----------------------
function addCounsellor() {
  const name = document.getElementById("counsellorName").value;
  const headline = document.getElementById("counsellorHeadline").value;
  const availability = document.getElementById("counsellorAvailability").value;
  const counsellors = JSON.parse(localStorage.getItem("counsellors")) || [];
  counsellors.push({ name, headline, availability });
  localStorage.setItem("counsellors", JSON.stringify(counsellors));
  displayCounsellors();
  document.getElementById("counsellorName").value = "";
  document.getElementById("counsellorHeadline").value = "";
  document.getElementById("counsellorAvailability").value = "";
}

function displayCounsellors() {
  const counsellorList = document.getElementById("counsellorList");
  counsellorList.innerHTML = "";
  const counsellors = JSON.parse(localStorage.getItem("counsellors")) || [];
  counsellors.forEach(counsellor => {
    const div = document.createElement("div");
    div.textContent = `${counsellor.name} - ${counsellor.headline} - Available: ${counsellor.availability}`;
    counsellorList.appendChild(div);
  });
}

function showAddCounsellor() {
  document.getElementById("addCounsellorForm").classList.toggle("hidden");
}

// ---------------------- LOAD DATA ON PAGE LOAD ----------------------
window.onload = () => {
  const student = JSON.parse(localStorage.getItem("loggedInStudent"));
  if (student) {
    loggedInStudent = student;
    if (student.role === "admin") {
      showSection("adminDashboard");
    } else {
      document.getElementById("login").classList.add("hidden");
      document.querySelectorAll("section.hidden").forEach(s => s.classList.remove("hidden"));
    }
    document.getElementById("logoutBtn").classList.remove("hidden");
  } else {
    document.getElementById("logoutBtn").classList.add("hidden");
  }
  displayTutors();
  displayItems();
  displayGroups();
  displayCounsellors();
};

// ---------------------- ADMIN FUNCTIONS ----------------------
function showRegisteredStudents() {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const content = students.length
    ? students.map(s => `<li>${s.studentNumber}</li>`).join("")
    : "<p>No registered students yet.</p>";

  document.getElementById("adminContent").innerHTML = `
    <h3>Registered Students</h3>
    <ul>${content}</ul>
  `;
}

function clearAllData() {
  if (confirm("Are you sure you want to delete all student data?")) {
    localStorage.removeItem("students");
    localStorage.removeItem("loggedInStudent");
    alert("All data cleared!");
    showSection("login");
  }
}

// ---------------------- SHOW/HIDE SECTIONS ----------------------
function showSection(sectionId) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  const selected = document.getElementById(sectionId);
  if (selected) selected.classList.remove("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");
}

// ---------------------- ADMIN PANEL ----------------------
function showAdminPanel() {
  const adminPanel = document.createElement("div");
  adminPanel.innerHTML = `
    <h2>Admin Dashboard</h2>

    <h3>Manage Students</h3>
    <button onclick="showRegisteredStudents()">View Registered Students</button>
    <button onclick="clearAllData()">Clear All Students</button>
    <div id="adminStudentList"></div>

    <h3>Manage Tutors</h3>
    <button onclick="adminAddTutor()">Add Tutor</button>
    <button onclick="adminDeleteTutor()">Delete All Tutors</button>

    <h3>Manage Marketplace Items</h3>
    <button onclick="adminAddItem()">Add Item</button>
    <button onclick="adminDeleteItems()">Delete All Items</button>

    <h3>Manage Study Groups</h3>
    <button onclick="adminAddGroup()">Add Study Group</button>
    <button onclick="adminDeleteGroups()">Delete All Groups</button>

    <h3>Manage Counsellors</h3>
    <button onclick="adminAddCounsellor()">Add Counsellor</button>
    <button onclick="adminDeleteCounsellors()">Delete All Counsellors</button>
  `;
  document.body.innerHTML = "";
  document.body.appendChild(adminPanel);
}

// ---------------------- ADMIN DELETE FUNCTIONS ----------------------
function adminDeleteTutor() {
  if(confirm("Delete all tutors?")) {
    localStorage.removeItem("tutors");
    alert("All tutors deleted!");
  }
}

function adminDeleteItems() {
  if(confirm("Delete all marketplace items?")) {
    localStorage.removeItem("items");
    alert("All items deleted!");
  }
}

function adminDeleteGroups() {
  if(confirm("Delete all study groups?")) {
    localStorage.removeItem("groups");
    alert("All study groups deleted!");
  }
}

function adminDeleteCounsellors() {
  if(confirm("Delete all counsellors?")) {
    localStorage.removeItem("counsellors");
    alert("All counsellors deleted!");
  }
}

// Update showRegisteredStudents to display inside adminStudentList
function showRegisteredStudents() {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const content = students.length
    ? students.map(s => `<li>${s.studentNumber}</li>`).join("")
    : "<p>No registered students yet.</p>";

  document.getElementById("adminStudentList").innerHTML = `
    <ul>${content}</ul>
  `;
}















