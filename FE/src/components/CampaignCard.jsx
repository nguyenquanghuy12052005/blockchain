import React, { useState } from 'react';
import { formatEther } from 'viem';
import DonateModal from './DonateModal';
import DonationHistory from './DonationHistory';

const CampaignCard = ({ campaign, isAdmin, onWithdraw }) => {
  const [showDonate, setShowDonate] = useState(false);
  const [donationRefresh, setDonationRefresh] = useState(0);
  const goalEth = Number(formatEther(campaign.goal));
  const donatedEth = Number(formatEther(campaign.totalDonated));
  const percent = (donatedEth / goalEth) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold">{campaign.name}</h2>
      <p className="text-gray-600 mt-1">{campaign.description}</p>
      <div className="mt-4">
        <div className="flex justify-between text-sm">
          <span>Mục tiêu: {goalEth} ETH</span>
          <span>Đã quyên: {donatedEth} ETH</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(percent, 100)}%` }}></div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setShowDonate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Quyên góp
        </button>
        {isAdmin && onWithdraw && campaign.totalDonated > 0 && (
          <button
            onClick={() => onWithdraw(campaign.id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Rút tiền
          </button>
        )}
      </div>
      <DonateModal
        isOpen={showDonate}
        onClose={() => setShowDonate(false)}
        campaignId={campaign.id}
        onSuccess={() => setDonationRefresh((k) => k + 1)}
      />
      <DonationHistory campaignId={campaign.id} refreshKey={donationRefresh} />
    </div>
  );
};

export default CampaignCard;