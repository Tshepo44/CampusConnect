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


// ---------------------- TUTOR MANAGEMENT POPUP STYLE ----------------------
let tutorManagementVisible = false;

function openTutorManagement() {
  const adminContent = document.getElementById("adminContent");

  // Toggle visibility (open/close)
  tutorManagementVisible = !tutorManagementVisible;
  if (!tutorManagementVisible) {
    adminContent.innerHTML = "";
    return;
  }

  // Main Tutor Management Menu with Add Tutor form
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

  showTutors(); // show the current tutor list immediately

  // Connect Save Tutor button to saveTutor function
  document.getElementById("submitTutorBtn").onclick = saveTutor;
}



// Save tutor data and go back
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

  // Clear the form fields
  document.getElementById("adminTutorName").value = "";
  document.getElementById("adminTutorCampus").value = "";
  document.getElementById("adminTutorCourse").value = "";
  document.getElementById("adminTutorModule").value = "";

  // Refresh the tutor list
  showTutors();
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

// --- Student marketplace section toggles ---
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

    // ✅ Confirm details before posting
    let confirmMsg = `Please confirm your post details:\n\n` +
      `👤 Name: ${sellerName}\n📞 Contact: ${contact}\n📍 Location: ${location}\n` +
      `📦 Item: ${itemName}\n💰 Price: R${itemPrice}\n\n✅ Press OK to post`;

    if (confirm(confirmMsg)) {
      const loggedInStudent = JSON.parse(localStorage.getItem("loggedInStudent"));
      if (!loggedInStudent) return alert("Please log in first!");

      const items = JSON.parse(localStorage.getItem("items")) || [];

      // No photos now
      const newItem = {
        id: Date.now(),
        sellerNumber: loggedInStudent.studentNumber,
        sellerName,
        contact,
        location,
        itemName,
        itemPrice,
        status: "Pending",
        createdAt: new Date().toISOString()
      };

      items.push(newItem);
      localStorage.setItem("items", JSON.stringify(items));

      alert("✅ Post sent to admin for evaluation. Status: Pending.");
    }

    // Reset toggles so the sell action doesn’t interfere
    buyVisible = false;
    myPostsVisible = false;
    container.innerHTML = "";
    return;
  }

  // 🛒 Toggle Buy Item posts
  if (action === "buy") {
    if (buyVisible) {
      container.innerHTML = ""; // Hide if already visible
      buyVisible = false;
      return;
    }
    displayApprovedItems();
    buyVisible = true;
    myPostsVisible = false; // Close the other section
    return;
  }

  // 👤 Toggle View My Posted Items
  if (action === "view") {
    if (myPostsVisible) {
      container.innerHTML = ""; // Hide if already visible
      myPostsVisible = false;
      return;
    }
    displayMyItems();
    myPostsVisible = true;
    buyVisible = false; // Close the other section
    return;
  }
}


function toggleMarketButtons() {
  const subBtns = document.getElementById("marketSubButtons");

  if (subBtns.style.display === "none" || subBtns.style.display === "") {
    subBtns.style.display = "block";  // Show the two buttons
  } else {
    subBtns.style.display = "none";   // Hide them again
  }
}

// Track toggle state
let pendingVisible = false;
let approvedVisible = false;

function displayPendingItemsAdmin() {
  const container = document.getElementById("adminContent");

  // Toggle off if it's already visible
  if (pendingVisible) {
    container.innerHTML = ""; // hide content
    pendingVisible = false;
    return;
  }

  // Otherwise, show it
  pendingVisible = true;
  approvedVisible = false; // close the other view if open
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

// ---------- Admin: Approve item ----------
function approveItem(itemId) {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  const index = items.findIndex(i => i.id === itemId);
  if (index === -1) return alert("Item not found.");

  items[index].status = "Approved";
  items[index].adminNote = "Approved by admin.";
  items[index].sellerNotified = false; // will trigger seller alert next time they view their items
  localStorage.setItem("items", JSON.stringify(items));

  alert("✅ Post is now accepted and will appear for students to see.");
  // refresh the pending list currently shown in admin
  if (typeof displayPendingItemsAdmin === "function") displayPendingItemsAdmin();
}

// ---------- Admin: Reject item ----------
function rejectItem(itemId) {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  const index = items.findIndex(i => i.id === itemId);
  if (index === -1) return alert("Item not found.");

  const note = prompt("Enter a reason for rejection (optional):");
  items[index].status = "Rejected";
  items[index].adminNote = note || "No reason provided.";
  items[index].sellerNotified = false;
  localStorage.setItem("items", JSON.stringify(items));

  alert("❌ Item rejected.");
  if (typeof displayPendingItemsAdmin === "function") displayPendingItemsAdmin();
}

// ---------- Admin: Delete any item ----------
function deleteItemAdmin(itemId) {
  if (!confirm("Are you sure you want to delete this post?")) return;
  let items = JSON.parse(localStorage.getItem("items")) || [];
  items = items.filter(i => i.id !== itemId);
  localStorage.setItem("items", JSON.stringify(items));
  alert("🗑️ Post deleted successfully.");
  if (typeof displayApprovedItemsAdmin === "function") displayApprovedItemsAdmin();
  if (typeof displayPendingItemsAdmin === "function") displayPendingItemsAdmin();
}


function displayApprovedItemsAdmin() {
  const container = document.getElementById("adminContent");

  // Toggle off if it's already visible
  if (approvedVisible) {
    container.innerHTML = "";
    approvedVisible = false;
    return;
  }

  // Otherwise, show it
  approvedVisible = true;
  pendingVisible = false; // close pending view if open
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






// ---------- Student: View My Posted Items (REPLACED) ----------
function displayMyItems() {
  const container = document.getElementById("itemList");
  const loggedInStudent = JSON.parse(localStorage.getItem("loggedInStudent"));
  const items = JSON.parse(localStorage.getItem("items")) || [];

  if (!loggedInStudent) return alert("Please log in first!");

  const myItems = items.filter(i => i.sellerNumber === loggedInStudent.studentNumber);

  container.innerHTML = "<h3>🛍️ My Posted Items</h3>";

  if (myItems.length === 0) {
    container.innerHTML += "<p>You haven't posted any items yet.</p>";
    return;
  }

  myItems.forEach(item => {
    // If admin just approved and seller hasn't been notified, show alert and mark notified
    if (item.status === "Approved" && !item.sellerNotified) {
      alert(`✅ Your post "${item.itemName}" was approved and is now visible to buyers.`);
      // mark as notified so we don't alert again
      const allItems = JSON.parse(localStorage.getItem("items")) || [];
      const idx = allItems.findIndex(it => it.id === item.id);
      if (idx !== -1) {
        allItems[idx].sellerNotified = true;
        localStorage.setItem("items", JSON.stringify(allItems));
        // update local reference so delete/hide uses latest
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
  displayMyItems(); // refresh the view
}

// ---------- Student: View Approved Items (Buy screen) ----------
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










































