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
  showTutors(); // <- updates the list in Tutor Management
}


// Display all tutors inside Tutor Management
function showTutors() {
  const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  const listContainer = document.getElementById("tutorListAdmin"); // <- IMPORTANT

  if (!listContainer) return; // safety check

  if (tutors.length === 0) {
    listContainer.innerHTML = "<p>No tutors registered yet.</p>";
    return;
  }

  let html = "<h3>Registered Tutors:</h3><ul>";
  tutors.forEach((t, i) => {
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
  showTutors(); // <- updates the list after deletion
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
  matches.forEach((t, i) => list += `${i+1}. ${t.name} - ${t.course} - ${t.module}\n`);
  const choice = prompt(list + "\nEnter the number of the tutor to request help from:");
  if (!choice || isNaN(choice) || choice < 1 || choice > matches.length) return;
  const helpContent = prompt("Write a short paragraph describing what you want help with:");

  const tutorRequests = JSON.parse(localStorage.getItem("tutorRequests")) || [];
  tutorRequests.push({
    studentNumber: loggedInStudent.studentNumber,
    tutorName: matches[choice-1].name,
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
  displayStudentTutorRequests(); // show updates right away
}

 
// ---------------------- ADMIN TUTOR REQUESTS ---------------------- 
// Global toggle variable (put this at the top of your app.js)
let tutorRequestsVisible = false;

// Function to display/hide Pending Tutor Requests in Admin Portal
function displayTutorRequestsAdmin() {
  const container = document.getElementById("tutorRequestsAdmin");
  if (!container) return;

  // Toggle visibility
  tutorRequestsVisible = !tutorRequestsVisible;
  if (!tutorRequestsVisible) {
    container.innerHTML = ""; // hide requests
    return;
  }

  // Get only Pending requests
  const requests = (JSON.parse(localStorage.getItem("tutorRequests")) || [])
                     .filter(r => r.status === "Pending");

  container.innerHTML = "<h3>Pending Tutor Requests</h3>";

  if (!requests.length) {
    container.innerHTML += "<p>No pending requests.</p>";
    return;
  }

  requests.forEach((r, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${r.studentNumber}</strong> requested <strong>${r.tutorName}</strong> for ${r.course}-${r.module} at ${r.campus}.<br>
      Content: ${r.content}<br>
      Status: ${r.status}
    `;
    const acceptBtn = document.createElement("button");
    acceptBtn.textContent = "Accept";
    acceptBtn.onclick = () => respondTutorRequest(r.studentNumber, r.tutorName, "Accepted");

    const rejectBtn = document.createElement("button");
    rejectBtn.textContent = "Reject";
    rejectBtn.onclick = () => respondTutorRequest(r.studentNumber, r.tutorName, "Rejected");

    div.appendChild(acceptBtn);
    div.appendChild(rejectBtn);

    container.appendChild(div);
  });
}

// Modified respondTutorRequest to accept studentNumber and tutorName for correct index handling
function respondTutorRequest(studentNumber, tutorName, status) {
  const requests = JSON.parse(localStorage.getItem("tutorRequests")) || [];
  const index = requests.findIndex(r => r.studentNumber === studentNumber && r.tutorName === tutorName && r.status === "Pending");
  if (index === -1) return;

  const adminMessage = prompt(
    `Write a short paragraph describing how, where, and when the session will take place.\n\nExample:\nSession will be held at Library Room 2 on Tuesday at 2 PM.`
  );

  requests[index].status = status;
  requests[index].adminMessage = adminMessage || "No details provided.";
  requests[index].notified = false; // student hasn’t seen update yet

  localStorage.setItem("tutorRequests", JSON.stringify(requests));
  alert(`Request ${status}. Message sent to student.`);

  // Refresh admin requests display (only pending will show)
  displayTutorRequestsAdmin();
}





 
// ---------------------- TODO: Marketplace, Study Groups, Counselling ---------------------- 
// For brevity, the logic pattern is same as tutor requests, with: 
 // Student: prompt for info -> store in localStorage 
 // Admin: view -> accept/reject or delete -> respond 
// Implement all interactions similarly 
 
// ---------------------- SHOW/HIDE SECTIONS ---------------------- 
function showSection(sectionId) { 
 document.querySelectorAll("section").forEach(s => s.classList.add("hidden")); 
 const sel = document.getElementById(sectionId); 
 if (sel) sel.classList.remove("hidden"); 
} 
 
// ---------------------- ON LOAD ---------------------- 
window.onload = () => { 
 const user = JSON.parse(localStorage.getItem("loggedInStudent")); 
 if (user) { 
   loggedInStudent = user; 
   if (user.role === "admin") showAdminServices(); 
   else showStudentServices(); 
 } 
};
// Open Tutor Management tab
function openTutorManagement() {
  const adminContent = document.getElementById("adminContent");

  adminContent.innerHTML = `
    <h3>Tutor Management</h3>
    <button id="showAddTutorFormBtn">Add Tutor</button>
    <button onclick="clearTutors()">Delete All Tutors</button>

    <!-- Tutor List -->
    <div id="tutorListAdmin"></div>

    <!-- Add Tutor Form -->
    <div id="tutorFormAdmin" class="hidden">
      <input id="adminTutorName" placeholder="Tutor Name">
      <input id="adminTutorCampus" placeholder="Campus">
      <input id="adminTutorCourse" placeholder="Course">
      <input id="adminTutorModule" placeholder="Module">
      <button id="submitTutorBtn">Save Tutor</button>
      <button id="cancelTutorBtn">Back</button>
    </div>
  `;

  // Show tutors immediately if any
  showTutors();

  // ✅ These event listeners are now inside the function, so they work!
  document.getElementById("showAddTutorFormBtn").onclick = () => {
    document.getElementById("tutorFormAdmin").classList.remove("hidden");
  };

  document.getElementById("cancelTutorBtn").onclick = () => {
    document.getElementById("tutorFormAdmin").classList.add("hidden");
  };

  document.getElementById("submitTutorBtn").onclick = () => {
    const name = document.getElementById("adminTutorName").value;
    const campus = document.getElementById("adminTutorCampus").value;
    const course = document.getElementById("adminTutorCourse").value;
    const module = document.getElementById("adminTutorModule").value;

    if (!name || !campus || !course || !module) {
      alert("Please fill all fields!");
      return;
    }

    const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
    tutors.push({ name, campus, course, module });
    localStorage.setItem("tutors", JSON.stringify(tutors));

    alert("Tutor added successfully!");
    showTutors();

    // Clear and hide the form
    document.getElementById("adminTutorName").value = "";
    document.getElementById("adminTutorCampus").value = "";
    document.getElementById("adminTutorCourse").value = "";
    document.getElementById("adminTutorModule").value = "";
    document.getElementById("tutorFormAdmin").classList.add("hidden");
  };
}



// Show all tutor requests the student has made
function displayStudentTutorRequests() {
  const studentContent = document.getElementById("studentContent");
  const requests = JSON.parse(localStorage.getItem("tutorRequests")) || [];

  const loggedInStudent = JSON.parse(localStorage.getItem("loggedInStudent"));
  if (!loggedInStudent) return;

  const myRequests = requests.filter(r => r.studentNumber === loggedInStudent.studentNumber);

  studentContent.innerHTML = "<h3>My Tutor Requests</h3>";

  if (myRequests.length === 0) {
    studentContent.innerHTML += "<p>You haven't made any tutor requests yet.</p>";
    return;
  }

  myRequests.forEach((req, i) => {
    studentContent.innerHTML += `
      <div class="request-box">
        <p><strong>Module:</strong> ${req.module}</p>
        <p><strong>Requested Tutor:</strong> ${req.tutorName}</p>
        <p><strong>Status:</strong> ${req.status}</p>
        ${req.adminMessage ? `<p><strong>Admin Message:</strong> ${req.adminMessage}</p>` : ""}
        <button onclick="deleteStudentRequest(${i})" class="delete-btn">🗑️ Delete Request</button>
      </div>
      <hr>
    `;
  });
}
// 🗑️ Allow student to delete their own requests
function deleteStudentRequest(index) {
  if (!confirm("Are you sure you want to delete this request?")) return;

  const requests = JSON.parse(localStorage.getItem("tutorRequests")) || [];
  const loggedInStudent = JSON.parse(localStorage.getItem("loggedInStudent"));
  if (!loggedInStudent) return;

  // Filter out this student's requests
  const myRequests = requests.filter(r => r.studentNumber === loggedInStudent.studentNumber);
  const requestToDelete = myRequests[index];

  // Remove the specific request from main list
  const updatedRequests = requests.filter(r =>
    !(r.studentNumber === requestToDelete.studentNumber &&
      r.tutorName === requestToDelete.tutorName &&
      r.course === requestToDelete.course &&
      r.module === requestToDelete.module)
  );

  // Save back to localStorage
  localStorage.setItem("tutorRequests", JSON.stringify(updatedRequests));

  alert("Request deleted successfully!");
  displayStudentTutorRequests();
}























