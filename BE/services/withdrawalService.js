const Withdrawal = require('../models/Withdrawal');
const ethers = require('ethers');

const createOrUpdateWithdrawal = async (withdrawalData) => {
  const {
    transactionHash: rawHash,
    campaignId,
    withdrawer,
    amount,
    timestamp,
    message,
    displayName,
  } = withdrawalData;
  const transactionHash = String(rawHash).trim().toLowerCase();
  const cid = Number(campaignId);
  const ts = timestamp != null ? Number(timestamp) : Math.floor(Date.now() / 1000);

  let withdrawal = await Withdrawal.findOne({ transactionHash });
  if (withdrawal) {
    withdrawal.message = message != null ? message : withdrawal.message;
    if (withdrawer) withdrawal.withdrawer = withdrawer;
    if (displayName != null) withdrawal.displayName = displayName;
    if (amount) {
      withdrawal.amount = typeof amount === 'string' ? amount : amount.toString();
      withdrawal.amountEth = parseFloat(ethers.utils.formatEther(withdrawal.amount));
    }
    if (timestamp != null) withdrawal.timestamp = ts;
    if (campaignId !== undefined && !Number.isNaN(cid)) withdrawal.campaignId = cid;
    await withdrawal.save();
    return withdrawal;
  } else {
    const newWithdrawal = new Withdrawal({
      transactionHash,
      campaignId: cid,
      withdrawer: withdrawer || '',
      amount: typeof amount === 'string' ? amount : (amount || '0').toString(),
      amountEth: amount
        ? parseFloat(ethers.utils.formatEther(typeof amount === 'string' ? amount : amount.toString()))
        : 0,
      timestamp: ts,
      message: message || '',
      displayName: displayName || '',
      status: 'pending',
    });
    await newWithdrawal.save();
    return newWithdrawal;
  }
};

const confirmWithdrawalFromEvent = async (transactionHash, campaignId, withdrawer, amount, timestamp) => {
  const txNorm = String(transactionHash).trim().toLowerCase();
  const cid = Number(campaignId.toString());
  const ts = Number(timestamp.toString());
  const amt = amount.toString();
  return Withdrawal.findOneAndUpdate(
    { transactionHash: txNorm },
    {
      $set: {
        status: 'confirmed',
        withdrawer,
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
    { upsert: true, new: true },
  );
};

const getWithdrawalsByCampaign = async (campaignId) => {
  const id = Number(campaignId);
  if (Number.isNaN(id)) return [];
  return await Withdrawal.find({
    campaignId: id,
    status: 'confirmed',
  }).sort({ timestamp: -1 });
};

const getAllWithdrawals = async () => {
  return await Withdrawal.find().sort({ timestamp: -1 });
};

module.exports = {
  createOrUpdateWithdrawal,
  confirmWithdrawalFromEvent,
  getWithdrawalsByCampaign,
  getAllWithdrawals,
};