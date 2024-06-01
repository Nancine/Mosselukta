Hardware setup
==============

While powered off, connect a button to GPIO 3 and ground. See attached image GPIO.png.


How to install
==============

Ensure that you've installed node and npm:

sudo apt install nodejs npm

And check that it's installed:

node --version
npm --version

Install the necessary packages:

npm install express onoff socket.io


Start the server
================

node server.js


Run the animation
=================

Open your browser on the Pi to http://localhost:3000
(Or if networked, open http://pi_address:3000)

