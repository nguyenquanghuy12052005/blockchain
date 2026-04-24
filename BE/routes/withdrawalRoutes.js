const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');

router.post('/withdraw', withdrawalController.addWithdrawal);
router.get('/campaigns/:campaignId/withdrawals', withdrawalController.getCampaignWithdrawals);
router.get('/withdrawals', withdrawalController.getAllWithdrawals);

module.exports = router;