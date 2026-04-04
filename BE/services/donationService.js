const Donation = require('../models/Donation');
const { ethers } = require('ethers');

const createOrUpdateDonation = async (donationData) => {
  const { transactionHash, campaignId, donor, amount, timestamp, message } = donationData;
  let donation = await Donation.findOne({ transactionHash });
  if (donation) {
    donation.message = message || donation.message;
    if (donor) donation.donor = donor;
    if (amount) {
      donation.amount = amount;
      donation.amountEth = parseFloat(ethers.utils.formatEther(amount));
    }
    if (timestamp) donation.timestamp = timestamp;
    if (campaignId !== undefined) donation.campaignId = campaignId;
    await donation.save();
    return donation;
  } else {
    const newDonation = new Donation({
      transactionHash,
      campaignId,
      donor: donor || '',
      amount: amount || '0',
      amountEth: amount ? parseFloat(ethers.utils.formatEther(amount)) : 0,
      timestamp: timestamp || Date.now(),
      message: message || '',
      status: 'pending',
    });
    await newDonation.save();
    return newDonation;
  }
};

const confirmDonationFromEvent = async (transactionHash, campaignId, donor, amount, timestamp) => {
  const donation = await Donation.findOne({ transactionHash });
  if (donation) {
    donation.status = 'confirmed';
    donation.donor = donor;
    donation.amount = amount.toString();
    donation.amountEth = parseFloat(ethers.utils.formatEther(amount));
    donation.timestamp = timestamp;
    donation.campaignId = campaignId;
    await donation.save();
    return donation;
  } else {
    // Tạo mới với status confirmed (không có message)
    const newDonation = new Donation({
      transactionHash,
      campaignId,
      donor,
      amount: amount.toString(),
      amountEth: parseFloat(ethers.utils.formatEther(amount)),
      timestamp,
      message: '',
      status: 'confirmed',
    });
    await newDonation.save();
    return newDonation;
  }
};

const getDonationsByCampaign = async (campaignId) => {
  return await Donation.find({ campaignId, status: 'confirmed' }).sort({ timestamp: -1 });
};

const getAllDonations = async () => {
  return await Donation.find().sort({ timestamp: -1 });
};

module.exports = {
  createOrUpdateDonation,
  confirmDonationFromEvent,
  getDonationsByCampaign,
  getAllDonations,
};