import React, { useState } from 'react';
import axios from 'axios';
import { useDonate } from '../hooks/useContract';
import { useAccount, usePublicClient } from 'wagmi';
import { sendDonationMessage } from '../services/api';
import { parseEther } from 'viem';

const DonateModal = ({ isOpen, onClose, campaignId, onSuccess }) => {
  const [amount,      setAmount]      = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message,     setMessage]     = useState('');
  const [loading,     setLoading]     = useState(false);
  const { donate }                    = useDonate();
  const { address }                   = useAccount();
  const publicClient                  = usePublicClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    if (!address) {
      alert('Vui lòng kết nối ví trước khi quyên góp.');
      return;
    }
    if (!publicClient) {
      alert('Chưa sẵn sàng kết nối blockchain. Thử lại sau.');
      return;
    }
    setLoading(true);
    try {
      const txHash = await donate(campaignId, amount);
      const hash = typeof txHash === 'string' ? txHash : String(txHash);
      await publicClient.waitForTransactionReceipt({ hash });

      try {
        await sendDonationMessage({
          transactionHash: hash,
          campaignId: Number(campaignId),
          donor: address,
          amount: parseEther(String(amount)).toString(),
          timestamp: Math.floor(Date.now() / 1000),
          displayName: displayName.trim() || 'Ẩn danh',
          message: message.trim(),
        });
      } catch (apiErr) {
        const apiMsg =
          axios.isAxiosError(apiErr) && apiErr.response?.data?.error
            ? apiErr.response.data.error
            : apiErr?.message || 'Không rõ';
        alert(
          `Giao dịch blockchain đã thành công.\nNhưng không lưu được lời nhắn lên server: ${apiMsg}\n` +
            'Kiểm tra backend đang chạy (port 5000) và biến VITE_BACKEND_URL.',
        );
        onSuccess?.();
        onClose();
        setAmount(''); setDisplayName(''); setMessage('');
        return;
      }

      alert('Quyên góp thành công! Cảm ơn bạn ❤️');
      onSuccess?.();
      onClose();
      setAmount(''); setDisplayName(''); setMessage('');
    } catch (err) {
      alert('Giao dịch thất bại: ' + (err.shortMessage || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">💚 Quyên góp</h2>
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Số tiền */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Số tiền</label>
            <div className="flex gap-2 mb-2">
              {['0.1', '0.5', '1.0'].map(v => (
                <button key={v} type="button" onClick={() => setAmount(v)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all
                    ${amount === v ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}>
                  {v} ETH
                </button>
              ))}
            </div>
            <input type="number" step="0.01" min="0.001"
              placeholder="Hoặc nhập số ETH khác..."
              value={amount} onChange={e => setAmount(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-400" />
          </div>

          {/* Tên hiển thị */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Tên của bạn <span className="text-gray-400">(để trống = Ẩn danh)</span>
            </label>
            <input type="text" placeholder="Nguyễn Văn A..."
              value={displayName} onChange={e => setDisplayName(e.target.value)}
              maxLength={50}
              className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-400" />
          </div>

          {/* Lời nhắn */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Lời nhắn</label>
            <textarea placeholder="Chúc các em sớm có trường mới..."
              value={message} onChange={e => setMessage(e.target.value)}
              maxLength={200} rows={3}
              className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-400" />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
              Hủy
            </button>
            <button type="submit" disabled={loading || !amount}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50">
              {loading ? 'Đang xử lý...' : 'Xác nhận donate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonateModal;