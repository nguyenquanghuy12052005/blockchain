import React, { useState } from 'react';
import { useDonate } from '../hooks/useContract';
import { useAccount } from 'wagmi';
import { sendDonationMessage } from '../services/api';
import { parseEther } from 'viem';

const DonateModal = ({ isOpen, onClose, campaignId }) => {
  const [amount,  setAmount]  = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { donate }            = useDonate();
  const { address }           = useAccount();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      // Bước 1: gọi hàm donate trên blockchain qua MetaMask
      // MetaMask sẽ popup → user xác nhận → trả về txHash
      const txHash = await donate(campaignId, amount);

      // Bước 2: chờ 2 giây để BE listener kịp bắt event Donated
      // và lưu record vào MongoDB trước khi mình gửi message
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Bước 3: gửi lên BE để tạo/update record kèm lời nhắn
      // Route: POST /api/donate
      await sendDonationMessage({
        transactionHash: txHash,
        campaignId:      campaignId,
        donor:           address,
        amount:          parseEther(amount).toString(), // gửi dạng wei string
        timestamp:       Math.floor(Date.now() / 1000),
        message:         message,
      });

      alert('Quyên góp thành công! Cảm ơn bạn ❤️');
      onClose();
      setAmount('');
      setMessage('');
    } catch (err) {
      console.error(err);
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

        <form onSubmit={handleSubmit}>
          {/* Chọn nhanh */}
          <div className="flex gap-2 mb-3">
            {['0.1', '0.5', '1.0'].map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(v)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all
                  ${amount === v
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
              >
                {v} ETH
              </button>
            ))}
          </div>

          {/* Nhập tay */}
          <input
            type="number"
            step="0.01"
            min="0.001"
            placeholder="Hoặc nhập số ETH khác..."
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full border rounded-lg p-2.5 mb-3 text-sm focus:outline-none focus:border-blue-400"
          />

          {/* Lời nhắn */}
          <textarea
            placeholder="Lời nhắn của bạn (tùy chọn)"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full border rounded-lg p-2.5 mb-4 text-sm focus:outline-none focus:border-blue-400"
            rows={3}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !amount}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonateModal;