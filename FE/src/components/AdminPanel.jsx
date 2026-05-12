import React, { useState } from 'react';
import axios from 'axios';
import { useCreateCampaign, useWithdraw } from '../hooks/useContract';
import { usePublicClient } from 'wagmi';
import { syncCampaignFromTx, uploadCampaignImage } from '../services/api';
import WithdrawalHistory from './WithdrawalHistory';
import Card, { CardBody, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Field } from '../ui/Field';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import { toast } from '../ui/toastStore';


const AdminPanel = ({ campaignOptions = [], onCreated }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [goal, setGoal] = useState('');
  const [withdrawCampaignId, setWithdrawCampaignId] = useState('');
  const recipient = import.meta.env.VITE_ADMIN_ADDRESS;
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawHistory, setShowWithdrawHistory] = useState(false);
const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState('');
  const selectedCampaign = campaignOptions.find((c) => c.id === withdrawCampaignId);
  const { createCampaign } = useCreateCampaign();
  const { withdraw } = useWithdraw();
  const publicClient = usePublicClient();
  const [creating, setCreating] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

 const handleCreate = async (e) => {
  e.preventDefault();
  if (!name || !goal) return;
  if (!publicClient) {
    toast.error('Chưa kết nối RPC. Kiểm tra Ganache và ví.');
    return;
  }
  setCreating(true);
  try {
    const txHash = await createCampaign(name, desc, goal);
    const hash = typeof txHash === 'string' ? txHash : String(txHash);
    await publicClient.waitForTransactionReceipt({ hash });

    let campaignId = null;
    try {
      const syncResult = await syncCampaignFromTx(hash);
      campaignId = syncResult.campaign?.onChainId;
      toast.success('Tạo quỹ thành công! Đã đồng bộ lên MongoDB.');
    } catch (syncErr) {
      const msg = axios.isAxiosError(syncErr) && syncErr.response?.data?.error
        ? syncErr.response.data.error
        : syncErr?.message || 'Không rõ';
      toast.error(`Quỹ đã tạo on-chain nhưng lưu MongoDB thất bại: ${msg}`);
    }

    // Upload ảnh nếu có file
    if (imageFile && campaignId) {
      try {
        await uploadCampaignImage(campaignId, imageFile);
        toast.success('Đã tải ảnh lên thành công!');
      } catch (imgErr) {
        toast.warning('Tạo quỹ thành công nhưng upload ảnh thất bại.');
      }
    }

    setName('');
    setDesc('');
    setGoal('');
    setImageFile(null);
    setImagePreview('');
    onCreated?.();
  } catch (err) {
    toast.error('Tạo quỹ thất bại: ' + (err.shortMessage || err.message));
  } finally {
    setCreating(false);
  }
};


const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  } else {
    setImageFile(null);
    setImagePreview('');
  }
};
  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (withdrawCampaignId === '' || !recipient || !withdrawAmount) return;
    if (!publicClient) {
      toast.error('Chưa kết nối RPC. Kiểm tra Ganache và ví.');
      return;
    }
    setWithdrawing(true);
    try {
      const txHash = await withdraw(parseInt(withdrawCampaignId), recipient, withdrawAmount);
      const hash = typeof txHash === 'string' ? txHash : String(txHash);
      await publicClient.waitForTransactionReceipt({ hash });
      toast.success('Rút tiền thành công!');
      setWithdrawCampaignId('');
      setWithdrawAmount('');
      onCreated?.();
    } catch (err) {
      toast.error('Rút tiền thất bại: ' + (err.shortMessage || err.message));
    } finally {
      setWithdrawing(false);
    }
  };

  const handleShowWithdrawHistory = () => {
    if (withdrawCampaignId === '') {
      toast.info('Vui lòng chọn quỹ trước khi xem lịch sử rút tiền.');
      return;
    }
    setShowWithdrawHistory(true);
  };

  return (
    <>
      <Card className="mb-8 border-none shadow-xl bg-gradient-to-br from-white to-rose-50/80 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-800">🌸 Khu vực quản trị</h2>
              <p className="mt-1 text-sm text-rose-500">
                Tạo quỹ mới, rút tiền và xem lịch sử rút theo từng quỹ.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-rose-100 bg-white/60 p-5 shadow-sm">
              <h3 className="text-base font-black text-rose-600">✨ Tạo quỹ mới</h3>
              <form onSubmit={handleCreate} className="mt-4 space-y-4">
                <Field label="Tên quỹ" required>
                  <Input
                    type="text"
                    placeholder="Ví dụ: Quỹ xây trường vùng cao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-rose-200 focus:border-rose-400"
                  />
                </Field>
                <Field label="Mô tả" hint="Ngắn gọn 1–2 câu (tuỳ chọn)">
                  <Textarea
                    placeholder="Mô tả mục tiêu, đối tượng nhận hỗ trợ..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
                    className="border-rose-200 focus:border-rose-400"
                  />
                </Field>
                <Field label="Mục tiêu (ETH)" required>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ví dụ: 10"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    required
                    className="border-rose-200 focus:border-rose-400"
                  />
                </Field>


               <Field label="Ảnh đại diện" hint="Chọn file ảnh (tối đa 5MB, jpg/png/gif/webp)">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-rose-200" />
                 </div>
                )}
              </Field>
                <div className="flex justify-end">
                  <Button type="submit" loading={creating} className="bg-gradient-to-r from-rose-500 to-amber-500 text-white border-none">
                    ✨ Tạo quỹ
                  </Button>
                </div>
              </form>
            </div>

            <div className="rounded-3xl border border-rose-100 bg-white/60 p-5 shadow-sm">
              <h3 className="text-base font-black text-amber-600">⬇ Rút tiền từ quỹ</h3>
              <form onSubmit={handleWithdraw} className="mt-4 space-y-4">
                <Field label="Chọn quỹ" required>
                  <div className="relative">
                    <Select
                      value={withdrawCampaignId}
                      onChange={(e) => {
                        const value = e.target.value;
                        setWithdrawCampaignId(value === '' ? '' : Number(value));
                      }}
                      required
                      className="border-rose-200"
                    >
                      <option value="">Chọn quỹ</option>
                      {campaignOptions.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </Select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-rose-400">▼</div>
                  </div>
                </Field>

                <Field label="Số tiền cần rút (ETH)" required hint="Hạn mức tối đa = số dư quỹ">
                  <Input
                    type="number"
                    step="0.001"
                    min="0.001"
                    placeholder="Ví dụ: 0.5"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                    className="border-rose-200 focus:border-rose-400"
                  />
                </Field>

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" variant="danger" loading={withdrawing} className="bg-gradient-to-r from-rose-600 to-rose-500 border-none">
                    💸 Rút tiền
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleShowWithdrawHistory} className="border-rose-200 text-rose-600">
                    📜 Lịch sử rút tiền
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardBody>
      </Card>

      <Modal
        open={showWithdrawHistory}
        onClose={() => setShowWithdrawHistory(false)}
        title="Lịch sử rút tiền"
        description={selectedCampaign ? selectedCampaign.name : undefined}
      >
        <WithdrawalHistory campaignId={withdrawCampaignId} />
      </Modal>
    </>
  );
};

export default AdminPanel;