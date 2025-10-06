// ---------------------- PREDEFINED STUDENTS ----------------------
if (!localStorage.getItem("students")) {
  const students = [
    { studentNumber: "2025001", password: "pass1" },
    { studentNumber: "2025002", password: "pass2" },
    { studentNumber: "2025003", password: "pass3" }
  ];
  localStorage.setItem("students", JSON.stringify(students));
}

let loggedInStudent = null;

// ---------------------- LOGIN ----------------------
function login() {
  const studentNumber = document.getElementById("studentNumber").value;
  const password = document.getElementById("password").value;

  const students = JSON.parse(localStorage.getItem("students")) || [];
  const student = students.find(
    s => s.studentNumber === studentNumber && s.password === password
  );

  if (student) {
    loggedInStudent = student;
    localStorage.setItem("loggedInStudent", JSON.stringify(student));
    document.getElementById("login").classList.add("hidden");
    document.querySelectorAll("section.hidden").forEach(s => s.classList.remove("hidden"));
    displayTutors();
    displayItems();
    displayGroups();
    displayCounsellors();
  } else {
    alert("Incorrect student number or password!");
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
    document.getElementById("login").classList.add("hidden");
    document.querySelectorAll("section.hidden").forEach(s => s.classList.remove("hidden"));
  }
  displayTutors();
  displayItems();
  displayGroups();
  displayCounsellors();
};


