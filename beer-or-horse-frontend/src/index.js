// Check if the session is being ran locally
if (window.location.href.includes('heroku')) {
  BASE_URL = 'https://beer-or-horse.herokuapp.com/';
} else {
  BASE_URL = 'http://localhost:3000';
}

const USERS_URL = `${BASE_URL}/users`;

const rulesCard = document.querySelector('#rules-card');
const rulesButton = document.querySelector('#rules-button');
const startButton = document.querySelector('#start-button');
const readButton = document.querySelector('#read-button');
const usernameInput = document.querySelector('#input-username');

let rulesShow = false;
let currentUser;

// add event listener to rulesCard

rulesButton.addEventListener('click', e => {
  rulesShow = !rulesShow;
  if (rulesShow) {
    showRules();
  } else {
    hideRules();
  }
})

readButton.addEventListener('click', hideRules);

startButton.addEventListener('click', startGame);

function startGame() {
  startButton.style.display = 'none';
  rulesButton.style.display = 'none';
  username = usernameInput.value;
  usernameInput.style.display = 'none';
  newUser(username)
}

function newUser(username) {
  fetch(USERS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': username
      })
    })
    .then(response => response.json())
    .then(beginGame);
}

function beginGame(user) {
  h1 = document.createElement('h1');
  loc = document.querySelector('#game-location');
  h1.innerText = `WELCOME TO BEER OR HORSE ${user.name}`;
  loc.append(h1);
}

function showRules() {
  rulesCard.style.display = 'block';
}

function hideRules() {
  rulesCard.style.display = 'none';
}