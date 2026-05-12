const ethers = require('ethers');
const Campaign = require('../models/Campaign');
const { provider, contract } = require('../config/blockchain');

const campaignCreatedIface = new ethers.utils.Interface([
  'event CampaignCreated(uint256 indexed id, string name, uint256 goal, address owner)',
]);

function toNum(x) {
  return typeof x.toNumber === 'function' ? x.toNumber() : Number(x);
}

async function upsertFromChain(onChainId, createTxHash = '') {
  const c = await contract.getCampaign(onChainId);
  const id = toNum(c.id);
  await Campaign.findOneAndUpdate(
    { onChainId: id },
    {
      onChainId: id,
      name: c.name,
      category: c.category || '',
      description: c.description || '',
      goalWei: c.goal.toString(),
      totalDonatedWei: c.totalDonated.toString(),
      active: c.active,
      owner: c.owner,
      ...(createTxHash ? { createTxHash } : {}),
    },
    { upsert: true, returnDocument: 'after' },
  );
}
/** Lưu / cập nhật từ event CampaignCreated (listener) */
async function upsertFromCampaignCreatedEvent(id, name, goal, owner, txHash) {
  const onChainId = toNum(id);
  await Campaign.findOneAndUpdate(
    { onChainId },
    {
      onChainId,
      name,
      goalWei: goal.toString(),
      owner,
      createTxHash: txHash || '',
      active: true,
    },
    { upsert: true, returnDocument: 'after' },
  );
  await upsertFromChain(onChainId, txHash || '');
}

/**
 * Đọc receipt giao dịch createCampaign, parse log CampaignCreated rồi đồng bộ full từ getCampaign.
 */
async function syncFromCreateTransactionHash(txHash) {
  if (!txHash || typeof txHash !== 'string') {
    throw new Error('transactionHash không hợp lệ');
  }
  const receipt = await provider.waitForTransaction(txHash);
  if (!receipt) {
    throw new Error('Không lấy được receipt');
  }
  const addr = (process.env.CONTRACT_ADDRESS || '').toLowerCase();
  let createdId = null;
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== addr) continue;
    try {
      const parsed = campaignCreatedIface.parseLog(log);
      if (parsed.name === 'CampaignCreated') {
        createdId = toNum(parsed.args.id);
        await upsertFromCampaignCreatedEvent(
          parsed.args.id,
          parsed.args.name,
          parsed.args.goal,
          parsed.args.owner,
          receipt.transactionHash,
        );
      }
    } catch {
      // không phải log CampaignCreated
    }
  }
  if (createdId == null) {
    throw new Error('Không tìm thấy event CampaignCreated trong giao dịch này');
  }
  return Campaign.findOne({ onChainId: createdId });
}

async function listAll() {
  return Campaign.find().sort({ onChainId: 1 }).lean();
}




async function updateImageUrl(onChainId, imageUrl) {
  if (!onChainId) throw new Error('Thiếu onChainId');
  const campaign = await Campaign.findOneAndUpdate(
    { onChainId },
    { imageUrl: imageUrl || '' },
    { new: true, runValidators: false }
  );
  if (!campaign) throw new Error('Không tìm thấy campaign');
  return campaign;
}
module.exports = {
  upsertFromChain,
  upsertFromCampaignCreatedEvent,
  syncFromCreateTransactionHash,
  listAll,
  updateImageUrl,
};
