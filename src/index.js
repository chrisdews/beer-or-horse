// Check if the session is being ran locally
if (window.location.href.includes('heroku')) {
  BASE_URL = 'https://beer-or-horse-backend.herokuapp.com';
} else {
  BASE_URL = 'http://localhost:3000'
}


const USERS_URL = `${BASE_URL}/users`;
const QUIZZES_URL = `${BASE_URL}/quizzes`;
const BEERS_URL = `${BASE_URL}/beers`;
const HORSES_URL = `${BASE_URL}/horses`;
const BEER_QUESTIONS_URL = `${BASE_URL}/beer_questions`;
const HORSE_QUESTIONS_URL = `${BASE_URL}/horse_questions`;
const cable = ActionCable.createConsumer("wss://beer-or-horse-backend.herokuapp.com/cable");

const rulesCard = document.querySelector('#rules-card');
const rulesButton = document.querySelector('#rules-button');
const startButton = document.querySelector('#start-button');
const readButton = document.querySelector('#read-button');
const usernameInput = document.querySelector('#input-username');
const questionLocation = document.querySelector('#question-location');
const gameLocation = document.querySelector('#game-location');
const topScoreLocation = document.querySelector('#top-score-location');
const leaderboardLocation = document.querySelector('#leaderboard-location');
const leaderboardTableLocation = document.querySelector('#leaderboard-table');
const leaderboardCard = document.querySelector('#leaderboard-card');
let counter = 1;

let rulesShow = false;
let currentUser;
let answer;
let firstGame = true;

// Actioncable stuff

cable.subscriptions.create('QuizChannel', {
  received: data => {
    addGameStartedNotifications(data)
  }
})

function addGameStartedNotifications(data) {
  let para = document.querySelector(`#update${counter}`)
  resetAnimation(para)
  let updatetext = data
  para.innerText = updatetext
  para.style.webkitAnimation = ''
  para.className = 'new-player-notification text-blur-out'
  if (counter === 5) {
    counter = 0
  }
  counter += 1
}


function resetAnimation(para) {
  para.style.animation = 'none';
  para.offsetHeight
  // trigger reflow
  para.style.animation = null
}

// how do we create cable to get user scores at certain increments?

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
      .then(user => {
        if (user.id) {
          beginGame(user)
        } else {
          alert('Invalid username!');
          location.reload();
        }
      });
    // .catch(alert('Invalid username!'));
  }
}

function newQuiz(user) {
  leaderboardCard.className = 'hidden-leaderboard'
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
  loc = document.querySelector('#game-location')
  div = document.createElement('div')
  div.className = 'row justify-content-center'

  horseButton = document.createElement('img');
  preHorseDiv = document.createElement('div');
  preHorseDiv.className = 'col-xs-2';
  horseDiv = document.createElement('div');
  horseButton.id = 'horse-button';
  horseButton.className = 'game-button'
  horseButton.setAttribute("src", 'img/horse-face.png');
  horseDiv.className = 'col-xs-4';
  horseDiv.append(horseButton);

  beerButton = document.createElement('img');
  postBeerDiv = document.createElement('div');
  postBeerDiv.className = 'col-xs-2';
  beerDiv = document.createElement('div');
  beerButton.id = 'beer-button';
  beerButton.className = 'game-button'
  beerButton.setAttribute("src", 'img/beer-mug.png');
  beerDiv.className = 'col-xs-4';
  beerDiv.append(beerButton);

  div.append(preHorseDiv, horseDiv, beerDiv, postBeerDiv)
  loc.append(div);

  horseButton.addEventListener('click', e => {
    buttonAnimation()
    horseCheck(quiz)
  })
  beerButton.addEventListener('click', e => {
    buttonAnimation()
    beerCheck(quiz)
  })
  newQuestion(quiz)
}

function buttonAnimation() {

}

