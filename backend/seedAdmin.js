const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      fullName: 'Ubwubatsi Admin',
      email: 'donlechero5@yahoo.com',
      phone: '0783419438',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    console.log('Admin created successfully');
    console.log('Email: donlechero5@yahoo.com');
    console.log('Password: Butch44');
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();