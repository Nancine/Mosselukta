// Importing required modules
const canvas = document.getElementById('gameCanvas');
ctx = canvas.getContext('2d');

//const buttonPins = {
//	red: 17,
//	yellow: 18,
//	blue: 19,
//};

//GPIO objects for buttons
//const buttons = {
//	red: new Gpio(buttonPins.red, 'in', 'falling', { debounceTimeout: 10 }),
//	yellow: new Gpio(buttonPins.yellow, 'in', 'falling', { debounceTimeout: 10 }),
//	blue: new Gpio(buttonPins.blue, 'in', 'falling', { debounceTimeout: 10 }),
//}

//Initial levels
let waterLevel = 50;
let tempLevel = 50;


//Draw graph
function drawSelf() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Water
	ctx.fillStyle = 'rgb(255,169,118)' //"rgb(43, 101, 236)";
	ctx.fillRect(100, canvas.height - waterLevel, 80, waterLevel);
	//Temp
	ctx.fillStyle = 'rgb(117,160,106)'; //"rgb(244, 161, 39)"
	ctx.fillRect(220, canvas.height - tempLevel, 80, tempLevel);
}


//Random events
function RandomEvent() {
	const eventType = Math.random();

	if (eventType < 0.2) {
		tempLevel = Math.floor(Math.random() * 50);
		console.log('Temperature low');
		drawSelf();
		return 'temperature';
	}
	else if (eventType < 0.4) {
		waterLevel = Math.floor(Math.random() * 50);
		console.log('Water level low');
		drawSelf();
		return 'water';
	}
	return null;
}


//Function to select a button color by random
//function getRandomButton() {
//	const colors = Object.keys(buttonPins);
//	return colors[Math.floor(Math.random() * colors.length)];
//}

// Handle button press
//Object.values(buttons).forEach(button => {
//button.watch((err, value) => {
//	if (err) {
//	console.error('Error:', err);
//	return;
//	}
//	console.log('Button pressed!');
//	//Check if correct button pressed
//	if (value === 0) {
//	console.log('Korrekt knapp!');
// Reset levels
//	waterLevel = 50;
//	tempLevel = 50;
//	drawSelf(); //Updates canvas

//	}
//	});
//});

setInterval(() => {
	waterLevel = Math.floor(Math.random() * 250);
	tempLevel = Math.floor(Math.random() * 250);

	//check for random events
	//const event = handleRandomEvent();
	//If random event, select random color to be pressed
	//if (event) {
	//	const buttonColor = getRandomButton();
	//	console.log(`Press ${buttonColor} button to correct ${event} level drop`);
	//	}

	//Redraw graph
	drawSelf();
}, 2000);

ctx.fillStyle = 'red';
ctx.font = 'bold 16px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText("ERROR", (canvas.width / 2), (canvas.height / 2));

ctx.beginPath();
// Start
ctx.moveTo(400, 45);
// End
ctx.lineTo(0, 47);
ctx.strokeStyle = 'green';
ctx.stroke();

ctx.beginPath();
ctx.moveTo(400, 98);
ctx.lineTo(0, 100);
ctx.strokeStyle = 'green';
ctx.stroke();

//Initial draw
drawSelf();

