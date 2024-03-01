import { Server } from 'socket.io';

const io = new Server();

io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for messages from clients
  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  // Send a message to the client
  socket.emit('message', 'Hello from the server!');

  // Disconnect the client
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

export { io };