require('dotenv').config();
const { contract } = require('../config/blockchain');
const connectDB    = require('../config/db');
const donationService = require('../services/donationService');

async function startListener() {
  await connectDB();
  console.log('✅ Event listener started — đang lắng nghe blockchain...');

  // Lắng nghe event "Donated" từ MultiCampaignFund.sol
  // Mỗi khi ai donate thành công → contract emit event này
  // → listener bắt được → lưu/update vào MongoDB
  contract.on('Donated', async (campaignId, donor, amount, timestamp, event) => {
    const txHash = event.log.transactionHash;
    // ↑ ethers v6: transactionHash nằm trong event.log, không phải event.transactionHash

    console.log(`\n💰 Donation mới!`);
    console.log(`   txHash:     ${txHash}`);
    console.log(`   campaignId: ${campaignId}`);
    console.log(`   donor:      ${donor}`);
    console.log(`   amount:     ${ethers.formatEther(amount)} ETH`);

    try {
      await donationService.confirmDonationFromEvent(
        txHash,
        campaignId,
        donor,
        amount,
        timestamp,
      );
      console.log(`   ✅ Đã lưu vào MongoDB`);
    } catch (error) {
      console.error('   ❌ Lỗi lưu MongoDB:', error.message);
    }
  });
}

const { ethers } = require('ethers');
startListener().catch(console.error);