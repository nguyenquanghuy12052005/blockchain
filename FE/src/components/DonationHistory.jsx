import React, { useState } from 'react';
import { useDonationsByCampaign } from '../hooks/useDonations';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { toast } from '../ui/toastStore';
import { verifyTransaction } from '../services/api';

// ── Cấu hình verdict ─────────────────────────────────────────────────────
const VERDICT_CONFIG = {
  authentic: {
    label: '✅ Xác thực hoàn toàn',
    desc: 'Giao dịch tồn tại trên blockchain VÀ đã được lưu vào database.',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  pending_confirm: {
    label: '🕐 Đang chờ xác nhận',
    desc: 'On-chain thành công nhưng database chưa cập nhật trạng thái confirmed.',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-700',
  },
  chain_only: {
    label: '⚠️ Chỉ có trên blockchain',
    desc: 'Giao dịch hợp lệ trên Ganache nhưng chưa được đồng bộ vào database.',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  db_only: {
    label: '⚠️ Chỉ có trong database',
    desc: 'Tìm thấy trong database nhưng KHÔNG tìm thấy giao dịch trên blockchain.',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-800',
    badge: 'bg-orange-100 text-orange-700',
  },
  chain_failed: {
    label: '❌ Giao dịch thất bại',
    desc: 'Giao dịch tồn tại trên blockchain nhưng đã bị revert / thất bại.',
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-700',
  },
  not_found: {
    label: '❌ Không tìm thấy',
    desc: 'Không tìm thấy giao dịch này ở đâu cả — có thể là dữ liệu giả.',
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-700',
  },
  unknown: {
    label: '❓ Không xác định',
    desc: 'Thông tin giao dịch có sự sai lệch.',
    bg: 'bg-red-50',
    border: 'border-slate-300',
    text: 'text-slate-700',
    badge: 'bg-slate-100 text-slate-600',
  },
};

// ── Row hiển thị 1 field thông tin ────────────────────────────────────────
const InfoRow = ({ label, value, mono = false }) =>
  value != null && value !== '' ? (
    <div className="flex gap-2 text-xs leading-5">
      <span className="w-28 shrink-0 font-semibold text-slate-500">{label}</span>
      <span className={`break-all text-slate-800 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  ) : null;

// ── Panel kết quả verify ──────────────────────────────────────────────────
const VerifyPanel = ({ result }) => {
  const cfg = VERDICT_CONFIG[result.verdict] ?? VERDICT_CONFIG.unknown;
  const { chain, db } = result;

  const fmtTime = (ts) =>
    ts ? new Date(ts * 1000).toLocaleString('vi-VN') : null;
  const shortAddr = (a) => (a ? `${a.slice(0, 8)}...${a.slice(-6)}` : null);

  return (
    <div className={`mt-3 rounded-2xl border ${cfg.border} ${cfg.bg} p-3 text-xs`}>
      {/* Verdict header */}
      <div className={`flex items-center gap-2 font-black text-sm ${cfg.text}`}>
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>
      <p className={`mt-1 text-xs ${cfg.text} opacity-80`}>{cfg.desc}</p>

      {/* 2 cột: On-chain | Database */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* ── Cột On-chain ── */}
        <div className="rounded-xl border border-slate-200 bg-white/70 p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-1.5 font-bold text-slate-700">
            <span className="text-base">⛓️</span> Ganache On-chain
            <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              chain.found && chain.status === 'success'
                ? 'bg-emerald-100 text-emerald-700'
                : chain.found
                ? 'bg-red-100 text-red-700'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {chain.found ? (chain.status === 'success' ? 'SUCCESS' : 'FAILED') : 'NOT FOUND'}
            </span>
          </div>
          {chain.found ? (
            <div className="space-y-1">
              <InfoRow label="Block"       value={chain.blockNumber} />
              <InfoRow label="Thời gian"   value={fmtTime(chain.timestamp)} />
              <InfoRow label="From"        value={shortAddr(chain.from)} mono />
              <InfoRow label="To"          value={shortAddr(chain.to)} mono />
              <InfoRow label="Giá trị"     value={chain.value} />
              <InfoRow label="Gas dùng"    value={chain.gasUsed} />
            </div>
          ) : (
            <p className="text-slate-400 italic">
              {chain.error ? `Lỗi: ${chain.error}` : 'Không tìm thấy giao dịch trên Ganache'}
            </p>
          )}
        </div>

        {/* ── Cột Database ── */}
        <div className="rounded-xl border border-slate-200 bg-white/70 p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-1.5 font-bold text-slate-700">
            <span className="text-base">🗄️</span> MongoDB Database
            <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              db.found && db.status === 'confirmed'
                ? 'bg-emerald-100 text-emerald-700'
                : db.found
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {db.found ? db.status?.toUpperCase() : 'NOT FOUND'}
            </span>
          </div>
          {db.found ? (
            <div className="space-y-1">
              <InfoRow label="Campaign ID" value={db.campaignId} />
              <InfoRow label="Người gửi"   value={db.displayName || 'Ẩn danh'} />
              <InfoRow label="Địa chỉ"     value={shortAddr(db.donor)} mono />
              <InfoRow label="Số tiền"     value={db.amountEth != null ? `${db.amountEth} ETH` : null} />
              <InfoRow label="Lời nhắn"    value={db.message} />
              <InfoRow label="Thời gian"   value={fmtTime(db.timestamp)} />
            </div>
          ) : (
            <p className="text-slate-400 italic">
              {db.error ? `Lỗi: ${db.error}` : 'Không tìm thấy trong database'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Component chính ───────────────────────────────────────────────────────
const DonationHistory = ({ campaignId, refreshKey = 0 }) => {
  const { donations, loading } = useDonationsByCampaign(campaignId, refreshKey);
  const [verifyState, setVerifyState] = useState({}); // { [txHash]: { loading, result, error } }

  const handleVerify = async (txHash) => {
    setVerifyState(prev => ({ ...prev, [txHash]: { loading: true } }));
    try {
      const result = await verifyTransaction(txHash);
      setVerifyState(prev => ({ ...prev, [txHash]: { loading: false, result } }));
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || 'Lỗi không xác định';
      setVerifyState(prev => ({ ...prev, [txHash]: { loading: false, error: msg } }));
      toast.error(`Verify thất bại: ${msg}`);
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

      <ul className="mt-3 space-y-3 max-h-[32rem] overflow-y-auto pr-1">
        {donations.map((don) => {
          const vs = verifyState[don.transactionHash];
          return (
            <li
              key={don._id}
              className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-lg"
            >
              {/* Hàng 1: Tên + Số tiền + nút */}
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
                      loading={vs?.loading}
                      onClick={() => handleVerify(don.transactionHash)}
                    >
                      {vs?.result ? 'Re-verify' : 'Check On-chain + DB'}
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

              {/* Hàng 2: Lời nhắn */}
              {don.message && (
                <p className="mt-2 text-slate-600 italic">"{don.message}"</p>
              )}

              {/* Hàng 3: Kết quả verify kép */}
              {vs?.loading && (
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
                  Đang kiểm tra on-chain và database...
                </div>
              )}
              {vs?.result && <VerifyPanel result={vs.result} />}
              {vs?.error && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                  ❌ Lỗi khi verify: {vs.error}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DonationHistory;