function horseCheck(quiz) {
  if (answer === 'horse') {
    questionLocation.lastChild.setAttribute('id', 'correct-answer')
    increaseScore(quiz)
      .then(newQuestion(quiz))
  } else {
    questionLocation.lastChild.setAttribute("id", "incorrect-answer");
    loseQuiz(quiz);
  }

}

function beerCheck(quiz) {
  if (answer === 'beer') {
    questionLocation.lastChild.setAttribute('id', 'correct-answer')
    increaseScore(quiz)
      .then(newQuestion(quiz))
  } else {
    questionLocation.lastChild.setAttribute("id", "incorrect-answer");
    loseQuiz(quiz);
  }
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

  const gameFooter = document.querySelector('#game-data-footer')
  gameFooter.innerHTML = ''
  h2 = document.createElement('h2')
  h2.innerText = `Last score: ${quiz.score}`
  h2.id = 'last-score'
  gameLocation.append(tryAgainButton)
  gameFooter.append(h2)
  updateUserScore(currentUser, quiz.score)
  getLeaderboard()
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
  loc = document.querySelector('#game-location');
  topScoreLocation.children[0].innerText = `${user.name.toUpperCase()} your best score is:`;
  if (user.top_score) {

    topScoreLocation.children[0].innerText += ` ${user.top_score}!`;
  } else {
    topScoreLocation.children[0].innerText += ` ${0}!`;

  }
  newQuiz(user);
}

function showRules() {
  rulesCard.style.display = 'block'
  rulesButton.innerText += ' ⬇'
}

function hideRules() {
  rulesCard.style.display = 'none'
  rulesButton.innerText = 'Rules and Shite'
}


function horseQuestion(horse, quiz) {
  answer = 'horse'
  h1 = document.createElement('h1')
  h1.innerText = horse.name
  checkQuestionLength()
  questionLocation.append(h1)
}

function beerQuestion(beer, quiz) {
  answer = 'beer'
  h1 = document.createElement('h1')
  h1.innerText = beer.name
  checkQuestionLength()
  questionLocation.append(h1)

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
  } else {
    questionRequest(quiz, HORSE_QUESTIONS_URL)
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

function getLeaderboard() {
  return fetch(QUIZZES_URL)
    .then(resp => resp.json())
    .then(allQuizzes => allQuizzes.sort((a, b) => b.score - a.score))
    .then(sortedQuizzes => getUnique(sortedQuizzes))
    .then(uniqueQuizzes => uniqueQuizzes.slice(0, 5))
    .then(leaderboard => renderLeaderboard(leaderboard))
}

function renderLeaderboard(leaderboard) {
  // clear function replaces innerHTML
  leaderboardTableLocation.innerHTML =
    '<tr id=leaderboard-row-0></tr>' +
    '<tr id=leaderboard-row-1></tr>' +
    '<tr id=leaderboard-row-2></tr>' +
    '<tr id=leaderboard-row-3></tr>' +
    '<tr id=leaderboard-row-4></tr>'
  leaderboard.forEach(quiz => {
    const index = leaderboard.indexOf(quiz)
    user = getName(quiz.user.id, USERS_URL)
      .then(user => renderLeaderboardRow(user, quiz, index))
  })
}

function renderLeaderboardRow(user, quiz, index) {
  const leaderboardRow = document.querySelector(`#leaderboard-row-${index}`)

  let nameTd = document.createElement('td')
  nameTd.innerText = user.name
  leaderboardRow.appendChild(nameTd)

  let scoreTd = document.createElement('td')
  scoreTd.innerText = quiz.score
  leaderboardRow.appendChild(scoreTd)
}

getLeaderboard()

const getAllQuizzes = async () => {
  const data = await fetch(QUIZZES_URL);
  const quizzesArray = await data.json();
  quizzesArray.sort((a, b) => (a.score) - (b.score));
};

function getUnique(quizzes) {
  const unique = quizzes
    .map(quiz => quiz.user.id)
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter(e => quizzes[e]).map(e => quizzes[e])
  return unique
}