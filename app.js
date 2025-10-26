let loggedIn = false;

function login(role) {
  if (role === "student") {
    const studentNumber = document.getElementById("studentNumber").value;
    const password = document.getElementById("password").value;

    if (studentNumber && password) {
      loggedIn = true;
      document.getElementById("landing-page").classList.add("hidden");
      document.getElementById("student-dashboard").classList.remove("hidden");
    } else {
      alert("Please enter both Student Number and Password.");
    }
  } else if (role === "admin") {
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    if (username && password) {
      loggedIn = true;
      document.getElementById("landing-page").classList.add("hidden");
      document.getElementById("student-dashboard").classList.remove("hidden");
      alert("Welcome, Admin!");
    } else {
      alert("Please enter both Username and Password.");
    }
  }
}

/* === Functional Sections === */
function showAddTutor() {
  document.getElementById("addTutorForm").classList.toggle("hidden");
}

function addTutor() {
  const name = document.getElementById("tutorName").value;
  const module = document.getElementById("tutorModule").value;
  if (name && module) {
    const div = document.createElement("div");
    div.textContent = `${name} - ${module}`;
    document.getElementById("tutorList").appendChild(div);
  }
}

function showAddItem() {
  document.getElementById("addItemForm").classList.toggle("hidden");
}

function addItem() {
  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const seller = document.getElementById("itemSeller").value;
  if (name && price && seller) {
    const div = document.createElement("div");
    div.textContent = `${name} - R${price} (Seller: ${seller})`;
    document.getElementById("itemList").appendChild(div);
  }
}

function showAddGroup() {
  document.getElementById("addGroupForm").classList.toggle("hidden");
}

function addGroup() {
  const subject = document.getElementById("groupSubject").value;
  const time = document.getElementById("groupTime").value;
  const location = document.getElementById("groupLocation").value;
  const organizer = document.getElementById("groupOrganizer").value;
  if (subject && time && location && organizer) {
    const div = document.createElement("div");
    div.textContent = `${subject} - ${time} - ${location} (Organizer: ${organizer})`;
    document.getElementById("groupList").appendChild(div);
  }
}

function showAddCounsellor() {
  document.getElementById("addCounsellorForm").classList.toggle("hidden");
}

function addCounsellor() {
  const name = document.getElementById("counsellorName").value;
  const headline = document.getElementById("counsellorHeadline").value;
  const availability = document.getElementById("counsellorAvailability").value;
  if (name && headline && availability) {
    const div = document.createElement("div");
    div.textContent = `${name} - ${headline} - Available: ${availability}`;
    document.getElementById("counsellorList").appendChild(div);
  }
}






























