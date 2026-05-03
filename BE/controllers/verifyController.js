const { provider } = require('../config/blockchain');
const Donation = require('../models/Donation');
const ethers = require('ethers');

/**
 * GET /api/verify/:txHash
 * Kiểm tra giao dịch đồng thời trên Ganache (on-chain) và MongoDB (database).
 * Trả về kết quả chi tiết để FE hiển thị "verify kép".
 */
const verifyTransaction = async (req, res) => {
  const { txHash } = req.params;
  const txNorm = String(txHash).trim().toLowerCase();

  if (!txNorm || !txNorm.startsWith('0x')) {
    return res.status(400).json({ error: 'txHash không hợp lệ' });
  }

  // Chạy song song 2 queries
  const [chainResult, dbResult] = await Promise.allSettled([
    // ── 1. Kiểm tra on-chain (Ganache) ──────────────────────────────
    (async () => {
      const receipt = await provider.getTransactionReceipt(txNorm);
      if (!receipt) return { found: false };

      const tx = await provider.getTransaction(txNorm);
      const block = await provider.getBlock(receipt.blockHash);

      return {
        found: true,
        status: receipt.status === 1 ? 'success' : 'failed',
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        from: receipt.from,
        to: receipt.to,
        gasUsed: receipt.gasUsed?.toString(),
        timestamp: block?.timestamp ?? null,
        value: tx?.value ? ethers.utils.formatEther(tx.value) + ' ETH' : '0 ETH',
        confirmations: receipt.confirmations ?? null,
      };
    })(),

    // ── 2. Kiểm tra trong MongoDB ─────────────────────────────────────
    (async () => {
      const doc = await Donation.findOne({ transactionHash: txNorm }).lean();
      if (!doc) return { found: false };

      return {
        found: true,
        status: doc.status,
        campaignId: doc.campaignId,
        donor: doc.donor,
        displayName: doc.displayName || '',
        amountEth: doc.amountEth,
        message: doc.message || '',
        timestamp: doc.timestamp,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };
    })(),
  ]);

  const chain = chainResult.status === 'fulfilled' ? chainResult.value : { found: false, error: chainResult.reason?.message };
  const db    = dbResult.status    === 'fulfilled' ? dbResult.value    : { found: false, error: dbResult.reason?.message };

  // Tổng hợp kết luận
  let verdict = 'unknown';
  if (chain.found && chain.status === 'success' && db.found && db.status === 'confirmed') {
    verdict = 'authentic';       // ✅ Hợp lệ hoàn toàn
  } else if (chain.found && chain.status === 'success' && !db.found) {
    verdict = 'chain_only';      // ⚠️ On-chain có nhưng DB chưa sync
  } else if (!chain.found && db.found) {
    verdict = 'db_only';         // ⚠️ DB có nhưng không tìm thấy on-chain
  } else if (chain.found && chain.status === 'failed') {
    verdict = 'chain_failed';    // ❌ Giao dịch thất bại on-chain
  } else if (!chain.found && !db.found) {
    verdict = 'not_found';       // ❌ Không tìm thấy ở đâu cả
  } else if (chain.found && chain.status === 'success' && db.found && db.status === 'pending') {
    verdict = 'pending_confirm'; // 🕐 On-chain OK nhưng DB chưa confirm
  }

  res.json({
    txHash: txNorm,
    verdict,
    chain,
    db,
  });
};

module.exports = { verifyTransaction };
