// Check if the session is being ran locally
if (window.location.href.includes('heroku')) {
  BASE_URL = 'https://beer-or-horse.herokuapp.com/'
} else {
  BASE_URL = 'http://localhost:3000'
}

const USERS_URL = `${BASE_URL}/users`
const QUIZZES_URL = `${BASE_URL}/quizzes`
const BEERS_URL = `${BASE_URL}/beers`
const HORSES_URL = `${BASE_URL}/horses`
const BEER_QUESTIONS_URL = `${BASE_URL}/beer_questions`
const HORSE_QUESTIONS_URL = `${BASE_URL}/horse_questions`

const rulesCard = document.querySelector('#rules-card')
const rulesButton = document.querySelector('#rules-button')
const startButton = document.querySelector('#start-button')
const readButton = document.querySelector('#read-button')
const usernameInput = document.querySelector('#input-username')
const questionLocation = document.querySelector('#question-location')
const gameLocation = document.querySelector('#game-location')

let rulesShow = false
let currentUser
let answer

// add event listener to rulesCard

rulesButton.addEventListener('click', e => {
  rulesShow = !rulesShow
  if (rulesShow) {
    showRules()
  } else {
    hideRules()
  }
})

readButton.addEventListener('click', hideRules)

startButton.addEventListener('click', startGame)

function startGame () {
  startButton.style.display = 'none'
  rulesButton.style.display = 'none'
  hideRules()
  questionLocation.innerHTML = ''
  username = usernameInput.value
  usernameInput.style.display = 'none'
  countdown(3)
  newUser(username)
}

function newUser (username) {
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
    .then(beginGame)
}

function newQuiz (user) {
  currentUser = user
  newQuizObj = {
    'user_id': user.id,
    'score': 0
  }
  fetch(QUIZZES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newQuizObj)
  })
    .then(resp => resp.json())
    .then(addButtonFunctionality)
}

function addButtonFunctionality (quiz) {
  h1 = document.querySelector('#game-location')

  horseButton = document.createElement('button')
  beerButton = document.createElement('button')
  horseButton.id = 'horse-button'
  beerButton.id = 'beer-button'
  horseButton.className = 'btn btn-danger btn-lg'
  beerButton.className = 'btn btn-danger btn-lg'
  horseButton.innerText = 'horse'
  beerButton.innerText = 'beer'

  loc.append(horseButton, beerButton)

  horseButton.addEventListener('click', e => {
    horseCheck(quiz)
  })
  beerButton.addEventListener('click', e => {
    beerCheck(quiz)
  })
  newQuestion(quiz)
}

function horseCheck (quiz) {
  if (answer === 'horse') {
    questionLocation.lastChild.style.color = 'green'
    increaseScore(quiz)
      .then(newQuestion(quiz))
  } else {
    questionLocation.lastChild.style.color = 'red'
    loseQuiz(quiz)
    // newQuiz(currentUser)
  }
  console.log(quiz)
}

function beerCheck (quiz) {
  if (answer === 'beer') {
    questionLocation.lastChild.style.color = 'green'
    increaseScore(quiz)
      .then(newQuestion(quiz))
  } else {
    questionLocation.lastChild.style.color = 'red'
    loseQuiz(quiz)
    // newQuiz(currentUser)
  }
  console.log(quiz)
}

function loseQuiz(quiz) {
  gameLocation.children[1].innerText = `YOU SCORED: ${quiz.score}`
}

function increaseScore (quiz) {
  ++quiz.score
  return fetch(`${QUIZZES_URL}/${quiz.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quiz)
  }).then(response => response.json())
}

function newQuestion (quiz) {
  // coin flip method
  random = Math.floor(Math.random() * 2)
  if (random === 1) {
    newBeerQuestion(quiz)
  } else {
    newHorseQuestion(quiz)
  }
}

function newBeerQuestion (quiz) {
  fetch(BEER_QUESTIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'quiz_id': quiz.id
    })
  })
    .then(resp => resp.json())
    .then(question => askQuestion(quiz, question))
}

function newHorseQuestion (quiz) {
  fetch(HORSE_QUESTIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'quiz_id': quiz.id
    })
  })
    .then(resp => resp.json())
    .then(question => askQuestion(quiz, question))
}

function beginGame (user) {
  h1 = document.createElement('h1')
  loc = document.querySelector('#game-location')
  h1.innerText = `${user.name.toUpperCase()} IS THIS A BEER OR A HORSE?`
  loc.append(h1)
  newQuiz(user)
}

function showRules () {
  rulesCard.style.display = 'block'
}

function hideRules () {
  rulesCard.style.display = 'none'
}

function askQuestion (quiz, question) {
  if (question['beer_id']) {
    getBeerName(question.beer_id)
      .then(beer => beerQuestion(beer, quiz))
  } else {
    getHorseName(question.horse_id)
      .then(horse => horseQuestion(horse, quiz))
  }
}

function getBeerName (id) {
  return fetch(`${BEERS_URL}/${id}`)
    .then(response => response.json())
}

function getHorseName (id) {
  return fetch(`${HORSES_URL}/${id}`)
    .then(response => response.json())
}

function horseQuestion (horse, quiz) {
  answer = 'horse';
  h1 = document.createElement('h1');
  h1.innerText = horse.name;
  questionLocation.append(h1);
  console.log(answer, quiz)
}

function beerQuestion (beer, quiz) {
  answer = 'beer'
  h1 = document.createElement('h1')
  h1.innerText = beer.name
  questionLocation.append(h1)
  console.log(answer, quiz)
}

// function countdown (seconds) {
//   questionLocation.innerHTML = ''
//   h1countdown = document.createElement('h1')
//   questionLocation.append(h1countdown)
//   h1countdown.innerText = seconds
//   var counter = seconds

//   var interval = setInterval(() => {
//     h1countdown.innerText = counter
//     counter--
//     if (counter < 0) {
//       clearInterval(interval)
//       h1countdown.innerText = 'GO!'
//     };
//   }, 1000)
//   return seconds
// };
// button to launch quiz, make get request to create a new quiz session.
// Goes straight into the first question, randomizes
// fetch POST to save new quiz
// fetch get a randomly generated question?
// event listeners on horse/beer buttons
