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

// wss.on('connection', (ws, req) => {
//   // Extract JWT from the headers of the WebSocket handshake request
//   const authHeader = req.headers.authorization;
//   const token = authHeader.split(" ")[1];
//   console.log(token);

//   // Verify JWT
//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       // JWT verification failed, reject WebSocket connection
//       console.log('Denied');
//       ws.terminate();
//     } else {
//       // JWT verification succeeded, authorize WebSocket connection
//       const { username, role } = decoded;

//       // For simplicity, allow all authenticated users
//       if (role === 'user') {
//         console.log(`WebSocket connection authorized for user: ${username}`);

//         // Set up idle timeout to close the connection after inactivity
//         const idleTimeout = setTimeout(() => {
//           ws.terminate(); // Close the connection
//           console.log("inactive");
//         }, process.env.IDLE_TIMEOUT);

//         // Ping interval to keep the connection alive
//         const pingInterval = setInterval(() => {
//           if (ws.readyState === WebSocket.OPEN) {
//             ws.ping();
//             console.log("pingged");
//           }
//         }, process.env.PING_INTERVAL);

//         // Handle WebSocket events for the authorized connection
//         ws.on('message', (message) => {
//           console.log(`Received WebSocket message from ${username}: ${message}`);
//           // Process WebSocket messages
//         });

//         ws.on('close', () => {
//           console.log(`WebSocket connection closed for user: ${username}`);
//           clearInterval(pingInterval);
//           clearTimeout(idleTimeout);
//           // Clean up or handle disconnection
//         });
//       } else {
//         // Role not authorized, reject WebSocket connection
//         ws.terminate();
//       }
//     }
//   });
// });

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
