import React from 'react';
import { useDonationsByCampaign } from '../hooks/useDonations';

const DonationHistory = ({ campaignId }) => {
  const { donations, loading } = useDonationsByCampaign(campaignId);
  if (loading) return <div className="mt-4 text-gray-500">Đang tải lịch sử...</div>;
  if (donations.length === 0) return <div className="mt-4 text-gray-400">Chưa có quyên góp nào.</div>;
  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-semibold text-lg">Lịch sử quyên góp</h3>
      <ul className="mt-2 space-y-2 max-h-60 overflow-y-auto">
        {donations.map((don) => (
          <li key={don._id} className="bg-gray-50 p-2 rounded text-sm">
            <div><span className="font-medium">{don.donor.slice(0,6)}...{don.donor.slice(-4)}</span> đã quyên <strong>{don.amountEth} ETH</strong></div>
            <div className="text-gray-500 text-xs">{new Date(don.timestamp * 1000).toLocaleString()}</div>
            {don.message && <div className="italic text-gray-600">"{don.message}"</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationHistory;