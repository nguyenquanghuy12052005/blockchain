const donationService = require('../services/donationService');

// ── POST /api/donate ──────────────────────────────────────────
// FE gọi sau khi donate thành công để gửi lời nhắn + tên hiển thị
const addDonationMessage = async (req, res) => {
  try {
    const {
      transactionHash,
      campaignId,
      donor,
      amount,
      timestamp,
      message,
      displayName,  // ← tên người gửi (tùy chọn, FE gửi lên)
    } = req.body;

    const ts = Number(timestamp);
    const missing = [];
    if (!transactionHash) missing.push('transactionHash');
    if (campaignId === undefined || campaignId === null || campaignId === '') missing.push('campaignId');
    if (!donor || typeof donor !== 'string') missing.push('donor');
    if (amount === undefined || amount === null || amount === '') missing.push('amount');
    if (!Number.isFinite(ts)) missing.push('timestamp');
    if (missing.length) {
      return res.status(400).json({
        error: `Thiếu hoặc sai định dạng: ${missing.join(', ')}`,
      });
    }

    const donation = await donationService.createOrUpdateDonation({
      transactionHash: String(transactionHash).trim(),
      campaignId,
      donor: String(donor).trim(),
      amount,
      timestamp: ts,
      message,
      displayName,
    });

    res.status(201).json({ success: true, donation });
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