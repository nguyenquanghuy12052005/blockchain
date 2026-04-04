import React, { useState } from 'react';
import { useCreateCampaign, useWithdraw } from '../hooks/useContract';

const AdminPanel = ({ campaignIds }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [goal, setGoal] = useState('');
  const [withdrawCampaignId, setWithdrawCampaignId] = useState('');
  const [recipient, setRecipient] = useState('');
  const { createCampaign } = useCreateCampaign();
  const { withdraw } = useWithdraw();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !goal) return;
    try {
      await createCampaign(name, desc, goal);
      alert('Tạo quỹ thành công!');
      setName('');
      setDesc('');
      setGoal('');
    } catch (err) {
      alert('Tạo quỹ thất bại');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawCampaignId || !recipient) return;
    try {
      await withdraw(parseInt(withdrawCampaignId), recipient);
      alert('Rút tiền thành công!');
      setWithdrawCampaignId('');
      setRecipient('');
    } catch (err) {
      alert('Rút tiền thất bại');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Quản trị viên</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Tạo quỹ mới</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <input type="text" placeholder="Tên quỹ" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
            <textarea placeholder="Mô tả" value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border p-2 rounded" rows={2} />
            <input type="number" step="0.01" placeholder="Mục tiêu (ETH)" value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full border p-2 rounded" required />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Tạo quỹ</button>
          </form>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Rút tiền từ quỹ</h3>
          <form onSubmit={handleWithdraw} className="space-y-3">
            <select value={withdrawCampaignId} onChange={(e) => setWithdrawCampaignId(e.target.value)} className="w-full border p-2 rounded" required>
              <option value="">Chọn quỹ</option>
              {campaignIds.map(id => <option key={id} value={id}>Quỹ #{id}</option>)}
            </select>
            <input type="text" placeholder="Địa chỉ ví nhận (0x...)" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full border p-2 rounded" required />
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Rút tiền</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;