let loggedIn = false; 
 
function login() { 
  const studentNumber = document.getElementById("studentNumber").value; 
  const password = document.getElementById("password").value; 
  if (studentNumber && password) { 
    loggedIn = true; 
    document.getElementById("login").classList.add("hidden"); 
    document.querySelectorAll("section.hidden").forEach(s => s.classList.remove("hidden")); 
  } else { 
    alert("Enter student number and password!"); 
  } 
} 
 
function showAddTutor() { 
  document.getElementById("addTutorForm").classList.toggle("hidden"); 
} 
 
function addTutor() { 
  const name = document.getElementById("tutorName").value; 
  const module = document.getElementById("tutorModule").value; 
  const div = document.createElement("div"); 
  div.textContent = `${name} - ${module}`; 
  document.getElementById("tutorList").appendChild(div); 
} 
 
function showAddItem() { 
  document.getElementById("addItemForm").classList.toggle("hidden"); 
} 
 
function addItem() { 
  const name = document.getElementById("itemName").value; 
  const price = document.getElementById("itemPrice").value; 
  const seller = document.getElementById("itemSeller").value; 
  const div = document.createElement("div"); 
  div.textContent = `${name} - R${price} (Seller: ${seller})`; 
  document.getElementById("itemList").appendChild(div); 
} 
 
function showAddGroup() { 
  document.getElementById("addGroupForm").classList.toggle("hidden"); 
} 
 
function addGroup() { 
  const subject = document.getElementById("groupSubject").value; 
  const time = document.getElementById("groupTime").value; 
  const location = document.getElementById("groupLocation").value; 
  const organizer = document.getElementById("groupOrganizer").value; 
  const div = document.createElement("div"); 
  div.textContent = `${subject} - ${time} - ${location} (Organizer: ${organizer})`; 
  document.getElementById("groupList").appendChild(div); 
} 
 
function showAddCounsellor() { 
  document.getElementById("addCounsellorForm").classList.toggle("hidden"); 
} 
 
function addCounsellor() { 
  const name = document.getElementById("counsellorName").value; 
  const headline = document.getElementById("counsellorHeadline").value; 
  const availability = document.getElementById("counsellorAvailability").value; 
  const div = document.createElement("div"); 
  div.textContent = `${name} - ${headline} - Available: ${availability}`; 
  document.getElementById("counsellorList").appendChild(div); 
}




























