const buttonColors = ["red", "blue", "green", "yellow"]
let gamePattern = []
let userClickedPattern = []
let level = 0
let score = 0
let highScore = 0
let gameStarted = false

const startBtn = document.getElementById("start-btn")
const levelTitle = document.getElementById("level-title")
const scoreValue = document.getElementById("score-value")
const highScoreValue = document.getElementById("high-score-value")

document.addEventListener("keydown", () => {
  if (!gameStarted) {
    startGame()
  }
})

startBtn.addEventListener("click", () => {
  if (!gameStarted) {
    startGame()
  }
})

function startGame() {
  gameStarted = true
  level = 0
  score = 0
  gamePattern = []
  userClickedPattern = []
  updateScore()
  nextSequence()
  animateTitle("Sequence Initiated")
}

function nextSequence() {
  level++
  userClickedPattern = []
  updateLevelTitle()

  const randomNumber = Math.floor(Math.random() * 4)
  const randomChosenColor = buttonColors[randomNumber]
  gamePattern.push(randomChosenColor)

  playSequence(gamePattern)
}

function playSequence(sequence) {
  disableButtons()
  sequence.forEach((color, index) => {
    setTimeout(
      () => {
        animateButton(color)
        playSound(color)
        if (index === sequence.length - 1) {
          enableButtons()
        }
      },
      (index + 1) * 600,
    )
  })
}

function animateButton(color) {
  const button = document.getElementById(color)
  gsap.to(button, {
    scale: 1.1,
    brightness: 1.5,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      gsap.to(button, {
        boxShadow: `0 0 30px ${color}`,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      })
    },
  })
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (gameStarted) {
      const userChosenColor = this.id
      userClickedPattern.push(userChosenColor)

      playSound(userChosenColor)
      animatePress(userChosenColor)
      checkAnswer(userClickedPattern.length - 1)
    }
  })
})

function playSound(name) {
  const audio = document.getElementById(`${name}-sound`)
  audio.currentTime = 0
  audio.play()
}

function animatePress(currentColor) {
  const button = document.getElementById(currentColor)
  button.classList.add("pressed")
  setTimeout(() => button.classList.remove("pressed"), 100)
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    score += 10
    updateScore()

    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(() => {
        animateTitle("Sequence Complete")
        setTimeout(() => nextSequence(), 1000)
      }, 1000)
    }
  } else {
    gameOver()
  }
}

function gameOver() {
  playSound("wrong")
  document.body.classList.add("game-over")
  animateTitle("Neural Link Severed")

  gsap.to("#game-container", {
    rotation: 5,
    duration: 0.1,
    yoyo: true,
    repeat: 5,
  })

  createParticles()
  updateHighScore()

  setTimeout(() => {
    document.body.classList.remove("game-over")
    gameStarted = false
    startBtn.textContent = "Reboot System"
  }, 2000)
}

function updateLevelTitle() {
  animateTitle(`Neural Link ${level}`)
}

function animateTitle(text) {
  gsap.to(levelTitle, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      levelTitle.textContent = text
      gsap.to(levelTitle, {
        opacity: 1,
        duration: 0.2,
        textShadow: "0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff",
      })
    },
  })
}

function updateScore() {
  gsap.to(scoreValue, {
    scale: 1.2,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      scoreValue.textContent = score
    },
  })
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score
    gsap.to(highScoreValue, {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        highScoreValue.textContent = highScore
      },
    })
  }
}

function createParticles() {
  const particlesContainer = document.getElementById("particles")
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div")
    particle.style.position = "absolute"
    particle.style.width = "5px"
    particle.style.height = "5px"
    particle.style.backgroundColor = buttonColors[Math.floor(Math.random() * buttonColors.length)]
    particle.style.borderRadius = "50%"
    particlesContainer.appendChild(particle)

    gsap.to(particle, {
      x: gsap.utils.random(-500, 500),
      y: gsap.utils.random(-500, 500),
      opacity: 0,
      duration: gsap.utils.random(1, 3),
      onComplete: () => particlesContainer.removeChild(particle),
    })
  }
}

function disableButtons() {
  document.querySelectorAll(".btn").forEach((btn) => (btn.style.pointerEvents = "none"))
}

function enableButtons() {
  document.querySelectorAll(".btn").forEach((btn) => (btn.style.pointerEvents = "auto"))
}

function createStarfield() {
  const starfield = document.getElementById("starfield")
  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div")
    star.className = "star"
    star.style.left = `${Math.random() * 100}%`
    star.style.top = `${Math.random() * 100}%`
    star.style.animationDuration = `${Math.random() * 3 + 2}s`
    starfield.appendChild(star)
  }
}

createStarfield()

// Easter egg: Konami Code
const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
]
let konamiIndex = 0

document.addEventListener("keydown", (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++
    if (konamiIndex === konamiCode.length) {
      activateKonamiCode()
      konamiIndex = 0
    }
  } else {
    konamiIndex = 0
  }
})

function activateKonamiCode() {
  document.body.style.background = "url('https://media.giphy.com/media/3og0IFrHkIglEOg8Ba/giphy.gif')"
  gsap.to(".btn", {
    rotation: 360,
    duration: 1,
    ease: "bounce.out",
  })
  setTimeout(() => {
    document.body.style.background = ""
    gsap.to(".btn", { rotation: 0, duration: 1 })
  }, 5000)
}

// Made by Saad Tiwana
console.log("Cosmic Memory Challenge v1.0 | Created by Saad Tiwana")

