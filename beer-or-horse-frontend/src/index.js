// Check if the session is being ran locally
if (window.location.href.includes('heroku')) {
  BASE_URL = 'https://beer-or-horse-backend.herokuapp.com/';
} else {
  BASE_URL = 'http://localhost:3000';
}

const USERS_URL = `${BASE_URL}/users`;
const QUIZZES_URL = `${BASE_URL}/quizzes`;
const BEERS_URL = `${BASE_URL}/beers`;
const HORSES_URL = `${BASE_URL}/horses`;
const BEER_QUESTIONS_URL = `${BASE_URL}/beer_questions`;
const HORSE_QUESTIONS_URL = `${BASE_URL}/horse_questions`;

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



let rulesShow = false;
let currentUser;
let answer;
let firstGame = true;

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
  hideRules();
  questionLocation.innerHTML = '';
  username = usernameInput.value;
  usernameInput.style.display = 'none';
  // countdown(3)
  newUser(username);
}

function newUser(username) {
  if (currentUser) {
    beginGame(currentUser);
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
      .then(beginGame);
  }
}

function newQuiz(user) {
  currentUser = user;
  newQuizObj = {
    'user_id': user.id,
    'score': 0
  };
  fetch(QUIZZES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newQuizObj)
    })
    .then(resp => resp.json())
    .then(addButtonFunctionality);
}

function addButtonFunctionality(quiz) {
  loc = document.querySelector('#game-location');
  div = document.createElement('div');
  div.className = 'row justify-content-center';

  horseButton = document.createElement('img');
  preHorseDiv = document.createElement('div');
  preHorseDiv.className = 'col-sm';
  horseDiv = document.createElement('div');
  horseButton.id = 'horse-button';
  horseButton.setAttribute("src", 'img/horse-face.png');
  horseDiv.className = 'col-xs';
  horseDiv.append(horseButton);

  beerButton = document.createElement('img');
  postBeerDiv = document.createElement('div');
  postBeerDiv.className = 'col-sm';
  beerDiv = document.createElement('div');
  beerButton.id = 'beer-button';
  beerButton.setAttribute("src", 'img/beer-mug.png');
  beerDiv.className = 'col-xs';
  beerDiv.append(beerButton);

  div.append(preHorseDiv, horseDiv, beerDiv, postBeerDiv);

  // horseButton = document.createElement('button');
  // beerButton = document.createElement('button');
  // horseButton.id = 'horse-button';
  // beerButton.id = 'beer-button';
  // horseButton.className = 'btn btn-danger btn-lg btn-block';
  // beerButton.className = 'btn btn-danger btn-lg btn-block';
  // horseButton.innerText = '🐴';
  // beerButton.innerText = '🍺';

  loc.append(div);

  horseButton.addEventListener('click', e => {
    buttonAnimation();
    horseCheck(quiz);
  });
  beerButton.addEventListener('click', e => {
    buttonAnimation();
    beerCheck(quiz);
  });
  newQuestion(quiz);
}

function buttonAnimation() {

}

function horseCheck(quiz) {
  if (answer === 'horse') {
    questionLocation.lastChild.setAttribute("id", "correct-answer");
    increaseScore(quiz)
      .then(newQuestion(quiz));
  } else {
    questionLocation.lastChild.setAttribute("id", "incorrect-answer");
    loseQuiz(quiz);
    // newQuiz(currentUser)
  }
  console.log(quiz);
}

function beerCheck(quiz) {
  if (answer === 'beer') {
    questionLocation.lastChild.setAttribute("id", "correct-answer");
    increaseScore(quiz)
      .then(newQuestion(quiz));
  } else {
    questionLocation.lastChild.setAttribute("id", "incorrect-answer");
    loseQuiz(quiz);
    // newQuiz(currentUser)
  }
  console.log(quiz);
}

