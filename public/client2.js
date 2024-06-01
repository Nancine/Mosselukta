const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
var socket = io();

let waterLevel = 50;
let tempLevel = 50;
let message = '';
let timerDuration = 60;
let timerInterval;
let selectedButton = null;
let reactionTimer = null;
let lives = null;
let score = 0;
let countdown = 4;

// Draw graph
function drawSelf() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Water
  ctx.fillStyle = 'rgb(158,198,223)';
  ctx.fillRect(100, canvas.height - waterLevel, 80, waterLevel);

  // Temp
  ctx.fillStyle = 'rgb(255,169,118)';
  ctx.fillRect(220, canvas.height - tempLevel, 80, tempLevel);

  // Ideal parameters
  ctx.fillStyle = 'rgba(106,160,117,0.4)';
  ctx.fillRect(0, canvas.height / 2 + 5, canvas.width, 35);

  // Display text
  ctx.font = 'bold 18px Courier New';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  var lineheight = 15;
  const words = message.split(' ');
  let offsetX = 0;

  let fillColor = 'black';
  words.some(word => {
    switch (word) {
      case 'RØDE':
        fillColor = 'red'
        break;
      case 'BLÅ':
        fillColor = 'blue'
        break;
      case 'HVITE':
        fillColor = 'white'
        break;
      case 'GULE':
        fillColor = 'yellow'
        break;
    }


  });
  ctx.fillStyle = fillColor

  var lines = message.split('\n');
  for (var i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], (canvas.width / 2), (canvas.height / 2) + (i * lineheight));
  }

  // Display timer
  ctx.fillStyle = 'black';
  ctx.font = 'bold 18px Courier New';
  ctx.fillText('Tid: ' + timerDuration, 65, 20);

  // Display lives left
  ctx.fillStyle = 'black';
  ctx.font = 'bold 18px Courier New';
  ctx.fillText('Liv: ' + lives, canvas.width - 65, 20);

  // Display score
  ctx.fillStyle = 'black';
  ctx.font = 'bold 18px Courier New';
  ctx.fillText('Poeng: ' + score, canvas.width - 200, 20);
}

function checkLevels() {
  if (reactionTimer == null) {
    let allGood = true;
    message = "";
    if (waterLevel < 100) {
      message = 'Trykk for lav! ';
      allGood = false;
    }
    if (waterLevel > 150) {
      message += 'Trykk for høy! ';
      allGood = false;
    }
    if (tempLevel < 100) {
      message += 'Temperatur for lav! ';
      allGood = false;
    }
    if (tempLevel > 150) {
      message += 'Temperatur for høy! ';
      allGood = false;
    }
    if (allGood === false) {
      selectAndPromptButton();
    }
  }
}

function startCountdown() {
  lives = 30;
  timerInterval = setInterval(() => {
    timerDuration--;
    countdown--;
    drawSelf(); // Updating countdown timer display
    if (timerDuration <= 0) {
      clearInterval(timerInterval);
      // Redirect to winner page
      window.location.href = `winner.html?finalScore=${score}`;
    }
  }, 1000); // 
}

function selectAndPromptButton() {
  countdown = 4;
  console.log('selectedButton = ', selectedButton)
  if (selectedButton) return; // Button already selected
  selectedButton = ['RØDE', 'BLÅ', 'GULE', 'HVITE'][Math.floor(Math.random() * 4)];
  socket.emit('setSelectedButton', selectedButton);
  console.log('We selected a button: ', selectedButton)
  message += `\nTrykk den ${selectedButton} knappen!`;
  drawSelf();


  // Start reaction timer
  reactionTimer = setTimeout(() => {
    message = 'Feil!';
    lives--;
    resetValues();
    drawSelf();
    // Game over, loser.
    if (lives === 0) {
      clearInterval(timerInterval);
      window.location.href = 'loser.html';
    }
  }, 3000);
}

startCountdown();

// Game loop
setInterval(() => {
  waterLevel = Math.floor(Math.random() * 250);
  tempLevel = Math.floor(Math.random() * 250);

  // Redraw graph
  checkLevels();
  drawSelf();
}, 3000); // Adjust the interval for game updates as needed

socket.on('correctPress', (levels) => {
  waterLevel = levels.waterLevel;
  tempLevel = levels.tempLevel;
  if (countdown > 0) {
    score += countdown;
  }
  console.log('countdown = ', countdown)
  resetValues();
  message = 'RIKTIG!';
  drawSelf();
});

function resetValues() {
  countdown = 0;
  clearTimeout(reactionTimer);
  reactionTimer = null;
  selectedButton = null;
}
socket.on('start', (value) => {
  if (value === 1) {
    console.log("Start button pressed")
  }
});
