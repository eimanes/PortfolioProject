// wsController.js

const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const clients = new Set();

const handleWebSocketConnection = (ws, req, secretKey) => {
  // Extract JWT from the headers of the WebSocket handshake request
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : req.url.split('=')[1];;

  const rejectConnection = () => {
    console.log('Denied');
    ws.terminate();
  };

  if (!token) {
    // No token provided, reject WebSocket connection
    console.log('Token not provided');
    rejectConnection();
  } else {
    // Verify JWT token
    verifyToken(token, secretKey, (err, decoded) => {
      if (err) {
        // JWT verification failed, reject WebSocket connection
        rejectConnection();
      } else {
        // JWT verification succeeded, handle WebSocket connection
        handleAuthorizedConnection(ws, decoded);
      }
    });
  }
};

const verifyToken = (token, secretKey, callback) => {
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      // JWT verification failed
      callback(err, null);
    } else {
      // JWT verification succeeded
      callback(null, decoded);
    }
  });
};

const handleAuthorizedConnection = (ws, decoded) => {
  const { username, role } = decoded;
  clients.add(ws);

  // For simplicity, allow all authenticated users
  if (role === 'user') {
    console.log(`WebSocket connection authorized for user: ${username}`);

    // Set up idle timeout to close the connection after inactivity
    const idleTimeout = setTimeout(() => {
      ws.terminate(); // Close the connection
      console.log("Inactive");
    }, process.env.IDLE_TIMEOUT || 30000); // Default to 30 seconds

    // Ping interval to keep the connection alive
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
        const responseMessage = `Ping Client!`;
        ws.send(responseMessage);
      }
    }, process.env.PING_INTERVAL || 5000); // Default to 5 seconds

    // Handle WebSocket events for the authorized connection
    ws.on('message', (message) => {
      // Process WebSocket messages
      console.log(`Received WebSocket message from ${username}: ${message}`);
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          // Send a response back to the client
          const responseMessage = `${username}: ${message}`;
          client.send(responseMessage);
        }
      });
      
      

      // // Send a response back to the client
      // const responseMessage = ` ${message}`;
      // ws.send(responseMessage);
    });

    ws.on('close', () => {
      console.log(`WebSocket connection closed for user: ${username}`);
      clearInterval(pingInterval);
      clearTimeout(idleTimeout);
      // Clean up or handle disconnection
    });
  } else {
    // Role not authorized, reject WebSocket connection
    ws.terminate();
  }
};

module.exports = {
  handleWebSocketConnection,
};
