const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/donate', donationController.addDonationMessage);
router.get('/campaigns/:campaignId/donations', donationController.getCampaignDonations);
router.get('/donations', donationController.getAllDonations);

module.exports = router;