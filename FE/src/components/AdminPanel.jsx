import React, { useState } from 'react';
import axios from 'axios';
import { useCreateCampaign, useWithdraw } from '../hooks/useContract';
import { usePublicClient } from 'wagmi';
import { sendWithdrawalInfo, syncCampaignFromTx } from '../services/api';
import WithdrawalHistory from './WithdrawalHistory';
import { decodeEventLog } from 'viem';
import { contractABI } from '../contractABI';
import { CONTRACT_ADDRESS } from '../config/constants';
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
  const [recipient, setRecipient] = useState('');
  const [showWithdrawHistory, setShowWithdrawHistory] = useState(false);
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
      try {
        await syncCampaignFromTx(hash);
        toast.success('Tạo quỹ thành công! Đã đồng bộ lên MongoDB.');
      } catch (syncErr) {
        const msg =
          axios.isAxiosError(syncErr) && syncErr.response?.data?.error
            ? syncErr.response.data.error
            : syncErr?.message || 'Không rõ';
        toast.error(`Quỹ đã tạo on-chain nhưng lưu MongoDB thất bại: ${msg}`);
      }
      setName('');
      setDesc('');
      setGoal('');
      onCreated?.();
    } catch (err) {
      toast.error('Tạo quỹ thất bại: ' + (err.shortMessage || err.message));
    } finally {
      setCreating(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (withdrawCampaignId === '' || !recipient) return;
    if (!publicClient) {
      toast.error('Chưa kết nối RPC. Kiểm tra Ganache và ví.');
      return;
    }
    setWithdrawing(true);
    try {
      const txHash = await withdraw(parseInt(withdrawCampaignId), recipient);
      const hash = typeof txHash === 'string' ? txHash : String(txHash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Lưu withdrawal vào MongoDB (để lịch sử rút tiền đọc được ngay cả khi listener không chạy)
      try {
        const contractLogs = (receipt.logs || []).filter((l) => {
          if (!l?.topics?.length) return false;
          if (!l.address) return false;
          return String(l.address).toLowerCase() === String(CONTRACT_ADDRESS).toLowerCase();
        });

        let decodedWithdrawn = null;
        for (const l of contractLogs) {
          try {
            const decoded = decodeEventLog({
              abi: contractABI,
              data: l.data,
              topics: l.topics,
            });
            if (decoded?.eventName === 'Withdrawn') {
              decodedWithdrawn = decoded;
              break;
            }
          } catch {
            // log không khớp ABI/event => bỏ qua
          }
        }

        if (decodedWithdrawn) {
          const block = receipt.blockHash
            ? await publicClient.getBlock({ blockHash: receipt.blockHash })
            : null;
          const ts = block?.timestamp != null ? Number(block.timestamp) : Math.floor(Date.now() / 1000);

          await sendWithdrawalInfo({
            transactionHash: hash,
            campaignId: Number(decodedWithdrawn.args.campaignId),
            withdrawer: String(decodedWithdrawn.args.recipient),
            amount: decodedWithdrawn.args.amount.toString(), // wei string
            timestamp: ts,
            message: '',
            displayName: '',
          });
        }
      } catch (dbErr) {
        console.warn('Không lưu được withdrawal vào MongoDB:', dbErr);
        // Không chặn UX: vẫn coi rút tiền thành công trên chain
      }

      toast.success('Rút tiền thành công!');
      setWithdrawCampaignId('');
      setRecipient('');
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
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Khu vực quản trị</h2>
              <p className="mt-1 text-sm text-slate-600">
                Tạo quỹ mới, rút tiền và xem lịch sử rút theo từng quỹ.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white/60 p-5">
              <h3 className="text-base font-black text-slate-900">Tạo quỹ mới</h3>
              <form onSubmit={handleCreate} className="mt-4 space-y-4">
                <Field label="Tên quỹ" required>
                  <Input
                    type="text"
                    placeholder="Ví dụ: Quỹ xây trường vùng cao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Mô tả" hint="Ngắn gọn 1–2 câu (tuỳ chọn)">
                  <Textarea
                    placeholder="Mô tả mục tiêu, đối tượng nhận hỗ trợ..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
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
                  />
                </Field>
                <div className="flex justify-end">
                  <Button type="submit" loading={creating}>
                    Tạo quỹ
                  </Button>
                </div>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/60 p-5">
              <h3 className="text-base font-black text-slate-900">Rút tiền từ quỹ</h3>
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
                    >
                      <option value="">Chọn quỹ</option>
                      {campaignOptions.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </Select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      ▼
                    </div>
                  </div>
                </Field>

                <Field label="Địa chỉ ví nhận" required hint="Dạng 0x...">
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </Field>

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" variant="danger" loading={withdrawing}>
                    Rút tiền
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleShowWithdrawHistory}>
                    Lịch sử rút tiền
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