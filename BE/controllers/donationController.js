const donationService = require('../services/donationService');

// ── POST /api/donate ──────────────────────────────────────────
// Endpoint chỉ cập nhật metadata (message/displayName), không tạo bản ghi mới.
const addDonationMessage = async (req, res) => {
  try {
    const {
      transactionHash,
      message,
      displayName,  // ← tên người gửi (tùy chọn, FE gửi lên)
    } = req.body;

    const missing = [];
    if (!transactionHash) missing.push('transactionHash');
    if (missing.length) {
      return res.status(400).json({
        error: `Thiếu hoặc sai định dạng: ${missing.join(', ')}`,
      });
    }

    const donation = await donationService.createOrUpdateDonation({
      transactionHash: String(transactionHash).trim(),
      message,
      displayName,
    });
    if (!donation) {
      return res.status(202).json({
        success: true,
        accepted: true,
        message: 'Chưa có bản ghi confirmed trên chain, sẽ cập nhật khi listener bắt event.',
      });
    }
    res.status(200).json({ success: true, donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ── GET /api/campaigns/:campaignId/donations ──────────────────
const getCampaignDonations = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const donations = await donationService.getDonationsByCampaign(campaignId);
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ── GET /api/donations ────────────────────────────────────────
const getAllDonations = async (req, res) => {
  try {
    const donations = await donationService.getAllDonations();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addDonationMessage, getCampaignDonations, getAllDonations };