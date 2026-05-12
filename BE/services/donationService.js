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
  const update = {};
  if (message != null) update.message = message;
  if (displayName != null) update.displayName = displayName;
  if (donor) update.donor = donor;
  if (campaignId !== undefined && campaignId !== null && campaignId !== '') {
    const cid = Number(campaignId);
    if (!Number.isNaN(cid)) update.campaignId = cid;
  }
  if (amount != null && amount !== '') {
    const amt = typeof amount === 'string' ? amount : amount.toString();
    update.amount = amt;
    update.amountEth = parseFloat(ethers.utils.formatEther(amt));
  }
  if (timestamp != null) {
    const ts = Number(timestamp);
    if (Number.isFinite(ts)) update.timestamp = ts;
  }

const donation = await Donation.findOneAndUpdate(
  { transactionHash },
  { $set: update },
  {
    upsert: true,
    returnDocument: 'after',
  },
);
  return donation;
};

const confirmDonationFromEvent = async (transactionHash, campaignId, donor, amount, timestamp) => {
  const txNorm = String(transactionHash).trim().toLowerCase();
  const cid = Number(campaignId.toString());
  const ts = Number(timestamp.toString());
  const amt = amount.toString();
  return Donation.findOneAndUpdate(
    { transactionHash: txNorm },
    {
      $set: {
        status: 'confirmed',
        donor,
        amount: amt,
        amountEth: parseFloat(ethers.utils.formatEther(amt)),
        timestamp: ts,
        campaignId: cid,
      },
      $setOnInsert: {
        message: '',
        displayName: '',
      },
    },
   {
  upsert: true,
  returnDocument: 'after',
},
  );
};

const getDonationsByCampaign = async (campaignId) => {
  const id = Number(campaignId);
  if (Number.isNaN(id)) return [];
  return await Donation.find({
    campaignId: id,
    status: 'confirmed',
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