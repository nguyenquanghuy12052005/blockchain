import React, { useState } from 'react';
import { useDonationsByCampaign } from '../hooks/useDonations';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { toast } from '../ui/toastStore';
import { usePublicClient } from 'wagmi';

const DonationHistory = ({ campaignId, refreshKey = 0 }) => {
  const { donations, loading } = useDonationsByCampaign(campaignId, refreshKey);
  const publicClient = usePublicClient();
  const [verifyStatus, setVerifyStatus] = useState({});

  const handleVerify = async (txHash) => {
    setVerifyStatus(prev => ({...prev, [txHash]: 'Đang kiểm tra...'}));
    try {
      const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
      if (receipt && receipt.status === 'success') {
        setVerifyStatus(prev => ({...prev, [txHash]: `Giao dịch Thật 100% (Block: ${receipt.blockNumber})`}));
      } else {
        setVerifyStatus(prev => ({...prev, [txHash]: 'Giao dịch chưa hoàn tất hoặc bị lỗi'}));
      }
    } catch (e) {
      setVerifyStatus(prev => ({...prev, [txHash]: 'Không tìm thấy dữ liệu on-chain (Có thể là dữ liệu ảo)'}));
    }
  };

  if (loading) return (
    <div className="mt-4 text-slate-500 text-sm text-center">Đang tải lịch sử...</div>
  );

  if (donations.length === 0) return (
    <div className="mt-4 text-slate-500 text-sm text-center">Chưa có ai quyên góp.</div>
  );

  return (
    <div className="mt-2">
      <div className="flex items-end justify-between gap-4">
        <h3 className="font-black text-base text-slate-900">
        Lịch sử quyên góp
          <span className="ml-2 text-xs font-semibold text-slate-500">
            ({donations.length} người)
          </span>
        </h3>
      </div>

      <ul className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
        {donations.map((don) => (
          <li
            key={don._id}
            className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-lg"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-bold text-slate-900">
                    {don.displayName && don.displayName !== 'Ẩn danh'
                      ? don.displayName
                      : don.displayName === 'Ẩn danh'
                        ? 'Ẩn danh'
                        : `${don.donor.slice(0, 6)}...${don.donor.slice(-4)}`}
                  </div>
                  <Badge tone={don.status === 'pending' ? 'pending' : 'confirmed'}>
                    {don.status === 'pending' ? 'Đang xác nhận' : 'Đã xác nhận'}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {new Date(don.timestamp * 1000).toLocaleString('vi-VN')}
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-blue-700">{don.amountEth} ETH</div>
                <div className="mt-1 flex flex-wrap justify-end gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleVerify(don.transactionHash)}
                  >
                    Check On-chain
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(don.transactionHash);
                        toast.success('Đã copy txHash');
                      } catch {
                        toast.error('Không thể copy txHash');
                      }
                    }}
                  >
                    Copy tx
                  </Button>
                </div>
              </div>
            </div>

            {/* Dòng 2: Lời nhắn */}
            {don.message && (
              <p className="mt-2 text-slate-600 italic">"{don.message}"</p>
            )}

            {/* Dòng 3: Kết quả verify */}
            {verifyStatus[don.transactionHash] && (
              <div className={`mt-3 p-2 rounded text-xs font-bold ${verifyStatus[don.transactionHash].includes('Thật 100%') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                🔍 Kết quả Check: {verifyStatus[don.transactionHash]}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationHistory;