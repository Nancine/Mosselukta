const express = require('express');    // Setup express web-server
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http); // Setup socket.io communication
const Gpio = require('onoff').Gpio;    // Setup GPIO library
const debounceTime = 10; // Debounce time in milliseconds
const DEBUG = false; // Set to true Makes start button work as all buttons

let selectedButton = null;
let timer = null;

// Assign Raspberry Pi buttons
const buttons = {
  start: new Gpio(515, 'in', 'rising', { debounceTimeout: debounceTime }),  // GPIO 3 pin 5
  red: new Gpio(527, 'in', 'rising', { debounceTimeout: debounceTime }),    // GPIO 15 pin 10
  blue: new Gpio(516, 'in', 'rising', { debounceTimeout: debounceTime }),   // GPIO 4 pin 7
  yellow: new Gpio(526, 'in', 'rising', { debounceTimeout: debounceTime }), // GPIO 14 pin 8
  white: new Gpio(519, 'in', 'rising', { debounceTimeout: debounceTime })   // GPIO 7 pin 26
};

const buttonNames = Object.keys(buttons);

function resetLevels() {
  waterLevel = 125;  // Centering levels
  tempLevel = 125;
}

function handleButtonPress(button) {
  if (button === selectedButton) {
    console.log(`Correct button (${button}) pressed!`);
    resetLevels();
    io.emit('correctPress', { waterLevel, tempLevel });
    selectedButton = null;
  } else {
    console.log(`Wrong button (${button}) pressed!`);
  }
  selectedButton = null;
  clearTimeout(timer);
}

buttonNames.forEach(buttonName => {
  buttons[buttonName].watch((err, value) => {
    if (err) {
      console.error(`Error on button ${buttonName}:`, err);
      return;
    }
    console.log(`button ${buttonName} has value ${value} `)
    if (selectedButton) {
      handleButtonPress(buttonName);
    }
    if (buttonName === "start") {
      io.emit(buttonName, value);
      if (DEBUG) {
        resetLevels();
        io.emit('correctPress', { waterLevel, tempLevel });
      }
    }
  });
});



io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
  socket.on('setSelectedButton', (button) => {
    console.log(`Selected button: ${button}`);
    switch (button) {
      case 'RØDE':
        selectedButton = 'red';
        break;
      case 'BLÅ':
        selectedButton = 'blue';
        break;
      case 'GULE':
        selectedButton = 'yellow';
        break;
      case 'HVITE':
        selectedButton = 'white';
        break;
    }
  });
});

// Configure and start static web-server
app.use(express.static(__dirname));
var server = http.listen(3000, () => {
  console.log('listening on *:3000');
});

// Stop web-server and release GPIO resources
process.on('SIGINT', _ => {
  console.log("Terminating express");
  server.close((err) => {
    console.log('server closed')
    process.exit(err ? 1 : 0)
  })
  console.log("Freeing GPIO assignments");
  for (let button in buttons) {
    buttons[button].unexport();
  }
});
