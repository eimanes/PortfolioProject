import { io } from '../services/socket.service.js';

export const socketController = {
    handleMessage: (req, res) => {
      // Get the message from the request body
      const message = req.body.message;

      // Log the message
      console.log(`Received message: ${message}`);

      // Send a response back to the client
      res.status(200).json({ message: 'Received message!' });

      // Emit the message to all connected clients
      io.emit('message', message);
    }
  };