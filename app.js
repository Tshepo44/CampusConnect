// ---------------------- STORAGE ----------------------
if (!localStorage.getItem("students")) {
  const students = [
    { studentNumber: "2025001", password: "pass1", campus: "", course: "", module: "" },
    { studentNumber: "2025002", password: "pass2", campus: "", course: "", module: "" },
    { studentNumber: "2025003", password: "pass3", campus: "", course: "", module: "" }
  ];
  localStorage.setItem("students", JSON.stringify(students));
}

if (!localStorage.getItem("tutors")) localStorage.setItem("tutors", JSON.stringify([]));
if (!localStorage.getItem("items")) localStorage.setItem("items", JSON.stringify([]));
if (!localStorage.getItem("groups")) localStorage.setItem("groups", JSON.stringify([]));
if (!localStorage.getItem("counselling")) localStorage.setItem("counselling", JSON.stringify([]));
if (!localStorage.getItem("tutorRequests")) localStorage.setItem("tutorRequests", JSON.stringify([]));
if (!localStorage.getItem("counsellingRequests")) localStorage.setItem("counsellingRequests", JSON.stringify([]));

// ---------------------- LOGIN ----------------------
const adminAccount = { username: "admin", password: "admin123" };
let loggedInUser = null;

function login(type) {
  if (type === "student") {
    const sn = document.getElementById("studentNumber").value.trim();
    const pw = document.getElementById("password").value.trim();
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const student = students.find(s => s.studentNumber === sn && s.password === pw);
    if (student) {
      loggedInUser = { ...student, role: "student" };
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      document.getElementById("welcome").classList.add("hidden");
      document.getElementById("studentDashboard").classList.remove("hidden");
      document.getElementById("logoutBtn").classList.remove("hidden");
      alert("✅ Logged in as Student!");
    } else alert("❌ Invalid Student Number or Password!");
  } else {
    const u = document.getElementById("adminUsername").value.trim();
    const p = document.getElementById("adminPassword").value.trim();
    if (u === adminAccount.username && p === adminAccount.password) {
      loggedInUser = { username: "Admin", role: "admin" };
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      document.getElementById("welcome").classList.add("hidden");
      document.getElementById("adminDashboard").classList.remove("hidden");
      document.getElementById("logoutBtn").classList.remove("hidden");
      alert("✅ Logged in as Admin!");
    } else alert("❌ Invalid Admin Credentials!");
  }
}

// ---------------------- LOGOUT ----------------------
function logout() {
  localStorage.removeItem("loggedInUser");
  loggedInUser = null;
  document.getElementById("welcome").classList.remove("hidden");
  document.getElementById("studentDashboard").classList.add("hidden");
  document.getElementById("adminDashboard").classList.add("hidden");
  document.getElementById("logoutBtn").classList.add("hidden");
}

// ---------------------- STUDENT SERVICES ----------------------
function showStudentService(service) {
  const container = document.getElementById("studentServiceContent");
  container.innerHTML = "";

  if (service === "tutors") {
    container.innerHTML = `
      <h3>Tutors</h3>
      <input id="stuCampus" placeholder="Enter Campus">
      <input id="stuCourse" placeholder="Enter Course">
      <input id="stuModule" placeholder="Enter Module">
      <button onclick="findTutors()">Find Tutors</button>
      <div id="tutorResults"></div>
    `;
  } else if (service === "marketplace") {
    container.innerHTML = `
      <h3>Marketplace</h3>
      <select id="buySellChoice">
        <option value="">Select Option</option>
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>
      <div id="marketplaceContent"></div>
    `;
  } else if (service === "groups") {
    container.innerHTML = `
      <h3>Study Groups</h3>
      <button onclick="studentCreateGroup()">Create Study Group</button>
      <button onclick="studentFindGroup()">Find Study Group</button>
      <div id="groupContent"></div>
    `;
  } else if (service === "counselling") {
    container.innerHTML = `
      <h3>Counselling</h3>
      <input id="counCampus" placeholder="Enter Campus">
      <select id="counTopic">
        <option value="">Select Topic</option>
        <option>Mental Health</option>
        <option>Relationship Issues</option>
        <option>Academic Struggles</option>
        <option>Career Development</option>
        <option>Personal Growth</option>
        <option>Campus Life Adjustment</option>
        <option>Grief & Loss</option>
        <option>Substance Abuse</option>
      </select>
      <select id="counMode">
        <option value="">Select Mode</option>
        <option>Online</option>
        <option>In Person</option>
      </select>
      <button onclick="sendCounsellingRequest()">Send Request</button>
    `;
  }
}

// ---------------------- INIT ----------------------
window.onload = () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    loggedInUser = user;
    document.getElementById("welcome").classList.add("hidden");
    if (user.role === "student") document.getElementById("studentDashboard").classList.remove("hidden");
    else document.getElementById("adminDashboard").classList.remove("hidden");
    document.getElementById("logoutBtn").classList.remove("hidden");
  }
};























