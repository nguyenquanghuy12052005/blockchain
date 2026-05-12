import React, { useState } from 'react';
import { useDonate } from '../hooks/useContract';
import { useAccount, usePublicClient } from 'wagmi';
import { sendDonationMessage } from '../services/api';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Field } from '../ui/Field';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { toast } from '../ui/toastStore';

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
      toast.error('Vui lòng kết nối ví trước khi quyên góp.');
      return;
    }
    if (!publicClient) {
      toast.error('Chưa sẵn sàng kết nối blockchain. Thử lại sau.');
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
          displayName: displayName.trim() || 'Ẩn danh',
          message: message.trim(),
        });
      } catch (apiErr) {
        console.warn('Không cập nhật được metadata donation:', apiErr);
      }

      toast.success('Quyên góp thành công! Cảm ơn bạn.');
      onSuccess?.();
      onClose();
      setAmount(''); setDisplayName(''); setMessage('');
    } catch (err) {
      toast.error('Giao dịch thất bại: ' + (err.shortMessage || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        if (loading) return;
        onClose?.();
      }}
      title="🌸 Quyên góp từ thiện"
      description="Mỗi đóng góp đều được ghi nhận trên blockchain"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Số tiền (ETH)" required>
          <div className="grid grid-cols-3 gap-2">
            {['0.1', '0.5', '1.0'].map((v) => (
              <Button
                key={v}
                type="button"
                variant={amount === v ? 'primary' : 'secondary'}
                onClick={() => setAmount(v)}
                className={amount === v ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'border-rose-200 text-rose-600'}
              >
                {v} ETH
              </Button>
            ))}
          </div>
          <div className="mt-2">
            <Input
              type="number"
              step="0.01"
              min="0.001"
              placeholder="Hoặc nhập số ETH khác..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-rose-200 focus:border-rose-400"
            />
          </div>
        </Field>

        <Field label="Tên hiển thị" hint="Để trống = Ẩn danh">
          <Input
            type="text"
            placeholder="Nguyễn Văn A..."
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
            className="border-rose-200 focus:border-rose-400"
          />
        </Field>

        <Field label="Lời nhắn" hint="Tối đa 200 ký tự (tuỳ chọn)">
          <Textarea
            placeholder="Chúc các em sớm có trường mới..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
            rows={3}
            className="border-rose-200 focus:border-rose-400"
          />
        </Field>

        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => onClose?.()}
            className="border-rose-200"
          >
            Hủy
          </Button>
          <Button type="submit" loading={loading} disabled={!amount} className="bg-gradient-to-r from-rose-500 to-amber-500 text-white">
            💝 Xác nhận quyên góp
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DonateModal;