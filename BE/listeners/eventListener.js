require('dotenv').config();
const ethers = require('ethers');
const mongoose = require('mongoose');
const { contract } = require('../config/blockchain');
const connectDB = require('../config/db'); // Import lại connectDB
const donationService = require('../services/donationService');
const withdrawalService = require('../services/withdrawalService');
const campaignService = require('../services/campaignService');

function txHashFromEvent(event) {
  if (!event) return undefined;
  if (event.transactionHash) return event.transactionHash;
  if (event.log && event.log.transactionHash) return event.log.transactionHash;
  return undefined;
}

async function startListener() {
  // Nếu chưa kết nối DB (trường hợp chạy npm run listener riêng) thì mới gọi connectDB
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  console.log('✅ Event listener started — đang lắng nghe blockchain...');

  contract.on('CampaignCreated', async (id, name, goal, owner, event) => {
    const txHash = txHashFromEvent(event);
    console.log('\n📋 Campaign mới (on-chain)');
    console.log(`   id: ${id.toString()} | ${name}`);
    if (!txHash) {
      console.error('   ❌ Không đọc được transactionHash từ event');
      return;
    }
    try {
      await campaignService.upsertFromCampaignCreatedEvent(id, name, goal, owner, txHash);
      console.log('   ✅ Đã lưu quỹ vào MongoDB');
    } catch (error) {
      console.error('   ❌ Lỗi lưu Campaign MongoDB:', error.message);
    }
  });

  contract.on('Donated', async (campaignId, donor, amount, timestamp, event) => {
    const txHash = txHashFromEvent(event);

    console.log('\n💰 Donation mới!');
    console.log(`   txHash:     ${txHash}`);
    console.log(`   campaignId: ${campaignId.toString()}`);
    console.log(`   donor:      ${donor}`);
    console.log(`   amount:     ${ethers.utils.formatEther(amount)} ETH`);

    if (!txHash) {
      console.error('   ❌ Không đọc được transactionHash từ event');
      return;
    }

    try {
      await donationService.confirmDonationFromEvent(
        txHash,
        campaignId,
        donor,
        amount,
        timestamp,
      );
      const cid =
        typeof campaignId.toNumber === 'function'
          ? campaignId.toNumber()
          : Number(campaignId);
      try {
        await campaignService.upsertFromChain(cid);
      } catch {
        /* quỹ có thể chưa có trong Mongo — bỏ qua */
      }
      console.log('   ✅ Đã lưu / cập nhật MongoDB');
    } catch (error) {
      console.error('   ❌ Lỗi lưu MongoDB:', error.message);
    }
  });

  contract.on('Withdrawn', async (campaignId, recipient, amount, event) => {
    const txHash = txHashFromEvent(event);

    console.log('\n💸 Withdrawal mới!');
    console.log(`   txHash:     ${txHash}`);
    console.log(`   campaignId: ${campaignId.toString()}`);
    console.log(`   recipient:  ${recipient}`);
    console.log(`   amount:     ${ethers.utils.formatEther(amount)} ETH`);

    if (!txHash) {
      console.error('   ❌ Không đọc được transactionHash từ event');
      return;
    }

    try {
      await withdrawalService.confirmWithdrawalFromEvent(
        txHash,
        campaignId,
        recipient,
        amount,
        Math.floor(Date.now() / 1000),
      );
      const cid =
        typeof campaignId.toNumber === 'function'
          ? campaignId.toNumber()
          : Number(campaignId);
      try {
        await campaignService.upsertFromChain(cid);
      } catch {
        /* quỹ có thể chưa có trong Mongo — bỏ qua */
      }
      console.log('   ✅ Đã lưu / cập nhật Withdrawals MongoDB');
    } catch (error) {
      console.error('   ❌ Lỗi lưu Withdrawals MongoDB:', error.message);
    }
  });
}

startListener().catch(console.error);
