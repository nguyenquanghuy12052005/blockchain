const donationService = require('../services/donationService');

const addDonationMessage = async (req, res) => {
  try {
    const { transactionHash, campaignId, donor, amount, timestamp, message } = req.body;
    if (!transactionHash || campaignId === undefined || !donor || !amount || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields: transactionHash, campaignId, donor, amount, timestamp' });
    }
    const donation = await donationService.createOrUpdateDonation({
      transactionHash,
      campaignId,
      donor,
      amount,
      timestamp,
      message,
    });
    res.status(201).json({ success: true, donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getCampaignDonations = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const donations = await donationService.getDonationsByCampaign(parseInt(campaignId));
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllDonations = async (req, res) => {
  try {
    const donations = await donationService.getAllDonations();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addDonationMessage,
  getCampaignDonations,
  getAllDonations,
};