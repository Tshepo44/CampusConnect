// ---------------------- INITIAL DATA ----------------------
if (!localStorage.getItem("students")) {
  const students = [
    { studentNumber: "2025001", password: "pass1" },
    { studentNumber: "2025002", password: "pass2" },
    { studentNumber: "2025003", password: "pass3" }
  ];
  localStorage.setItem("students", JSON.stringify(students));
}

if (!localStorage.getItem("tutors")) localStorage.setItem("tutors", JSON.stringify([]));
if (!localStorage.getItem("items")) localStorage.setItem("items", JSON.stringify([]));
if (!localStorage.getItem("groups")) localStorage.setItem("groups", JSON.stringify([]));
if (!localStorage.getItem("counsellingRequests")) localStorage.setItem("counsellingRequests", JSON.stringify([]));
if (!localStorage.getItem("tutorRequests")) localStorage.setItem("tutorRequests", JSON.stringify([]));

const adminAccount = { username: "admin", password: "admin123" };
let loggedInStudent = null;

// ---------------------- LOGOUT ----------------------
function logout() {
  localStorage.removeItem("loggedInStudent");
  loggedInStudent = null;

  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById("home").classList.remove("hidden");
  document.getElementById("logoutBtn").classList.add("hidden");
  document.getElementById("logoutBtn2").classList.add("hidden");
}

// ---------------------- LOGIN ----------------------
function login(role) {
  if (role === "student") {
    const sn = document.getElementById("studentNumber").value.trim();
    const pw = document.getElementById("password").value.trim();
    const students = JSON.parse(localStorage.getItem("students"));
    const student = students.find(s => s.studentNumber === sn && s.password === pw);

    if (student) {
      loggedInStudent = { ...student, role: "student" };
      localStorage.setItem("loggedInStudent", JSON.stringify(loggedInStudent));
      alert("✅ Student login successful!");
      showStudentServices();
    } else {
      alert("❌ Invalid student credentials!");
    }
  } else if (role === "admin") {
    const user = document.getElementById("adminUsername").value.trim();
    const pw = document.getElementById("adminPassword").value.trim();

    if (user === adminAccount.username && pw === adminAccount.password) {
      loggedInStudent = { studentNumber: "Admin", role: "admin" };
      localStorage.setItem("loggedInStudent", JSON.stringify(loggedInStudent));
      alert("✅ Admin login successful!");
      showSection("adminDashboard");
      showAdminServices();
    } else {
      alert("❌ Invalid admin credentials!");
    }
  }

  document.getElementById("logoutBtn").classList.remove("hidden");
  document.getElementById("logoutBtn2").classList.remove("hidden");
}

// ---------------------- SHOW SERVICES ----------------------
function showStudentServices() {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById("tutors").classList.remove("hidden");
  document.getElementById("marketplace").classList.remove("hidden");
  document.getElementById("groups").classList.remove("hidden");
  document.getElementById("counselling").classList.remove("hidden");

  document.getElementById("tutorAdminView").style.display = "none";
  document.getElementById("marketplaceAdminView").style.display = "none";
  document.getElementById("groupAdminView").style.display = "none";
  document.getElementById("counsellingAdminView").style.display = "none";

  displayStudentTutorRequests();
}

function showAdminServices() {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById("adminDashboard").classList.remove("hidden");

  document.getElementById("tutorAdminView").style.display = "block";
  document.getElementById("marketplaceAdminView").style.display = "block";
  document.getElementById("groupAdminView").style.display = "block";
  document.getElementById("counsellingAdminView").style.display = "block";
}

// ---------------------- TUTOR FUNCTIONS ----------------------
function addTutor() {
  const name = document.getElementById("tutorName").value;
  const campus = document.getElementById("tutorCampus").value;
  const course = document.getElementById("tutorCourse").value;
  const module = document.getElementById("tutorModule").value;

  if (!name || !campus || !course || !module) {
    alert("❌ Fill all tutor fields!");
    return;
  }

  const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  tutors.push({ name, campus, course, module });
  localStorage.setItem("tutors", JSON.stringify(tutors));

  alert("✅ Tutor added successfully!");
  document.getElementById("addTutorForm").classList.add("hidden");
  displayTutors();

  document.getElementById("tutorName").value = "";
  document.getElementById("tutorCampus").value = "";
  document.getElementById("tutorCourse").value = "";
  document.getElementById("tutorModule").value = "";
}

function adminAddTutor() {
  const name = prompt("Enter tutor name:");
  const campus = prompt("Enter tutor campus:");
  const course = prompt("Enter tutor course:");
  const module = prompt("Enter tutor module:");

  if (!name || !campus || !course || !module) {
    alert("Please fill all fields!");
    return;
  }

  const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  tutors.push({ name, campus, course, module });
  localStorage.setItem("tutors", JSON.stringify(tutors));

  alert("Tutor added successfully!");
  showTutors();
}

function showTutors() {
  const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  const listContainer = document.getElementById("tutorListAdmin");
  if (!listContainer) return;

  if (tutors.length === 0) {
    listContainer.innerHTML = "<p>No tutors registered yet.</p>";
    return;
  }

  let html = "<h3>Registered Tutors:</h3><ul>";
  tutors.forEach(t => {
    html += `<li>${t.name} - ${t.campus} - ${t.course} - ${t.module}
      <button onclick="deleteTutor('${t.name}')">Delete</button></li>`;
  });
  html += "</ul>";
  listContainer.innerHTML = html;
}

function deleteTutor(name) {
  if (!confirm("Delete this tutor?")) return;
  let tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  tutors = tutors.filter(t => t.name !== name);
  localStorage.setItem("tutors", JSON.stringify(tutors));
  showTutors();
}

// ---------------------- STUDENT TUTOR REQUEST ----------------------
function studentTutorRequest() {
  const campus = prompt("Enter your Campus:");
  const course = prompt("Enter your Course:");
  const module = prompt("Enter the Module:");

  const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  const matches = tutors.filter(t => t.campus === campus || t.course === course || t.module === module);

  if (!matches.length) {
    alert("No tutors available for this selection!");
    return;
  }

  let list = "Available Tutors:\n";
  matches.forEach((t, i) => (list += `${i + 1}. ${t.name} - ${t.course} - ${t.module}\n`));

  const choice = prompt(list + "\nEnter the number of the tutor to request help from:");
  if (!choice || isNaN(choice) || choice < 1 || choice > matches.length) return;

  const helpContent = prompt("Write a short paragraph describing what you want help with:");
  const tutorRequests = JSON.parse(localStorage.getItem("tutorRequests")) || [];

  tutorRequests.push({
    studentNumber: loggedInStudent.studentNumber,
    tutorName: matches[choice - 1].name,
    course,
    module,
    campus,
    content: helpContent,
    status: "Pending",
    notified: false,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem("tutorRequests", JSON.stringify(tutorRequests));
  alert("✅ Request sent to admin. You will be notified when admin responds.");
  displayStudentTutorRequests();
}






















