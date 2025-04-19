function showPage(id) {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('page_active'));
    document.getElementById(id).classList.add('page_active');
  // Pause game if it's running
  if (typeof pauseGame === "function" && id !== "game") {
    pauseGame();
  }
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

      //Check for both letters and numbers in password
  const passwordComplexityRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
  if (!passwordComplexityRegex.test(password)) {
    alert("Password must contain both letters and numbers.");
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

    // Check and reset game history if logging with a different user
    if (window.currentUser && window.currentUser !== username) {
      window.gameHistory = [];
      updateGameHistory();
    }
    window.currentUser = username;

    showPage('config');
    return;
  }

  const users = getStoredUsers();
  const found = users.find(u => u.username === username && u.password === password);

  if (found) {
    alert("Login successful!");

    // Check and reset game history if logging with a different user
    if (window.currentUser && window.currentUser !== username) {
      window.gameHistory = [];
      updateGameHistory();
    }
    window.currentUser = username;

    showPage('config');
  } else {
    alert("Invalid username or password.");
  }
}


  function showAbout() {
    const modal = document.getElementById('aboutModal');
    if (typeof pauseGame === "function") {
      pauseGame();
    }
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

document.addEventListener("DOMContentLoaded", () => {
  const aboutModal = document.getElementById('aboutModal');

  if (aboutModal) {
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
    aboutModal.addEventListener('close', () => {
      if (typeof resumeGame === "function") {
        resumeGame();
      }
    });


  } else {
    console.error("Element with id 'aboutModal' not found in the DOM.");
  }
});


  window.addEventListener('keydown', (e) => {
if (e.key === "Escape" && aboutModal.open) {
  aboutModal.close();
 }
 });


window.addEventListener("keydown", function(e) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault();
  }
}, false);

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

