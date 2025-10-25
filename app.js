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
  document.getElementById("loginBtn").onclick = login;

}

// ---------------------- LOGIN ----------------------
function login(role) {
  if (role === "student") {
    const sn = document.getElementById("studentNumber").value.trim();
    const pw = document.getElementById("password").value.trim();
    const students = JSON.parse(localStorage.getItem("students")) || [];
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
      showAdminServices();
    } else {
      alert("❌ Invalid admin credentials!");
    }
  }

  document.getElementById("logoutBtn").classList.remove("hidden");
}

// ---------------------- SHOW SERVICES ----------------------
function showStudentServices() {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById("tutors").classList.remove("hidden");
  document.getElementById("marketplace").classList.remove("hidden");
  document.getElementById("groups").classList.remove("hidden");
  document.getElementById("counselling").classList.remove("hidden");

  // Hide admin-only views inside these sections
  document.getElementById("tutorAdminView").style.display = "none";
  document.getElementById("marketplaceAdminView").style.display = "none";
  document.getElementById("groupAdminView").style.display = "none";

  displayStudentTutorRequests();
}

function showAdminServices() {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById("adminDashboard").classList.remove("hidden");

  // show admin subsections for management
  document.getElementById("tutorAdminView").style.display = "block";
  document.getElementById("marketplaceAdminView").style.display = "block";
  document.getElementById("groupAdminView").style.display = "block";
}

// ---------------------- TUTOR FUNCTIONS ----------------------
function addTutor() {
  const name = document.getElementById("tutorName").value.trim();
  const campus = document.getElementById("tutorCampus").value.trim();
  const course = document.getElementById("tutorCourse").value.trim();
  const module = document.getElementById("tutorModule").value.trim();
  if (!name || !campus || !course || !module) {
    alert("❌ Fill all tutor fields!");
    return;
  }
  const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  tutors.push({ name, campus, course, module });
  localStorage.setItem("tutors", JSON.stringify(tutors));
  alert("✅ Tutor added successfully!");
  document.getElementById("addTutorForm").classList.add("hidden");
  showTutors();
  document.getElementById("tutorName").value = "";
  document.getElementById("tutorCampus").value = "";
  document.getElementById("tutorCourse").value = "";
  document.getElementById("tutorModule").value = "";
}