function loseQuiz(quiz) {
  firstGame = false;
  buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.remove();
  });
  tryAgainButton = document.createElement('button');
  tryAgainButton.innerText = 'Try Again... IF YOU DARE';
  tryAgainButton.className = 'btn btn-danger btn-lg';
  gameLocation.innerHTML = '';
  h1 = document.createElement('h1');
  h1.innerText = `LAST SCORE: ${quiz.score}`;
  gameLocation.append(h1, tryAgainButton);
  updateUserScore(currentUser, quiz.score);
  getLeaderboard();
  tryAgainButton.addEventListener('click', e => {
    tryAgainButton.remove();
    startGame();
  });
}

function increaseScore(quiz) {
  ++quiz.score;
  return fetch(`${QUIZZES_URL}/${quiz.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quiz)
  }).then(response => response.json());
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
        currentUser = user;
      });
  }
}

function beginGame(user) {
  // middleH1 = document.createElement('h1')
  loc = document.querySelector('#game-location');
  // middleH1.innerText = `${user.name.toUpperCase()} IS THIS A BEER OR A HORSE?`
  topScoreLocation.children[0].innerText = `${user.name.toUpperCase()} TOP SCORE:`;
  if (user.top_score) {
    topScoreLocation.children[1].innerText = user.top_score;
  } else {
    topScoreLocation.children[1].innerText = 0;
  }
  // loc.append(middleH1)
  newQuiz(user);
}

function showRules() {
  rulesCard.style.display = 'block';
  rulesButton.innerText += ' ⬇';
}

function hideRules() {
  rulesCard.style.display = 'none';
  rulesButton.innerText = 'Rules and Shite';
}

function horseQuestion(horse, quiz) {
  answer = 'horse';
  h1 = document.createElement('h1');
  h1.innerText = horse.name;
  checkQuestionLength();
  questionLocation.append(h1);
  console.log(answer, quiz);
}

function beerQuestion(beer, quiz) {
  answer = 'beer';
  h1 = document.createElement('h1');
  h1.innerText = beer.name;
  checkQuestionLength();
  questionLocation.append(h1);
  console.log(answer, quiz);
}

function checkQuestionLength() {
  if (questionLocation.childNodes.length === 5) {
    questionLocation.childNodes[0].remove();
  }
}

function newQuestion(quiz) {
  random = Math.floor(Math.random() * 2);
  if (random === 1) {
    questionRequest(quiz, BEER_QUESTIONS_URL);
    console.log(quiz);
  } else {
    questionRequest(quiz, HORSE_QUESTIONS_URL);
    console.log(quiz);
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
    .then(question => askQuestion(quiz, question));
}

function askQuestion(quiz, question) {
  if (question.beer_id) {
    getName(question.beer_id, BEERS_URL)
      .then(beer => beerQuestion(beer, quiz));
  } else {
    getName(question.horse_id, HORSES_URL)
      .then(horse => horseQuestion(horse, quiz));
  }
}

function getName(id, url) {
  return fetch(`${url}/${id}`)
    .then(response => response.json());
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
    .then(leaderboard => renderLeaderboard(leaderboard));
}

function renderLeaderboard(leaderboard) {
  // clear function replaces innerHTML
  leaderboardTableLocation.innerHTML =
    '<tr id=leaderboard-row-0></tr>' +
    '<tr id=leaderboard-row-1></tr>' +
    '<tr id=leaderboard-row-2></tr>' +
    '<tr id=leaderboard-row-3></tr>' +
    '<tr id=leaderboard-row-4></tr>';
  leaderboard.forEach(quiz => {
    const index = leaderboard.indexOf(quiz);
    user = getName(quiz.user_id, USERS_URL)
      .then(user => renderLeaderboardRow(user, quiz, index));
  });
}

function renderLeaderboardRow(user, quiz, index) {
  const leaderboardRow = document.querySelector(`#leaderboard-row-${index}`);


  let nameTd = document.createElement('td');
  nameTd.innerText = user.name;
  leaderboardRow.appendChild(nameTd);

  let scoreTd = document.createElement('td');
  scoreTd.innerText = quiz.score;
  leaderboardRow.appendChild(scoreTd);
}

getLeaderboard();

const getAllQuizzes = async () => {
  const data = await fetch(QUIZZES_URL);
  const quizzesArray = await data.json();
  quizzesArray.sort((a, b) => (a.score) - (b.score));
  console.log(quizzesArray);
};

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