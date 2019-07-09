// Check if the session is being ran locally
if (window.location.href.includes('heroku')) {
  BASE_URL = 'https://beer-or-horse.herokuapp.com/';
} else {
  BASE_URL = 'http://localhost:3000';
}

const USERS_URL = `${BASE_URL}/users`
const QUIZZES_URL = `${BASE_URL}/quizzes`
const BEER_QUESTIONS_URL = `${BASE_URL}/beer_questions`
const HORSE_QUESTIONS_URL = `${BASE_URL}/horse_questions`


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
});

readButton.addEventListener('click', hideRules);

startButton.addEventListener('click', startGame);

function startGame() {
  startButton.style.display = 'none';
  rulesButton.style.display = 'none';
  username = usernameInput.value;
  usernameInput.style.display = 'none';
  newUser(username);
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
    .then(resp => resp.json())
    .then(beginGame);
}

function newQuiz(user) {
  newQuizObj = {
    'user_id': user.id,
    'score': 0
  };
  console.log(newQuizObj);
  fetch(QUIZZES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newQuizObj)
    })
    .then(resp => resp.json());
  hideRules();
  // .then ()
}


function newQuestion(quiz) {
  //coin flip method
  random = Math.floor(Math.random() * 2);
  if (random === 1) {
    newBeerQuestion(quiz)
  } else {
    newHorseQuestion(quiz)
  }
}

function newBeerQuestion(quiz) {
  fetch(BEER_QUESTIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'quiz_id': quiz.id,
      })
    })
    .then(resp => resp.json())
}

function newHorseQuestion(quiz) {
  fetch(HORSE_QUESTIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'quiz_id': quiz.id,
      })
    })
    .then(resp => resp.json())
}

function beginGame(user) {
  h1 = document.createElement('h1')
  loc = document.querySelector('#game-location')
  h1.innerText = `WELCOME TO BEER OR HORSE, ${user.name.toUpperCase()}`
  loc.append(h1)
  console.log(user)
  newQuiz(user)
}

function showRules() {
  rulesCard.style.display = 'block';
}

function hideRules() {
  rulesCard.style.display = 'none'
}

// button to launch quiz, make get request to create a new quiz session.
// Goes straight into the first question, randomizes
// fetch POST to save new quiz
// fetch get a randomly generated question?
// event listeners on horse/beer buttons