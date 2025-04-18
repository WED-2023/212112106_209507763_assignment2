function showPage(id) {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('page_active'));
    document.getElementById(id).classList.add('page_active');
  }

  const defaultUser = { username: "p", password: "testuser" };

// Load users from localStorage or create empty list
function getStoredUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users;
}

function saveUser(user) {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
}

function userExists(username) {
  const users = getStoredUsers();
  return users.some(u => u.username === username);
}

  function validateRegister() {
    const inputs = document.querySelectorAll('#register input');
    const username = inputs[0].value.trim();
    const password = inputs[1].value;
    const confirmPassword = inputs[2].value;
    const firstName = inputs[3].value.trim();
    const lastName = inputs[4].value.trim();
    const email = inputs[5].value.trim();
    const birthDate = inputs[6].value;
// Check all fields are filled
    if (!username || !password || !confirmPassword || !firstName || !lastName || !email || !birthDate) {
      alert("All fields are required.");
      return;
    }
    //Check that Name only contains alphabets
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      alert("First and last names must only contain letters.");
      return;
    }

    //Check if User already Exists
    if (userExists(username)) {
      alert("Username already exists.");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!email.includes("@")) {
      alert("Invalid email.");
      return;
    }

    // Create New User
    const newUser = { username, password, firstName, lastName, email, birthDate };
    // Save User
    saveUser(newUser);
    alert("Registration successful!");
    showPage('login');
  

    alert("Registration successful!");
    showPage('login');
  }

  // function login() {
  //   alert("Login successful!");
  //   showPage('config');
  // }
function login() {
  const inputs = document.querySelectorAll('#login input');
  const username = inputs[0].value.trim();
  const password = inputs[1].value;

  if (username === defaultUser.username && password === defaultUser.password) {
    alert("Welcome default user!");
    showPage('config');
    return;
  }

  const users = getStoredUsers();
  const found = users.find(u => u.username === username && u.password === password);

  if (found) {
    alert("Login successful!");
    showPage('config');
  } else {
    alert("Invalid username or password.");
  }
}


  function showAbout() {
    const modal = document.getElementById('aboutModal');
    if (typeof modal.showModal === "function") {
       modal.showModal();
    } else {
       alert("Your browser does not support the <dialog> element.");
    }
}

  function closeAbout() {
    document.getElementById('aboutModal').close();
  }
  // Close dialog on clicking outside OR Escape key
 const aboutModal = document.getElementById('aboutModal');

 aboutModal.addEventListener('click', (e) => {
const rect = aboutModal.getBoundingClientRect();
const clickedOutside =
  e.clientX < rect.left || e.clientX > rect.right ||
  e.clientY < rect.top || e.clientY > rect.bottom;

 if (clickedOutside) {
  aboutModal.close();
 }
 });

  window.addEventListener('keydown', (e) => {
if (e.key === "Escape" && aboutModal.open) {
  aboutModal.close();
 }
 });

   //auto-load the Welcome page on site launch
window.onload = () => {
  showPage('welcome');
};



// Start Game Play
function captureKey(input) {
input.value = ''; // clear current value
input.placeholder = 'Press any key...';
const handler = (e) => {
  input.value = e.key;
  input.placeholder = '';
  document.removeEventListener('keydown', handler);
};
document.addEventListener('keydown', handler);
}

function startGame() {
const fireKey = document.getElementById('fireKey').value;
const duration = parseInt(document.getElementById('gameDuration').value);
const goodColor = document.getElementById('goodColor').value;
const badColor = document.getElementById('badColor').value;

if (!fireKey) {
  alert("Please set a fire button.");
  return;
}

if (duration < 2) {
  alert("Game duration must be at least 2 minutes.");
  return;
}

// You can store these settings in global variables or localStorage
localStorage.setItem("fireKey", fireKey);
localStorage.setItem("gameDuration", duration);
localStorage.setItem("goodColor", goodColor);
localStorage.setItem("badColor", badColor);

// Proceed to Game
showPage('game');
}
// Start Game Play