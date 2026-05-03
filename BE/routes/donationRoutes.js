const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const campaignController = require('../controllers/campaignController');
const { verifyTransaction } = require('../controllers/verifyController');

// Campaigns
router.get('/campaigns', campaignController.listCampaigns);
router.post('/campaigns/sync-tx', campaignController.syncFromTx);

// Donations
router.post('/donate', donationController.addDonationMessage);
router.get('/campaigns/:campaignId/donations', donationController.getCampaignDonations);
router.get('/donations', donationController.getAllDonations);

// ── Verify: kiểm tra giao dịch trên Ganache + MongoDB ─────────────────
router.get('/verify/:txHash', verifyTransaction);

module.exports = router;