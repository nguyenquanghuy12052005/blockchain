import React from 'react';
import { useDonationsByCampaign } from '../hooks/useDonations';

const DonationHistory = ({ campaignId, refreshKey = 0 }) => {
  const { donations, loading } = useDonationsByCampaign(campaignId, refreshKey);

  if (loading) return (
    <div className="mt-4 text-gray-400 text-sm text-center">Đang tải lịch sử...</div>
  );

  if (donations.length === 0) return (
    <div className="mt-4 text-gray-400 text-sm text-center">Chưa có ai quyên góp.</div>
  );

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-semibold text-base mb-3">
        Lịch sử quyên góp
        <span className="ml-2 text-xs font-normal text-gray-400">
          ({donations.length} người)
        </span>
      </h3>

      <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {donations.map((don) => (
          <li key={don._id} className="bg-gray-50 rounded-lg p-3 text-sm">
            {don.status === 'pending' && (
              <div className="text-[10px] uppercase tracking-wide text-amber-600 font-semibold mb-1">
                Đang xác nhận on-chain
              </div>
            )}

            {/* Dòng 1: Tên + số tiền */}
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">
                {/* Ưu tiên displayName, fallback về địa chỉ ví rút gọn */}
                {don.displayName && don.displayName !== 'Ẩn danh'
                  ? don.displayName
                  : don.displayName === 'Ẩn danh'
                    ? '🙈 Ẩn danh'
                    : `${don.donor.slice(0,6)}...${don.donor.slice(-4)}`
                }
              </span>
              <span className="font-bold text-blue-600">
                {don.amountEth} ETH
              </span>
            </div>

            {/* Dòng 2: Lời nhắn */}
            {don.message && (
              <p className="text-gray-600 mt-1 italic">"{don.message}"</p>
            )}

            {/* Dòng 3: Thời gian + link verify */}
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-400">
                {new Date(don.timestamp * 1000).toLocaleString('vi-VN')}
              </span>
              <a
                href={`#tx-${don.transactionHash}`}
                title={don.transactionHash}
                className="text-xs text-blue-400 hover:underline font-mono"
              >
                {don.transactionHash.slice(0,8)}...
              </a>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationHistory;