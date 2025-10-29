function showMessage(msg) {
  // Create a small popup div
  const div = document.createElement('div');
  div.textContent = msg;
  div.style.position = 'fixed';
  div.style.top = '20px';
  div.style.right = '20px';
  div.style.background = '#28a745'; // green for success
  div.style.color = 'white';
  div.style.padding = '10px 15px';
  div.style.borderRadius = '5px';
  div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  div.style.zIndex = 1000;

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000); // disappears after 2 seconds
}

function showError(msg) {
  const div = document.createElement('div');
  div.textContent = msg;
  div.style.position = 'fixed';
  div.style.top = '20px';
  div.style.right = '20px';
  div.style.background = '#dc3545'; // red for error
  div.style.color = 'white';
  div.style.padding = '10px 15px';
  div.style.borderRadius = '5px';
  div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  div.style.zIndex = 1000;

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000); // disappears after 2 seconds
}




let loggedIn = false;

function login(role) {
  if (role === "student") {
    const studentNumber = document.getElementById("studentNumber").value;
    const password = document.getElementById("password").value;

    if (studentNumber === "student123" && password === "pass123") {
      showMessage("Successfully logged in!");
      showStudentHome();
    } else {
      showError("Wrong details!");
    }

  } else if (role === "admin") {
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    if (username === "admin" && password === "admin123") {
      showMessage("Successfully logged in!");
      showStudentHome(); // ✅ use student home layout
    } else {
      showError("Wrong details!");
    }
  }
}

function createOption(title) {
  const container = document.createElement("div");
  container.style.margin = "15px 0";
  container.style.fontSize = "1.2rem";

  const text = document.createElement("span");
  text.textContent = title;
  container.appendChild(text);

  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.style.marginLeft = "10px";
  logoutBtn.onclick = () => {
    if (confirm("Are you sure you want to logout?")) {
      location.reload(); // reloads page to go back to login
    }
  };

  container.appendChild(logoutBtn);

  return container;
}

function showStudentHome() {

    document.getElementById("landing-page").style.display = "none";
  document.getElementById("student-dashboard").style.display = "block";

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


function logout() {
  if (confirm("Are you sure you want to logout?")) {
    location.reload();
  }
}

// Toggle profile dropdown when profile picture is clicked
document.addEventListener("click", function (e) {
  const profile = document.querySelector(".profile-container");
  const dropdown = document.querySelector(".profile-dropdown");

  if (profile.contains(e.target)) {
    dropdown.classList.toggle("hidden");
  } else {
    dropdown.classList.add("hidden");
  }
});




































