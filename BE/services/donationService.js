const Donation = require('../models/Donation');
const ethers = require('ethers');

const createOrUpdateDonation = async (donationData) => {
  const {
    transactionHash: rawHash,
    campaignId,
    donor,
    amount,
    timestamp,
    message,
    displayName,
  } = donationData;
  const transactionHash = String(rawHash).trim().toLowerCase();
  const cid = Number(campaignId);
  const ts = timestamp != null ? Number(timestamp) : Math.floor(Date.now() / 1000);

  let donation = await Donation.findOne({ transactionHash });
  if (donation) {
    donation.message = message != null ? message : donation.message;
    if (donor) donation.donor = donor;
    if (displayName != null) donation.displayName = displayName;
    if (amount) {
      donation.amount = typeof amount === 'string' ? amount : amount.toString();
      donation.amountEth = parseFloat(ethers.utils.formatEther(donation.amount));
    }
    if (timestamp != null) donation.timestamp = ts;
    if (campaignId !== undefined && !Number.isNaN(cid)) donation.campaignId = cid;
    await donation.save();
    return donation;
  } else {
    const newDonation = new Donation({
      transactionHash,
      campaignId: cid,
      donor: donor || '',
      amount: typeof amount === 'string' ? amount : (amount || '0').toString(),
      amountEth: amount
        ? parseFloat(ethers.utils.formatEther(typeof amount === 'string' ? amount : amount.toString()))
        : 0,
      timestamp: ts,
      message: message || '',
      displayName: displayName || '',
      status: 'pending',
    });
    await newDonation.save();
    return newDonation;
  }
};

const confirmDonationFromEvent = async (transactionHash, campaignId, donor, amount, timestamp) => {
  const txNorm = String(transactionHash).trim().toLowerCase();
  const cid = Number(campaignId.toString());
  const ts = Number(timestamp.toString());
  const amt = amount.toString();

  const donation = await Donation.findOne({ transactionHash: txNorm });
  if (donation) {
    donation.status = 'confirmed';
    donation.donor = donor;
    donation.amount = amt;
    donation.amountEth = parseFloat(ethers.utils.formatEther(amt));
    donation.timestamp = ts;
    donation.campaignId = cid;
    await donation.save();
    return donation;
  } else {
    // Tạo mới với status confirmed (không có message)
    const newDonation = new Donation({
      transactionHash: txNorm,
      campaignId: cid,
      donor,
      amount: amt,
      amountEth: parseFloat(ethers.utils.formatEther(amt)),
      timestamp: ts,
      message: '',
      status: 'confirmed',
    });
    await newDonation.save();
    return newDonation;
  }
};

const getDonationsByCampaign = async (campaignId) => {
  const id = Number(campaignId);
  if (Number.isNaN(id)) return [];
  // Hiển thị cả pending (FE vừa POST) và confirmed (đã bắt event on-chain)
  return await Donation.find({
    campaignId: id,
    status: { $in: ['pending', 'confirmed'] },
  }).sort({ timestamp: -1 });
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