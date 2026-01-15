// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const blogRoutes = require('./routes/blog.routes');
const announcementRoutes = require('./routes/announcement.routes');
const contactRoutes = require('./routes/contact.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const emailRoutes = require('./routes/email.routes');
const paymentRoutes = require('./routes/payment.routes');
const pageRoutes = require('./routes/page.routes');
const uploadRoutes = require('./routes/upload.routes');
const campusUpdateRoutes = require('./routes/campusUpdate.routes');
const dashboardRoutes = require('./routes/dashboard.routes');




const app = express();

const connectDB = require('./config/db');

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/campus-updates', campusUpdateRoutes);
app.use('/api/dashboard', dashboardRoutes);

module.exports = app;