function showTutors() {
  const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  const listContainer = document.getElementById("tutorList");
  if (!listContainer) return;
  if (tutors.length === 0) {
    listContainer.innerHTML = "<p>No tutors registered yet.</p>";
    return;
  }
  let html = "<h3>Registered Tutors:</h3><ul>";
  tutors.forEach((t, i) => {
    html += `<li>${t.name} - ${t.campus} - ${t.course} - ${t.module} <button onclick="deleteTutor('${t.name}')">Delete</button></li>`;
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

function openTutorManagement() {
  const adminContent = document.getElementById("adminContent");
  // toggle: simple show/hide admin content area for tutors
  // We'll reuse adminContent for other lists; here create tutor UI
  adminContent.innerHTML = `
    <h3>Tutor Management</h3>
    <div id="tutorFormAdmin" style="margin-bottom:20px;">
      <input id="adminTutorName" placeholder="Tutor Name"><br><br>
      <input id="adminTutorCampus" placeholder="Campus"><br><br>
      <input id="adminTutorCourse" placeholder="Course"><br><br>
      <input id="adminTutorModule" placeholder="Module"><br><br>
      <button id="submitTutorBtn">💾 Save Tutor</button>
    </div>
    <button onclick="clearTutors()">🗑️ Delete All Tutors</button>
    <div id="tutorListAdmin"></div>
  `;
  showTutorsForAdmin();
  document.getElementById("submitTutorBtn").onclick = saveTutor;
}

function saveTutor() {
  const name = document.getElementById("adminTutorName").value.trim();
  const campus = document.getElementById("adminTutorCampus").value.trim();
  const course = document.getElementById("adminTutorCourse").value.trim();
  const module = document.getElementById("adminTutorModule").value.trim();
  if (!name || !campus || !course || !module) {
    alert("Please fill in all fields!");
    return;
  }
  const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  tutors.push({ name, campus, course, module });
  localStorage.setItem("tutors", JSON.stringify(tutors));
  alert("Tutor added successfully!");
  document.getElementById("adminTutorName").value = "";
  document.getElementById("adminTutorCampus").value = "";
  document.getElementById("adminTutorCourse").value = "";
  document.getElementById("adminTutorModule").value = "";
  showTutorsForAdmin();
}

function showTutorsForAdmin() {
  const tutors = JSON.parse(localStorage.getItem("tutors")) || [];
  const listContainer = document.getElementById("tutorListAdmin");
  if (!listContainer) return;
  if (tutors.length === 0) {
    listContainer.innerHTML = "<p>No tutors registered yet.</p>";
    return;
  }
  let html = "<h4>Registered Tutors:</h4><ul>";
  tutors.forEach((t, i) => {
    html += `<li>${t.name} - ${t.campus} - ${t.course} - ${t.module} <button onclick="deleteTutor('${t.name}')">Delete</button></li>`;
  });
  html += "</ul>";
  listContainer.innerHTML = html;
}

function clearTutors() {
  if (!confirm("Delete all tutors?")) return;
  localStorage.setItem("tutors", JSON.stringify([]));
  showTutorsForAdmin();
  showTutors();
  alert("All tutors deleted.");
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
  const logged = JSON.parse(localStorage.getItem("loggedInStudent"));
  if (!logged) return alert("Please log in first!");

  const tutorRequests = JSON.parse(localStorage.getItem("tutorRequests")) || [];
  tutorRequests.push({
    studentNumber: logged.studentNumber,
    tutorName: matches[choice-1].name,
    course,
    module,
    campus,
    content: helpContent,
    status: "Pending",
    adminMessage: "",
    createdAt: new Date().toISOString()
  });
  localStorage.setItem("tutorRequests", JSON.stringify(tutorRequests));
  alert("✅ Request sent to admin. You will be notified when admin responds.");
  displayStudentTutorRequests();
}

// ---------------------- ADMIN TUTOR REQUESTS ----------------------
// toggle
let tutorRequestsVisible = false;
function displayTutorRequestsAdmin() {
  const container = document.getElementById("tutorRequestsAdmin");
  if (!container) return;
  tutorRequestsVisible = !tutorRequestsVisible;
  if (!tutorRequestsVisible) {
    container.innerHTML = "";
    return;
  }

  const requests = (JSON.parse(localStorage.getItem("tutorRequests")) || []).filter(r => r.status === "Pending");
  container.innerHTML = "<h3>Pending Tutor Requests</h3>";
  if (!requests.length) {
    container.innerHTML += "<p>No pending requests.</p>";
    return;
  }
  requests.forEach((r, i) => {
    const div = document.createElement("div");
    div.style = "border:1px solid #ccc;padding:10px;margin:10px;border-radius:10px;";
    div.innerHTML = `<strong>${r.studentNumber}</strong> requested <strong>${r.tutorName}</strong> for ${r.course}-${r.module} at ${r.campus}.<br>Content: ${r.content}<br>Status: ${r.status}`;
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

function respondTutorRequest(studentNumber, tutorName, status) {
  const requests = JSON.parse(localStorage.getItem("tutorRequests")) || [];
  const index = requests.findIndex(r => r.studentNumber === studentNumber && r.tutorName === tutorName && r.status === "Pending");
  if (index === -1) return;
  const adminMessage = prompt(`Write a short paragraph describing how, where, and when the session will take place.\n\nExample:\nSession will be held at Library Room 2 on Tuesday at 2 PM.`);
  requests[index].status = status;
  requests[index].adminMessage = adminMessage || "No details provided.";
  localStorage.setItem("tutorRequests", JSON.stringify(requests));
  alert(`Request ${status}. Message sent to student.`);
  displayTutorRequestsAdmin();
  // student will see adminMessage in their "My Tutor Requests" view
}

// Show student's tutor requests
function displayStudentTutorRequests() {
  const studentContent = document.getElementById("tutorRequests");
  const requests = JSON.parse(localStorage.getItem("tutorRequests")) || [];
  const logged = JSON.parse(localStorage.getItem("loggedInStudent"));
  if (!logged) return;
  const myRequests = requests.filter(r => r.studentNumber === logged.studentNumber);
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
      <hr/>
    `;
  });
}

function deleteStudentRequest(index) {
  if (!confirm("Are you sure you want to delete this request?")) return;
  const requests = JSON.parse(localStorage.getItem("tutorRequests")) || [];
  const logged = JSON.parse(localStorage.getItem("loggedInStudent"));
  if (!logged) return;
  const myRequests = requests.filter(r => r.studentNumber === logged.studentNumber);
  const requestToDelete = myRequests[index];
  const updated = requests.filter(r => !(r.studentNumber === requestToDelete.studentNumber && r.tutorName === requestToDelete.tutorName && r.course === requestToDelete.course && r.module === requestToDelete.module));
  localStorage.setItem("tutorRequests", JSON.stringify(updated));
  alert("Request deleted successfully!");
  displayStudentTutorRequests();
}

// ---------------------- MARKETPLACE ----------------------
let buyVisible = false;
let myPostsVisible = false;

function marketplaceAction(action) {
  const container = document.getElementById("itemList");

  if (action === "sell") {
    const sellerName = prompt("Enter your full name (Name and Surname):");
    if (!sellerName) return alert("❌ Seller name required!");
    const contact = prompt("Enter your cell number and email (e.g., 0712345678 / example@email.com):");
    if (!contact) return alert("❌ Contact details required!");
    const location = prompt("Enter your location (Campus or City):");
    if (!location) return alert("❌ Location required!");
    const itemName = prompt("Enter the name of the item you want to sell:");
    if (!itemName) return alert("❌ Item name required!");
    const itemPrice = prompt("Enter the price of your item:");
    if (!itemPrice) return alert("❌ Item price required!");
    let confirmMsg = `Please confirm your post details:\n\n👤 Name: ${sellerName}\n📞 Contact: ${contact}\n📍 Location: ${location}\n📦 Item: ${itemName}\n💰 Price: R${itemPrice}\n\n✅ Press OK to post`;
    if (confirm(confirmMsg)) {
      const logged = JSON.parse(localStorage.getItem("loggedInStudent"));
      if (!logged) return alert("Please log in first!");
      const items = JSON.parse(localStorage.getItem("items")) || [];
      const newItem = {
        id: Date.now(),
        sellerNumber: logged.studentNumber,
        sellerName,
        contact,
        location,
        itemName,
        itemPrice,
        status: "Pending",
        sellerNotified: false,
        createdAt: new Date().toISOString()
      };
      items.push(newItem);
      localStorage.setItem("items", JSON.stringify(items));
      alert("✅ Post sent to admin for evaluation. Status: Pending.");
    }
    buyVisible = false;
    myPostsVisible = false;
    container.innerHTML = "";
    return;
  }

  if (action === "buy") {
    // not used (kept for parity), use marketplaceAction('buy') if you add search
    return;
  }

  if (action === "view") {
    if (myPostsVisible) {
      container.innerHTML = "";
      myPostsVisible = false;
      return;
    }
    displayMyItems();
    myPostsVisible = true;
    buyVisible = false;
    return;
  }
}

function toggleMarketButtons() {
  const subBtns = document.getElementById("marketSubButtons");
  subBtns.style.display = subBtns.style.display === "block" ? "none" : "block";
}

// Admin toggles for marketplace
let pendingVisible = false;
let approvedVisible = false;

function displayPendingItemsAdmin() {
  const container = document.getElementById("adminContent");
  if (pendingVisible) {
    container.innerHTML = "";
    pendingVisible = false;
    return;
  }
  pendingVisible = true;
  approvedVisible = false;
  container.innerHTML = "<h3>🕓 Pending Marketplace Posts</h3>";
  const items = JSON.parse(localStorage.getItem("items")) || [];
  const pending = items.filter(i => i.status === "Pending");
  if (pending.length === 0) {
    container.innerHTML += "<p>No pending posts.</p>";
    return;
  }
  pending.forEach(item => {
    const div = document.createElement("div");
    div.style = "border:1px solid #ccc;padding:10px;margin:10px;border-radius:10px;";
    div.innerHTML = `
      <p><strong>Seller:</strong> ${item.sellerName}</p>
      <p><strong>Item:</strong> ${item.itemName}</p>
      <p><strong>Price:</strong> R${item.itemPrice}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Contact:</strong> ${item.contact}</p>
      <p><strong>Status:</strong> ${item.status}</p>
      <button onclick="approveItem(${item.id})">✅ Approve</button>
      <button onclick="rejectItem(${item.id})">❌ Reject</button>
    `;
    container.appendChild(div);
  });
}

function approveItem(itemId) {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  const idx = items.findIndex(i => i.id === itemId);
  if (idx === -1) return alert("Item not found.");
  items[idx].status = "Approved";
  items[idx].adminNote = "Approved by admin.";
  items[idx].sellerNotified = false;
  localStorage.setItem("items", JSON.stringify(items));
  alert("✅ Post is now accepted and will appear for students to see.");
  displayPendingItemsAdmin();
}

function rejectItem(itemId) {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  const idx = items.findIndex(i => i.id === itemId);
  if (idx === -1) return alert("Item not found.");
  const note = prompt("Enter a reason for rejection (optional):");
  items[idx].status = "Rejected";
  items[idx].adminNote = note || "No reason provided.";
  items[idx].sellerNotified = false;
  localStorage.setItem("items", JSON.stringify(items));
  alert("❌ Item rejected.");
  displayPendingItemsAdmin();
}

function deleteItemAdmin(itemId) {
  if (!confirm("Are you sure you want to delete this post?")) return;
  let items = JSON.parse(localStorage.getItem("items")) || [];
  items = items.filter(i => i.id !== itemId);
  localStorage.setItem("items", JSON.stringify(items));
  alert("🗑️ Post deleted successfully.");
  if (approvedVisible) displayApprovedItemsAdmin();
  if (pendingVisible) displayPendingItemsAdmin();
}

function displayApprovedItemsAdmin() {
  const container = document.getElementById("adminContent");
  if (approvedVisible) {
    container.innerHTML = "";
    approvedVisible = false;
    return;
  }
  approvedVisible = true;
  pendingVisible = false;
  container.innerHTML = "<h3>✅ Approved Marketplace Posts</h3>";
  const items = JSON.parse(localStorage.getItem("items")) || [];
  const approved = items.filter(i => i.status === "Approved");
  if (approved.length === 0) {
    container.innerHTML += "<p>No approved posts yet.</p>";
    return;
  }
  approved.forEach(item => {
    const div = document.createElement("div");
    div.style = "border:1px solid #ccc;padding:10px;margin:10px;border-radius:10px;";
    div.innerHTML = `
      <p><strong>Seller:</strong> ${item.sellerName}</p>
      <p><strong>Item:</strong> ${item.itemName}</p>
      <p><strong>Price:</strong> R${item.itemPrice}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Contact:</strong> ${item.contact}</p>
      <p><strong>Status:</strong> ${item.status}</p>
      <button onclick="deleteItemAdmin(${item.id})">🗑️ Delete</button>
    `;
    container.appendChild(div);
  });
}

// Student: My posted items
function displayMyItems() {
  const container = document.getElementById("itemList");
  const logged = JSON.parse(localStorage.getItem("loggedInStudent"));
  const items = JSON.parse(localStorage.getItem("items")) || [];
  if (!logged) return alert("Please log in first!");
  const myItems = items.filter(i => i.sellerNumber === logged.studentNumber);
  container.innerHTML = "<h3>🛍️ My Posted Items</h3>";
  if (myItems.length === 0) {
    container.innerHTML += "<p>You haven't posted any items yet.</p>";
    return;
  }
  myItems.forEach(item => {
    if (item.status === "Approved" && !item.sellerNotified) {
      alert(`✅ Your post "${item.itemName}" was approved and is now visible to buyers.`);
      const allItems = JSON.parse(localStorage.getItem("items")) || [];
      const idx = allItems.findIndex(it => it.id === item.id);
      if (idx !== -1) {
        allItems[idx].sellerNotified = true;
        localStorage.setItem("items", JSON.stringify(allItems));
        item.sellerNotified = true;
      }
    }
    container.innerHTML += `
      <div style="border:1px solid #ccc;padding:10px;margin:10px;border-radius:10px;">
        <p><strong>Item:</strong> ${item.itemName}</p>
        <p><strong>Price:</strong> R${item.itemPrice}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Contact:</strong> ${item.contact}</p>
        <p><strong>Status:</strong> ${item.status}</p>
        ${item.status === "Rejected" && item.adminNote ? `<p><strong>Reason:</strong> ${item.adminNote}</p>` : ""}
        <button onclick="deleteMyItem(${item.id})">🗑️ Delete</button>
      </div>
    `;
  });
}

function deleteMyItem(itemId) {
  if (!confirm("Are you sure you want to delete this item?")) return;
  let items = JSON.parse(localStorage.getItem("items")) || [];
  items = items.filter(i => i.id !== itemId);
  localStorage.setItem("items", JSON.stringify(items));
  alert("🗑️ Item deleted successfully.");
  displayMyItems();
}

// Student: show available approved items
function displayApprovedItems() {
  const container = document.getElementById("itemList");
  const items = JSON.parse(localStorage.getItem("items")) || [];
  const approved = items.filter(i => i.status === "Approved");
  container.innerHTML = "<h3>🛍️ Available Items</h3>";
  if (approved.length === 0) {
    container.innerHTML += "<p>No items available for now.</p>";
    return;
  }
  approved.forEach(item => {
    container.innerHTML += `
      <div style="border:1px solid #ccc;padding:10px;margin:10px;border-radius:10px;">
        <p><strong>Item:</strong> ${item.itemName}</p>
        <p><strong>Price:</strong> R${item.itemPrice}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Contact:</strong> ${item.contact}</p>
      </div>
    `;
  });
}

// ---------------------- STUDY GROUPS FEATURE ----------------------
let groupFormVisible = false;
let groupSearchVisible = false;
let myGroupsVisible = false;
let pendingGroupsVisibleAdmin = false;
let approvedGroupsVisibleAdmin = false;

// ensure groups initialised
function ensureGroupsInit() {
  if (!localStorage.getItem("groups")) localStorage.setItem("groups", JSON.stringify([]));
}

// student toggles for create/search/my
function studyGroupAction(action) {
  ensureGroupsInit();
  const groupForm = document.getElementById("groupForm");
  const groupList = document.getElementById("groupList");

  if (action === "create") {
    groupFormVisible = !groupFormVisible;
    if (groupFormVisible) {
      groupForm.classList.remove("hidden");
      groupList.innerHTML = "";
      groupSearchVisible = false;
      myGroupsVisible = false;
    } else {
      groupForm.classList.add("hidden");
    }
    return;
  }

  if (action === "search") {
    groupSearchVisible = !groupSearchVisible;
    if (!groupSearchVisible) {
      groupList.innerHTML = "";
      return;
    }
    displayApprovedGroups();
    groupForm.classList.add("hidden");
    groupFormVisible = false;
    myGroupsVisible = false;
    return;
  }

  if (action === "my") {
    myGroupsVisible = !myGroupsVisible;
    if (!myGroupsVisible) {
      groupList.innerHTML = "";
      return;
    }
    displayMyGroups();
    groupForm.classList.add("hidden");
    groupFormVisible = false;
    groupSearchVisible = false;
    return;
  }
}

// student add group
function addGroup() {
  ensureGroupsInit();
  const logged = JSON.parse(localStorage.getItem("loggedInStudent"));
  if (!logged || logged.role !== "student") return alert("Please log in as a student to create a study group.");

  const course = document.getElementById("groupCourse").value.trim();
  const module = document.getElementById("groupModule").value.trim();
  const organizer = document.getElementById("groupOrganizerName").value.trim();
  const campus = document.getElementById("groupCampus").value.trim();
  const contact = document.getElementById("groupContact").value.trim();

  if (!course || !module || !organizer || !campus || !contact) {
    return alert("❌ Please fill in all study group fields.");
  }

  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  const newGroup = {
    id: Date.now(),
    studentNumber: logged.studentNumber,
    course,
    module,
    organizer,
    campus,
    contact,
    status: "Pending",
    rejectionReason: "",
    adminNote: "",
    studentNotified: false,
    createdAt: new Date().toISOString()
  };

  groups.push(newGroup);
  localStorage.setItem("groups", JSON.stringify(groups));

  document.getElementById("groupCourse").value = "";
  document.getElementById("groupModule").value = "";
  document.getElementById("groupOrganizerName").value = "";
  document.getElementById("groupCampus").value = "";
  document.getElementById("groupContact").value = "";
  document.getElementById("groupForm").classList.add("hidden");
  groupFormVisible = false;

  alert("✅ Your study group has been submitted for admin approval.");
  displayMyGroups();
  myGroupsVisible = true;
}

// student: view approved groups for 'Look for Study Group'
function displayApprovedGroups() {
  ensureGroupsInit();
  const groupList = document.getElementById("groupList");
  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  const approved = groups.filter(g => g.status === "Approved");

  groupList.innerHTML = "<h3>✅ Approved Study Groups</h3>";
  if (approved.length === 0) {
    groupList.innerHTML += "<p>No approved study groups found.</p>";
    return;
  }

  approved.forEach(g => {
    groupList.innerHTML += `
      <div class="group-card approved" style="border:1px solid #ccc;padding:10px;margin:10px;border-radius:10px;">
        <p><strong>Course:</strong> ${g.course}</p>
        <p><strong>Module:</strong> ${g.module}</p>
        <p><strong>Organizer:</strong> ${g.organizer}</p>
        <p><strong>Campus:</strong> ${g.campus}</p>
        <p><strong>Contact:</strong> ${g.contact}</p>
        <button onclick="alert('Join feature coming soon!')">Join (coming soon)</button>
      </div>
    `;
  });
}

// student: my posted groups (shows statuses and rejection reason)
function displayMyGroups() {
  ensureGroupsInit();
  const logged = JSON.parse(localStorage.getItem("loggedInStudent"));
  const groupList = document.getElementById("groupList");
  if (!logged || logged.role !== "student") return alert("Please log in as a student.");

  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  const my = groups.filter(g => g.studentNumber === logged.studentNumber);

  groupList.innerHTML = "<h3>🧾 My Study Groups</h3>";
  if (my.length === 0) {
    groupList.innerHTML += "<p>You haven't posted any study groups yet.</p>";
    return;
  }

  my.forEach((g) => {
    let statusColor = "black";
    if (g.status === "Pending") statusColor = "orange";
    if (g.status === "Approved") statusColor = "green";
    if (g.status === "Rejected") statusColor = "red";

    // notify student once when approved
    if (g.status === "Approved" && !g.studentNotified) {
      alert(`✅ Your study group for ${g.course} - ${g.module} was approved and is now visible to students.`);
      // mark notified
      const all = JSON.parse(localStorage.getItem("groups")) || [];
      const idx = all.findIndex(x => x.id === g.id);
      if (idx !== -1) {
        all[idx].studentNotified = true;
        localStorage.setItem("groups", JSON.stringify(all));
        g.studentNotified = true;
      }
    }

    groupList.innerHTML += `
      <div class="${g.status.toLowerCase()}" style="border:1px solid #ccc;padding:10px;margin:10px;border-radius:10px;">
        <p><strong>Course:</strong> ${g.course}</p>
        <p><strong>Module:</strong> ${g.module}</p>
        <p><strong>Organizer:</strong> ${g.organizer}</p>
        <p><strong>Campus:</strong> ${g.campus}</p>
        <p><strong>Contact:</strong> ${g.contact}</p>
        <p style="color:${statusColor};"><strong>Status:</strong> ${g.status}${g.status === "Approved" ? " ✅ Approved and visible to all students" : ""}</p>
        ${g.status === "Rejected" && g.rejectionReason ? `<p><strong>Reason:</strong> ${g.rejectionReason}</p>` : ""}
        ${(g.status === "Approved" || g.status === "Rejected") ? `<button onclick="deleteMyGroup(${g.id})">🗑️ Delete</button>` : ""}
      </div>
    `;
  });
}

// student delete own group (allowed for approved & rejected)
function deleteMyGroup(groupId) {
  if (!confirm("Are you sure you want to delete this study group?")) return;
  let groups = JSON.parse(localStorage.getItem("groups")) || [];
  const logged = JSON.parse(localStorage.getItem("loggedInStudent"));
  if (!logged || logged.role !== "student") return alert("Please log in.");
  const group = groups.find(g => g.id === groupId && g.studentNumber === logged.studentNumber);
  if (!group) return alert("Study group not found or you are not authorized.");
  groups = groups.filter(g => g.id !== groupId);
  localStorage.setItem("groups", JSON.stringify(groups));
  alert("🗑️ Study group deleted.");
  displayMyGroups();
}

// ---------------------- ADMIN: Study Group management ----------------------
let pendingVisible = false;
let approvedVisible = false;

function toggleStudyGroupButtons() {
  const sub = document.getElementById("studyGroupSubButtons");
  sub.style.display = sub.style.display === "block" ? "none" : "block";
}

function togglePendingGroupsAdmin() {
  const container = document.getElementById("adminContent");
  if (!pendingVisible) {
    const groups = JSON.parse(localStorage.getItem("groups")) || [];
    const pending = groups.filter(g => g.status === "Pending");
    let html = "<h3>🕓 Pending Study Groups</h3>";
    if (pending.length === 0) {
      html += "<p>No pending study groups.</p>";
      container.innerHTML = html;
      pendingVisible = true;
      approvedVisible = false;
      return;
    }
    pending.forEach(g => {
      html += `
        <div class="pending" style="border:1px solid #ccc;padding:10px;margin:10px;border-radius:10px;">
          <p><strong>Course:</strong> ${g.course}</p>
          <p><strong>Module:</strong> ${g.module}</p>
          <p><strong>Organizer:</strong> ${g.organizer}</p>
          <p><strong>Campus:</strong> ${g.campus}</p>
          <p><strong>Contact:</strong> ${g.contact}</p>
          <p><strong>Posted by:</strong> ${g.studentNumber}</p>
          <button onclick="approveGroup(${g.id})">✅ Approve</button>
          <button onclick="rejectGroupWithReason(${g.id})">❌ Reject</button>
        </div>
      `;
    });
    container.innerHTML = html;
    pendingVisible = true;
    approvedVisible = false;
  } else {
    document.getElementById("adminContent").innerHTML = "";
    pendingVisible = false;
  }
}

function toggleApprovedGroupsAdmin() {
  const container = document.getElementById("adminContent");
  if (!approvedVisible) {
    const groups = JSON.parse(localStorage.getItem("groups")) || [];
    const approved = groups.filter(g => g.status === "Approved");
    let html = "<h3>✅ Approved Study Groups</h3>";
    if (approved.length === 0) {
      html += "<p>No approved study groups.</p>";
      container.innerHTML = html;
      approvedVisible = true;
      pendingVisible = false;
      return;
    }
    approved.forEach(g => {
      html += `
        <div class="approved" style="border:1px solid #c3e6cb;padding:10px;margin:10px;border-radius:10px;">
          <p><strong>Course:</strong> ${g.course}</p>
          <p><strong>Module:</strong> ${g.module}</p>
          <p><strong>Organizer:</strong> ${g.organizer}</p>
          <p><strong>Campus:</strong> ${g.campus}</p>
          <p><strong>Contact:</strong> ${g.contact}</p>
          <p><strong>Posted by:</strong> ${g.studentNumber}</p>
          <button onclick="deleteGroupAdmin(${g.id})">🗑️ Delete</button>
        </div>
      `;
    });
    container.innerHTML = html;
    approvedVisible = true;
    pendingVisible = false;
  } else {
    document.getElementById("adminContent").innerHTML = "";
    approvedVisible = false;
  }
}

function approveGroup(groupId) {
  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  const idx = groups.findIndex(g => g.id === groupId);
  if (idx === -1) return alert("Group not found.");
  groups[idx].status = "Approved";
  groups[idx].adminNote = "Approved by admin.";
  groups[idx].studentNotified = false;
  localStorage.setItem("groups", JSON.stringify(groups));
  alert("✅ Study group approved and now visible to students.");
  togglePendingGroupsAdmin();
}

function rejectGroupWithReason(groupId) {
  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  const idx = groups.findIndex(g => g.id === groupId);
  if (idx === -1) return alert("Group not found.");
  const reason = prompt("Enter reason for rejection (required):");
  if (reason === null) return; // cancelled
  if (String(reason).trim() === "") return alert("Rejection reason required.");
  groups[idx].status = "Rejected";
  groups[idx].rejectionReason = reason.trim();
  groups[idx].adminActionAt = new Date().toISOString();
  localStorage.setItem("groups", JSON.stringify(groups));
  alert("❌ Study group rejected.");
  togglePendingGroupsAdmin();
}

function displayAllGroupsAdmin() {
  const container = document.getElementById("adminContent");
  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  if (groups.length === 0) {
    container.innerHTML = "<h3>Study Groups</h3><p>No study groups found.</p>";
    return;
  }
  let html = "<h3>All Study Groups (Admin)</h3>";
  groups.forEach(g => {
    html += `
      <div style="border:1px solid #ccc;padding:10px;margin:10px;border-radius:10px;">
        <p><strong>ID:</strong> ${g.id}</p>
        <p><strong>Course:</strong> ${g.course}</p>
        <p><strong>Module:</strong> ${g.module}</p>
        <p><strong>Organizer:</strong> ${g.organizer}</p>
        <p><strong>Campus:</strong> ${g.campus}</p>
        <p><strong>Contact:</strong> ${g.contact}</p>
        <p><strong>Status:</strong> ${g.status}</p>
        ${g.status === "Rejected" && g.rejectionReason ? `<p><strong>Reason:</strong> ${g.rejectionReason}</p>` : ""}
        <button onclick="deleteGroupAdmin(${g.id})">🗑️ Delete</button>
        ${g.status === "Approved" ? `<button onclick="unapproveGroup(${g.id})">Unapprove</button>` : ""}
      </div>
    `;
  });
  container.innerHTML = html;
}

function deleteGroupAdmin(groupId) {
  if (!confirm("Delete this study group permanently?")) return;
  let groups = JSON.parse(localStorage.getItem("groups")) || [];
  groups = groups.filter(g => g.id !== groupId);
  localStorage.setItem("groups", JSON.stringify(groups));
  alert("🗑️ Study group deleted.");
  // refresh current admin view
  if (approvedVisible) toggleApprovedGroupsAdmin();
  if (pendingVisible) togglePendingGroupsAdmin();
  displayAllGroupsAdmin();
}

function unapproveGroup(groupId) {
  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  const idx = groups.findIndex(g => g.id === groupId);
  if (idx === -1) return alert("Group not found.");
  groups[idx].status = "Pending";
  groups[idx].adminNote = "Unapproved by admin.";
  localStorage.setItem("groups", JSON.stringify(groups));
  alert("🔁 Group unapproved and returned to Pending.");
  displayAllGroupsAdmin();
}

// ---------------------- SHOW/HIDE HELPERS ----------------------
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




// ---------------------- SHOW PORTALS ----------------------
function showStudentServices() {
  // Hide login and admin sections
  document.getElementById("home").classList.add("hidden");
  document.getElementById("adminDashboard").classList.add("hidden");

  // Show student sections
  document.getElementById("tutors").classList.remove("hidden");
  document.getElementById("marketplace").classList.remove("hidden");
  document.getElementById("groups").classList.remove("hidden");

  // Show/hide student/admin views
  document.getElementById("tutorStudentView").style.display = "block";
  document.getElementById("tutorAdminView").style.display = "none";
  document.getElementById("marketplaceStudentView").style.display = "block";
  document.getElementById("marketplaceAdminView").style.display = "none";
  document.getElementById("groupStudentView").style.display = "block";
  document.getElementById("groupAdminView").style.display = "none";
}

function showAdminServices() {
  // Hide login and student sections
  document.getElementById("home").classList.add("hidden");
  document.getElementById("tutors").classList.add("hidden");
  document.getElementById("marketplace").classList.add("hidden");
  document.getElementById("groups").classList.add("hidden");

  // Show admin dashboard
  document.getElementById("adminDashboard").classList.remove("hidden");

  // Show/hide admin views in sections
  document.getElementById("tutorStudentView").style.display = "none";
  document.getElementById("tutorAdminView").style.display = "block";
  document.getElementById("marketplaceStudentView").style.display = "none";
  document.getElementById("marketplaceAdminView").style.display = "block";
  document.getElementById("groupStudentView").style.display = "none";
  document.getElementById("groupAdminView").style.display = "block";
}

// ---------------------- LOGOUT ----------------------
function logout() {
  // Reload page to reset everything
  location.reload();
}

























