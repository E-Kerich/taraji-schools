const mongoose = require('mongoose');
const User = require('../models/User.model');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const exists = await User.findOne({ role: 'super_admin' });

    if (exists) {
      console.log('❌ Super admin already exists');
      process.exit();
    }

    const superAdmin = await User.create({
      name: 'Super Admin',
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
      role: 'super_admin'
    });

    console.log('✅ Super admin created:', superAdmin.email);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createSuperAdmin();
