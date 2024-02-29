// wsController.js
const services = require('./../services/ws.services');

const handleWebSocketConnection = (ws, req, secretKey) => {
  // Extract JWT from the headers of the WebSocket handshake request
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : req.url.split('=')[1];

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
    services.verifyToken(token, secretKey, (err, decoded) => {
      if (err) {
        // JWT verification failed, reject WebSocket connection
        rejectConnection();
      } else {
        // JWT verification succeeded, handle WebSocket connection
          services.handleAuthorizedConnection(ws, decoded);
      }
    });
  }
};

module.exports = {
  handleWebSocketConnection,
};
