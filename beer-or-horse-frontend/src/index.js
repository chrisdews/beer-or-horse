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
const topScoreLocation = document.querySelector('#top-score-location')
const leaderboardLocation = document.querySelector('#leaderboard-location')
const leaderboardTableLocation = document.querySelector('#leaderboard-table')



let rulesShow = false
let currentUser
let answer
let firstGame = true

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

function startGame() {
  startButton.style.display = 'none'
  rulesButton.style.display = 'none'
  hideRules()
  questionLocation.innerHTML = ''
  username = usernameInput.value
  usernameInput.style.display = 'none'
  // countdown(3)
  newUser(username)
}

function newUser(username) {
  if (currentUser) {
    beginGame(currentUser)
  } else {
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
}

function newQuiz(user) {
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

function addButtonFunctionality(quiz) {
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

function horseCheck(quiz) {
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

function beerCheck(quiz) {
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
  firstGame = false
  buttons = document.querySelectorAll('button')
  buttons.forEach(button => {
    button.remove()
  })
  tryAgainButton = document.createElement('button')
  tryAgainButton.innerText = 'Try Again... IF YOU DARE'
  tryAgainButton.className = 'btn btn-danger btn-lg'
  gameLocation.innerHTML = ''
  h1 = document.createElement('h1')
  h1.innerText = `LAST SCORE: ${quiz.score}`
  gameLocation.append(h1, tryAgainButton)
  updateUserScore(currentUser, quiz.score)
  tryAgainButton.addEventListener('click', e => {
    tryAgainButton.remove()
    startGame()
  })
}

function increaseScore(quiz) {
  ++quiz.score
  return fetch(`${QUIZZES_URL}/${quiz.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quiz)
  }).then(response => response.json())
}

function updateUserScore(user, score) {
  if (user.top_score <= score) {
    return fetch(`${USERS_URL}/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          top_score: score
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(user => {
        currentUser = user
      })
  }
}

function beginGame(user) {
  middleH1 = document.createElement('h1')
  loc = document.querySelector('#game-location')
  middleH1.innerText = `${user.name.toUpperCase()} IS THIS A BEER OR A HORSE?`
  topScoreLocation.children[0].innerText = `${user.name.toUpperCase()} TOP SCORE:`
  topScoreLocation.children[1].innerText = user.top_score
  loc.append(middleH1)
  newQuiz(user)
}

function showRules() {
  rulesCard.style.display = 'block'
}

function hideRules() {
  rulesCard.style.display = 'none'
}

function horseQuestion(horse, quiz) {
  answer = 'horse'
  h1 = document.createElement('h1')
  h1.innerText = horse.name
  checkQuestionLength()
  questionLocation.append(h1)
  console.log(answer, quiz)
}

function beerQuestion(beer, quiz) {
  answer = 'beer'
  h1 = document.createElement('h1')
  h1.innerText = beer.name
  checkQuestionLength()
  questionLocation.append(h1)
  console.log(answer, quiz)
}

function checkQuestionLength() {
  if (questionLocation.childNodes.length === 5) {
    questionLocation.childNodes[0].remove()
  }
}

function newQuestion(quiz) {
  random = Math.floor(Math.random() * 2)
  if (random === 1) {
    questionRequest(quiz, BEER_QUESTIONS_URL)
    console.log(quiz)
  } else {
    questionRequest(quiz, HORSE_QUESTIONS_URL)
    console.log(quiz)
  }
}

function questionRequest(quiz, url) {
  fetch(url, {
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

function askQuestion(quiz, question) {
  if (question.beer_id) {
    getName(question.beer_id, BEERS_URL)
      .then(beer => beerQuestion(beer, quiz))
  } else {
    getName(question.horse_id, HORSES_URL)
      .then(horse => horseQuestion(horse, quiz))
  }
}

function getName(id, url) {
  return fetch(`${url}/${id}`)
    .then(response => response.json())
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

function getLeaderboard() {
  return fetch(QUIZZES_URL)
    .then(resp => resp.json())
    .then(allQuizzes => allQuizzes.sort((a, b) => b.score - a.score))
    .then(sortedQuizzes => getUnique(sortedQuizzes, 'user_id'))
    .then(uniqueQuizzes => uniqueQuizzes.slice(0, 5))
    .then(leaderboard => renderLeaderboard(leaderboard))
}

function renderLeaderboard(leaderboard) {
  leaderboard.forEach(quiz => {
    const index = leaderboard.indexOf(quiz)
    user = getName(quiz.user_id, USERS_URL)
      .then(user => renderLeaderboardRow(user, quiz, index))
  })
}

function renderLeaderboardRow(user, quiz, index) {
  const leaderboardRow = document.querySelector(`#leaderboard-row-${index}`);


  let nameTd = document.createElement('td');
  nameTd.innerText = user.name
  leaderboardRow.appendChild(nameTd);

  let scoreTd = document.createElement('td');
  scoreTd.innerText = quiz.score
  leaderboardRow.appendChild(scoreTd);
}

getLeaderboard();

function getUnique(arr, comp) {
  const unique = arr
    .map(e => e[comp])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);
  return unique;
}

// get the top 5 scores

// get the user ids for those scores

// print out user names and scores