const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initial levels
let waterLevel = 50;
let tempLevel = 50;
let message = '';
let timerDuration = 60;
let timerInterval;

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
    ctx.fillRect(0, canvas.height / 2 - 5, canvas.width, 20);

    // Display text
    ctx.fillStyle = 'red';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, (canvas.width / 2), (canvas.height / 2));

    // Display timer
    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(timerDuration + ' sekunder', 50, 20);
}

function checkLevels() {
    if (waterLevel < 20) {
        message = 'Vanntrykk for lav!';
    } else if (waterLevel > 80) {
        message = 'Vanntrykk for høy!';
    } else if (tempLevel < 20) {
        message = 'Temperatur for lav!';
    } else if (tempLevel > 80) {
        message = 'Temperatur for høy!';
    } else {
        message = '';
    }
}

function startCountdown() {
    timerInterval = setInterval(() => {
        timerDuration--;
        drawSelf(); // Updating countdown timer display
        if (timerDuration <= 0) {
            clearInterval(timerInterval);
            // Redirect to winner page
            window.location.href = 'winner.html';
        }
    }, 1000); // 
}

startCountdown();

// Game loop
setInterval(() => {
    waterLevel = Math.floor(Math.random() * 250);

    // Redraw graph
    checkLevels();
    drawSelf();
}, 3000); // Adjust the interval for game updates as needed

setInterval(() => {
    tempLevel = Math.floor(Math.random() * 250);

    checkLevels();
    drawSelf();
}, 3000);