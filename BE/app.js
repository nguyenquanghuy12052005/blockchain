require('dotenv').config();
const express = require('express');
const cors = require('cors');
const donationRoutes = require('./routes/donationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', donationRoutes);

// Health check
app.get('/health', (req, res) => res.send('OK'));

module.exports = app;