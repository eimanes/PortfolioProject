const axios = require('axios');
const WebSocket = require('ws');
require('dotenv').config();

let jwtToken = '';
let data = JSON.stringify({
  "username": "user",
  "password": "yourSecretKey"
});

let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: 'http://localhost:3050/login',
  headers: { 
    'Content-Type': 'application/json', 
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  jwtToken = response.data.token;
  connectws(jwtToken);
})
.catch((error) => {
  console.log(error);
});


const connectws = (jwtToken) => {

    const PORT = '3050';
    // WebSocket connection URL (replace with your actual WebSocket server URL)
    const wsUrl = `ws://localhost:${PORT}`;

    // Construct WebSocket headers with the JWT token
    const headers = {
        Authorization: `Bearer ${jwtToken}`,
    };
    // Establish WebSocket connection with headers
    const ws = new WebSocket(wsUrl, { headers });

    // WebSocket event handlers
    ws.on('open', () => {
    console.log('WebSocket connection opened: 1234555');
    
    // You can send messages, perform actions, etc. once the connection is open
    ws.send('Hello, WebSocket Server!');
    });

    ws.on('message', (message) => {
    console.log(`Received message from WebSocket server: ${message}`);
    });

    ws.on('close', (code, reason) => {
    console.log(`WebSocket connection closed: ${code} - ${reason}`);
    });

    ws.on('error', (error) => {
    console.error(`WebSocket error: ${error.message}`);
    });
}