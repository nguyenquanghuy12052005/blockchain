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

// Cập nhật imageUrl (dùng cho trường hợp nhập URL)
const updateCampaignImage = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { imageUrl } = req.body;
    if (!campaignId) {
      return res.status(400).json({ error: 'Thiếu campaignId' });
    }
    const updated = await campaignService.updateImageUrl(parseInt(campaignId), imageUrl);
    res.json({ success: true, campaign: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Cập nhật ảnh thất bại' });
  }
};

// Upload file ảnh
const uploadCampaignImage = async (req, res) => {
  try {
    const { campaignId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file ảnh' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const updated = await campaignService.updateImageUrl(parseInt(campaignId), imageUrl);
    res.json({ success: true, imageUrl, campaign: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Upload ảnh thất bại' });
  }
};

module.exports = { listCampaigns, syncFromTx, updateCampaignImage, uploadCampaignImage };