require('dotenv').config();
const { contract } = require('../config/blockchain');
const connectDB = require('../config/db');
const donationService = require('../services/donationService');

async function startListener() {
  await connectDB();
  console.log('Event listener started. Waiting for Donated events...');

  contract.on('Donated', async (campaignId, donor, amount, timestamp, event) => {
    const txHash = event.transactionHash;
    console.log(`New Donation: tx=${txHash}, campaign=${campaignId}, donor=${donor}, amount=${amount.toString()}`);

    try {
      await donationService.confirmDonationFromEvent(
        txHash,
        campaignId,
        donor,
        amount,
        timestamp
      );
      console.log(`Donation ${txHash} confirmed in DB`);
    } catch (error) {
      console.error('Error processing event:', error);
    }
  });
}

startListener().catch(console.error);