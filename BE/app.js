require('dotenv').config();
const express = require('express');
const cors = require('cors');
const donationRoutes = require('./routes/donationRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', donationRoutes);
app.use('/api', withdrawalRoutes);

// Health check
app.get('/health', (req, res) => res.send('OK'));

module.exports = app;