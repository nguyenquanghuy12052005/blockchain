const { provider } = require('../config/blockchain');
const Donation = require('../models/Donation');
const ethers = require('ethers');

const verifyTransaction = async (req, res) => {
  const { txHash } = req.params;
  const txNorm = String(txHash).trim().toLowerCase();

  if (!txNorm || !txNorm.startsWith('0x') || txNorm.length !== 66) {
    return res.status(400).json({ error: 'txHash không hợp lệ' });
  }

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
        from: receipt.from?.toLowerCase() ?? null,
        to: receipt.to?.toLowerCase() ?? null,
        gasUsed: receipt.gasUsed?.toString(),
        timestamp: block?.timestamp ?? null,
        // Lưu raw ETH string để parse dễ hơn
        valueEth: tx?.value
          ? ethers.utils.formatEther(tx.value)
          : '0',
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
        donor: doc.donor?.toLowerCase() ?? null,
        displayName: doc.displayName || '',
        amountEth: doc.amountEth,
        message: doc.message || '',
        timestamp: doc.timestamp,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };
    })(),
  ]);

  const chain =
    chainResult.status === 'fulfilled'
      ? chainResult.value
      : { found: false, error: chainResult.reason?.message };

  const db =
    dbResult.status === 'fulfilled'
      ? dbResult.value
      : { found: false, error: dbResult.reason?.message };

  // ── So sánh dữ liệu khi cả hai đều tìm thấy ──────────────────────
  let amountMatch = null;
  let donorMatch  = null;
  let mismatchReasons = [];

  if (chain.found && db.found) {
    const chainAmount = parseFloat(chain.valueEth);
    const dbAmount    = parseFloat(db.amountEth);

    // Dùng epsilon để tránh lỗi floating-point (e.g. 0.1 + 0.2 ≠ 0.3)
    const EPSILON = 1e-9;
    amountMatch = Math.abs(chainAmount - dbAmount) < EPSILON;

    donorMatch =
      !!chain.from &&
      !!db.donor &&
      chain.from === db.donor; // cả hai đã lowercase từ trước

    if (!amountMatch) {
      mismatchReasons.push(
        `amount mismatch: chain=${chainAmount} ETH, db=${dbAmount} ETH`
      );
    }
    if (!donorMatch) {
      mismatchReasons.push(
        `donor mismatch: chain.from=${chain.from}, db.donor=${db.donor}`
      );
    }
  }

  // ── Tổng hợp kết luận (thứ tự từ cụ thể → chung) ─────────────────
  let verdict;

  if (!chain.found && !db.found) {
    verdict = 'not_found';          // ❌ Không tồn tại ở đâu

  } else if (chain.found && chain.status === 'failed') {
    verdict = 'chain_failed';       // ❌ Giao dịch thất bại on-chain

  } else if (!chain.found && db.found) {
    verdict = 'db_only';            // ⚠️ DB có nhưng không thấy on-chain

  } else if (chain.found && chain.status === 'success' && !db.found) {
    verdict = 'chain_only';         // ⚠️ On-chain OK nhưng DB chưa sync

  } else if (chain.found && chain.status === 'success' && db.found) {
    if (db.status === 'pending') {
      verdict = 'pending_confirm';  // 🕐 On-chain OK, DB chưa confirm
    } else if (db.status === 'confirmed') {
      if (!amountMatch || !donorMatch) {
        verdict = 'data_mismatch';  // 🚨 Tồn tại nhưng dữ liệu không khớp
      } else {
        verdict = 'authentic';      // ✅ Hợp lệ hoàn toàn
      }
    } else {
      // Các status khác: 'failed', 'refunded', v.v.
      verdict = `db_status_${db.status}`;
    }
  } else {
    verdict = 'unknown';
  }

  return res.json({
    txHash: txNorm,
    verdict,
    ...(mismatchReasons.length > 0 && { mismatchReasons }),
    chain: {
      ...chain,
      // Trả về field hiển thị cho FE
      value: chain.found ? `${chain.valueEth} ETH` : undefined,
    },
    db,
  });
};

module.exports = { verifyTransaction };