// Check if the session is being ran locally
if (window.location.href.includes('heroku')) {
  BASE_URL = 'https://beer-or-horse.herokuapp.com/'
} else {
  BASE_URL = 'localhost:3000'
}

const USERS_URL = `${BASE_URL}/users`

const rulesCard = document.querySelector("#rules-card")
const rulesButton = document.querySelector("#rules-button")
const startButton = document.querySelector("#start-button")
const readButton = document.querySelector("#read-button")

let rulesShow = false
let currentUser

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

startButton.addEventListener('click', e => {
  startGame(username)})

function startGame(username) {
  startButton.style.display = 'none'
  rulesButton.style.display = 'none'
  fetchAllUsers().then(array => checkForUser(array, username))
}



function showRules() {
  rulesCard.style.display = 'block'
}

function hideRules() {
  rulesCard.style.display = 'none'
}