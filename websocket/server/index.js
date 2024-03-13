const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); // Import body-parser
const middleware = require('./middleware/auth');
require('dotenv').config();
const wsController = require('./controller/ws.controller');
const cors = require('cors');

const app = express();

const route = express.Router();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
const secretKey = process.env.SECRET_KEY; // Replace with a strong secret key in production

// HTTP request authentication with JWT
app.put("/login", middleware.login);

// WebSocket connection handler using the controller
wss.on('connection', (ws, req) => {
  wsController.handleWebSocketConnection(ws, req, secretKey); // Replace with your actual secret key
});


const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
