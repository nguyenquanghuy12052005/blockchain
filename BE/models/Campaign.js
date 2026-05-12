const mongoose = require('mongoose');

/** Bản sao quỹ trên MongoDB — đồng bộ từ event CampaignCreated + getCampaign on-chain */
const CampaignSchema = new mongoose.Schema(
  {
    onChainId: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    goalWei: { type: String, required: true },
    totalDonatedWei: { type: String, default: '0' },
    active: { type: Boolean, default: true },
    owner: { type: String, default: '' },
    createTxHash: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('campaigns', CampaignSchema);
