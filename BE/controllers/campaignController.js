const campaignService = require('../services/campaignService');

const listCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignService.listAll();
    res.json(campaigns);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
};

const syncFromTx = async (req, res) => {
  try {
    const { transactionHash } = req.body;
    if (!transactionHash) {
      return res.status(400).json({ error: 'Thiếu transactionHash' });
    }
    const doc = await campaignService.syncFromCreateTransactionHash(String(transactionHash).trim());
    res.status(201).json({ success: true, campaign: doc });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message || 'sync thất bại' });
  }
};

module.exports = { listCampaigns, syncFromTx };
