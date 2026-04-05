const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const campaignController = require('../controllers/campaignController');

// Phải khai báo trước route có param nếu trùng prefix (ở đây không trùng path tĩnh)
router.get('/campaigns', campaignController.listCampaigns);
router.post('/campaigns/sync-tx', campaignController.syncFromTx);

router.post('/donate', donationController.addDonationMessage);
router.get('/campaigns/:campaignId/donations', donationController.getCampaignDonations);
router.get('/donations', donationController.getAllDonations);

module.exports = router;