/*
    - set variables
    - display the level
    - tigger the start event
    - get random word from wordsArray
    - remove the word from the array
    - display upcoming words
    - start time counting
    - increment score and get another word
*/

// Variables
let arrOfWords = [
    "Hello",
    "Programming",
    "Code",
    "Javascript",
    "Town",
    "Country",
    "Testing",
    "Youtube",
    "Linkedin",
    "Twitter",
    "Github",
    "Leetcode",
    "Internet",
    "Python",
    "Scala",
    "Destructuring",
    "Paradigm",
    "Styling",
    "Cascade",
    "Documentation",
    "Coding",
    "Funny",
    "Working",
    "Dependencies",
    "Task",
    "Runner",
    "Roles",
    "Test",
    "Rust",
    "Playing"
];
// array to stock words after showing them
let removedWords = []

const levels = {
    easy: 4,
    normal: 3,
    hard: 2
}

const lvlSelected = document.querySelector("select[name='level']")
const yourLevel = document.querySelector(".level")
const timeLevel = document.querySelector(".time")
const startBtn = document.querySelector("button")
const wordToType = document.querySelector(".word")
const input = document.getElementById("word-typed")
const upcomingWords = document.querySelector(".upcoming-words")
const timeLeft = document.querySelector(".time-left")
const score = document.querySelector(".score")
const totalWords = document.querySelector(".total-words")

// Get and display Levels
// with default level
let words = arrOfWords.filter((e) => e.length > 4 && e.length < 8)
totalWords.innerHTML = words.length
// with level selected
lvlSelected.onchange = () => {
    showDetails()
}

// Show The Hightest score if already exist in local Storage
if (localStorage.score) {
    document.querySelector(".high-score").innerHTML = JSON.parse(localStorage.getItem("score")).score
}

// trigger the start event
startBtn.addEventListener("click", function () {
    startBtn.remove()
    lvlSelected.setAttribute("disabled", "")
    genWord()
})

function genWord() {
    input.focus()
    upcomingWords.innerHTML = ""
    input.value = ""
    // Take random word
    let word = words[Math.floor(Math.random() * words.length)]
    wordToType.innerHTML = word
    // remove the word and add it to the removedWords array
    removedWords.push(words.splice(words.indexOf(word), 1)[0])
    // display upcoming words
    words.forEach((e) => {
        upcomingWords.style.display = "flex"
        let span = document.createElement("span")
        let text = document.createTextNode(e)
        span.appendChild(text)
        span.style.userSelect = "none"
        upcomingWords.appendChild(span)
    })
    // Start time counting
    let counter = setInterval(() => {
        timeLeft.innerHTML--;
        if (timeLeft.textContent === "0") {
            clearInterval(counter)
            if (input.value.toLowerCase() === wordToType.textContent.toLowerCase()) {
                score.innerHTML++
                if (words.length !== 0) {
                timeLeft.innerHTML = timeLevel.textContent
                genWord()
                } else {
                    resultMsg("Good &#128512", "good")
                    lvlSelected.removeAttribute("disabled")
                }
            } else {
                resultMsg("Game Over &#128542", "bad")
                lvlSelected.removeAttribute("disabled")
            }
        }
    }, 1000);
}

// Show message result and save score in localStorage
function resultMsg(msg, result) {
    let span = document.createElement("span")
    span.innerHTML= msg
    span.className = result
    document.querySelector("main").append(span)
    input.value = ""
    wordToType.innerHTML = ""
    // Save the score to local storage
    saveToLocalStorage()
    // Add Play again button
    createPlayAgainBtn(span)
}

// Show Game Details
function showDetails() {
    // Filter array of words when changing level
    switch (lvlSelected.value) {
        case "easy":
            words = arrOfWords.filter((e) => e.length <= 4)
            break
        case "normal":
            words = arrOfWords.filter((e) => e.length > 4 && e.length < 8)
            break
        case "hard":
            words = arrOfWords.filter((e) => e.length > 4)
    }
    let level = lvlSelected.value
    yourLevel.innerHTML = level
    timeLevel.innerHTML = levels[level]
    timeLeft.innerHTML = levels[level]
    totalWords.innerHTML = words.length
    score.innerHTML = "0"
}

function saveToLocalStorage() {
    // Save the score to local storage
    if(!localStorage.length || parseInt(score.textContent) > JSON.parse(localStorage.getItem("score")).score) {
        localStorage.setItem("score", JSON.stringify({
            score: score.textContent,
            date: Date()
        }))
        document.querySelector(".high-score").innerHTML = JSON.parse(localStorage.getItem("score")).score
    }
}

function createPlayAgainBtn(span) {
    // Add Play again button
    let playAgainBtn = document.createElement("button")
    playAgainBtn.innerText = "Play Again"
    playAgainBtn.className = "play-again"
    document.querySelector("main").append(playAgainBtn)
    playAgainBtn.onclick = () => {
        score.innerText = "0"
        playAgainBtn.remove()
        span.remove()
        words = words.concat(removedWords)
        removedWords.splice(0)
        lvlSelected.setAttribute("disabled", "")
        showDetails()
        genWord()
    }
}