const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const url = require('url');
// const clients = new Set();
const rooms = new Map(); // Map to store clients for each room

const verifyToken = (token, secretKey, callback) => {
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
        // JWT verification failed
        callback(err, null);
        } else {
        console.log(`WebSocket connection authorized`);
        // JWT verification succeeded
        callback(null, decoded);
        }
    });
};

const handleAuthorizedConnection = (ws, decoded, wss) => {
    const { username, role, room } = decoded;
    // clients.add(ws);

    // For simplicity, allow all authenticated users
    if (role === 'user') {
        console.log(`WebSocket connection authorized for user: ${username} in room ${room}`);

        // Add the client to the room-specific set
        if (!rooms.has(room)) {
            rooms.set(room, new Set());
        }
        rooms.get(room).add(ws);

        // Set up idle timeout to close the connection after inactivity
        const idleTimeout = setTimeout(() => {
            ws.terminate(); // Close the connection
            console.log("Inactive");
        }, process.env.IDLE_TIMEOUT || 30000); // Default to 3 mins

        // Ping interval to keep the connection alive
        const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.ping();
                const responseMessage = `Ping Client!`;
                ws.send(responseMessage);
            }
        }, process.env.PING_INTERVAL || 5000); // Default to 30 seconds

        // Handle WebSocket events for the authorized connection
        ws.on('message', (message) => {
            // Process WebSocket messages
            console.log(`Received WebSocket message from room ${room} -> ${username}: ${message}`);

            // Send a response back to clients in the same room
            rooms.get(room).forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    const responseMessage = `${room} -> ${username}: ${message}`;
                    console.log(responseMessage);
                    client.send(responseMessage);
                }
            });
        });

        ws.on('close', () => {
            // Remove the client from the room-specific set when the connection is closed
            if (rooms.has(room)) {
                rooms.get(room).delete(ws);
                if (rooms.get(room).size === 0) {
                    rooms.delete(room);
                }
            }

            console.log(`WebSocket connection closed for user ${username} in room ${room}`);
            clearInterval(pingInterval);
            clearTimeout(idleTimeout);
            // Clean up or handle disconnection
        });
    } else {
        // Role not authorized, reject WebSocket connection
        ws.terminate();
        console.log(`WebSocket connection rejected for user ${username} with role ${role}`);
    }
};

module.exports = {
    verifyToken,
    handleAuthorizedConnection
};