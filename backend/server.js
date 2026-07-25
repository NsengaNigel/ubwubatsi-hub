const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const { setIO } = require('./utils/socketIo');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

setIO(io);

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, please try again later.' },
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const projectRoutes = require('./routes/projects');
const professionalRoutes = require('./routes/professionals');
const uploadRoutes = require('./routes/upload');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');
const expressionRoutes = require('./routes/expressions');
const notificationRoutes = require('./routes/notifications');
const ratingRoutes = require('./routes/ratings');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expressions', expressionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Ubwubatsi Hub API is running' });
});

io.on('connection', (socket) => {
  socket.on('join_user_room', (userId) => {
    socket.join(userId);
  });

  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('send_message', (data) => {
    io.to(data.conversationId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    socket.removeAllListeners();
    console.log('User disconnected and cleaned up');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} — started ${new Date().toISOString()}`);
});
