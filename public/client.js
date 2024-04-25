// Importing required modules
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const buttonPins = {
	red: 17,
	yellow: 18,
	blue: 19;
};

//GPIO objects for buttons
const buttons = {
	red: new Gpio(buttonPins.red, 'in', 'falling', { debounceTimeout: 10 }),
	yellow: new Gpio(buttonPins.yellow, 'in', 'falling', { debounceTimeout: 10 }),
	blue: new Gpio(buttonPins.blue, 'in', 'falling', { debounceTimeout: 10 }),


//Initial levels
let waterLevel = 50;
let temperatureLevel = 50;

//Draw graph
function drawGraph() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//Water
	ctx.fillStyle = 'blue';
	ctx.fillRect(50, canvas.height - waterLevel, 50, waterLevel);
	//Temp
	ctx.fillStyle = 'red';
	ctx.fillRect(200, canvas.height - temperatureLevel, 50, temperatureLevel);
}

//Random events
function RandomEvent() {
	const eventType = Math.random();
	
	if (eventType < 0.2) {
	temperatureLevel = Math.floor(Math.random() * 20);
	console.log('Temperaturen er for lav!');
	drawGraph(); //Update canvas
	return 'temperature';
	} else if (eventType < 0.4) {
	waterLevel = Math.floor(Math.random() * 20);
	console.log('Vann nivået er for lav!');
	drawGraph();
	return 'water';
	}
	return null;
}

//Function to select a button color by random
function getRandomButton() {
	const colors = Object.keys(buttonPins);
	return colors[Math.floor(Math.random() * colors.length)];
}

// Handle button press
Object.values(buttons).forEach(button => {
button.watch((err, value) => {
	if (err) {
	console.error('Error:', err);
	return;
	}
	console.log('Button pressed!');
	//Check if correct button pressed
	if (value === 0) {
	console.log('Korrekt knapp!');
	// Reset levels
	waterLevel = 50;
	temperatureLevel = 50;
	drawGraph(); //Updates canvas
	
	}
	});
});
};

setInterval(() => {
	waterLevel = Math.floor(Math.random() * 100);
	temperatureLevel = Math.floor(Math.random() * 100);
	
//check for random events
const event = handleRandomEvent();
//If random event, select random color to be pressed
if (event) {
	const buttonColor = getRandomButton();
	console.log(`Press ${buttonColor} button to correct ${event} level drop`);
	}
	
//Redraw graph
drawGraph();
}, 2000);

//Initial draw 
drawGraph();

