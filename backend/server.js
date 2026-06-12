const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const projectRoutes = require('./routes/projects');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Ubwubatsi Hub API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});