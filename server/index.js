import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from './config/passport.config.js'
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import socketRoute from './routes/socket.route.js';


/*CONFIGURATION*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));



/*PASSPORT SESSION */
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

/*ROUTES */
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/socket', socketRoute(io));

/*MONGOOSE SETUP */
const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

/*SOCKET */
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