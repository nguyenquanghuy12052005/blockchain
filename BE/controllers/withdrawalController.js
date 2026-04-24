const withdrawalService = require('../services/withdrawalService');

// ── POST /api/withdraw ──────────────────────────────────────────
// FE gọi sau khi withdraw thành công để gửi thông tin
const addWithdrawal = async (req, res) => {
  try {
    const {
      transactionHash,
      campaignId,
      withdrawer,
      amount,
      timestamp,
      message,
      displayName,
    } = req.body;

    const ts = Number(timestamp);
    const missing = [];
    if (!transactionHash) missing.push('transactionHash');
    if (campaignId === undefined || campaignId === null || campaignId === '') missing.push('campaignId');
    if (!withdrawer || typeof withdrawer !== 'string') missing.push('withdrawer');
    if (amount === undefined || amount === null || amount === '') missing.push('amount');
    if (!Number.isFinite(ts)) missing.push('timestamp');
    if (missing.length) {
      return res.status(400).json({
        error: `Thiếu hoặc sai định dạng: ${missing.join(', ')}`,
      });
    }

    const withdrawal = await withdrawalService.createOrUpdateWithdrawal({
      transactionHash: String(transactionHash).trim(),
      campaignId,
      withdrawer: String(withdrawer).trim(),
      amount,
      timestamp: ts,
      message,
      displayName,
    });

    res.status(201).json({ success: true, withdrawal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ── GET /api/campaigns/:campaignId/withdrawals ──────────────────
const getCampaignWithdrawals = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const withdrawals = await withdrawalService.getWithdrawalsByCampaign(campaignId);
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ── GET /api/withdrawals ────────────────────────────────────────
const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await withdrawalService.getAllWithdrawals();
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addWithdrawal, getCampaignWithdrawals, getAllWithdrawals };