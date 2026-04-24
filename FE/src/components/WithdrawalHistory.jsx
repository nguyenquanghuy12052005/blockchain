import React, { useState } from 'react';
import { useWithdrawalsByCampaign } from '../hooks/useWithdrawals';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { toast } from '../ui/toastStore';

const WithdrawalHistory = ({ campaignId, refreshKey = 0 }) => {
  const [error, setError] = useState(null);
  const { withdrawals, loading } = useWithdrawalsByCampaign(campaignId, refreshKey, setError);

  if (!campaignId && campaignId !== 0) {
    return (
      <div className="mt-4 text-slate-500 text-sm text-center">
        Vui lòng chọn quỹ để xem lịch sử rút tiền.
      </div>
    );
  }

  if (loading) return (
    <div className="mt-4 text-slate-500 text-sm text-center">Đang tải lịch sử rút tiền...</div>
  );

  if (error) return (
    <div className="mt-4 text-red-500 text-sm text-center">Lỗi tải dữ liệu: {error}</div>
  );

  if (withdrawals.length === 0) return (
    <div className="mt-4 text-slate-500 text-sm text-center">Chưa có lần rút tiền nào.</div>
  );

  return (
    <div className="mt-2">
      <h3 className="font-black text-base text-slate-900">
        Lịch sử rút tiền
        <span className="ml-2 text-xs font-semibold text-slate-500">
          ({withdrawals.length} lần)
        </span>
      </h3>

      <ul className="mt-3 space-y-3 max-h-96 overflow-y-auto pr-1">
        {withdrawals.map((wd) => (
          <li
            key={wd._id}
            className="rounded-3xl border border-slate-200 bg-white/70 p-4 text-sm shadow-lg"
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold text-slate-900">
                      {wd.displayName && wd.displayName !== 'Ẩn danh'
                        ? wd.displayName
                        : wd.displayName === 'Ẩn danh'
                          ? 'Ẩn danh'
                          : `${wd.withdrawer.slice(0, 6)}...${wd.withdrawer.slice(-4)}`}
                    </div>
                    <Badge tone={wd.status === 'confirmed' ? 'confirmed' : 'pending'}>
                      {wd.status === 'confirmed' ? 'Đã xác nhận' : 'Đang chờ'}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 break-all">
                    Người rút: {wd.withdrawer}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-red-600">-{wd.amountEth} ETH</div>
                  <div className="mt-1 flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(wd.transactionHash);
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

              {wd.message && (
                <div className="text-slate-600 italic">"{wd.message}"</div>
              )}

              <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
                <div>
                  <div className="font-bold text-slate-700">Mã giao dịch</div>
                  <div className="font-mono break-all text-slate-700">
                    {wd.transactionHash}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-slate-700">Thời gian</div>
                  <div>{new Date(wd.timestamp * 1000).toLocaleString('vi-VN')}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-700">Quỹ</div>
                  <div>#{wd.campaignId}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-700">Tạo lúc</div>
                  <div>{new Date(wd.createdAt).toLocaleString('vi-VN')}</div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WithdrawalHistory;