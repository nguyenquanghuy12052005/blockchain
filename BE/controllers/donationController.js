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

    if (!transactionHash || campaignId === undefined || !donor || !amount || !timestamp) {
      return res.status(400).json({
        error: 'Thiếu thông tin bắt buộc: transactionHash, campaignId, donor, amount, timestamp',
      });
    }

    const donation = await donationService.createOrUpdateDonation({
      transactionHash,
      campaignId,
      donor,
      amount,
      timestamp,
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