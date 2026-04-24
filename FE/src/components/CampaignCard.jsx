import React, { useState } from 'react';
import { formatEther } from 'viem';
import DonateModal from './DonateModal';
import DonationHistory from './DonationHistory';
import Card, { CardBody, CardFooter, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const CampaignCard = ({ campaign, isAdmin, onWithdraw, onCampaignUpdated }) => {
  const [showDonate, setShowDonate] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [donationRefresh, setDonationRefresh] = useState(0);
  const goalEth = Number(formatEther(campaign.goal));
  const donatedEth = Number(formatEther(campaign.totalDonated));
  const percent = goalEth > 0 ? (donatedEth / goalEth) * 100 : 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black text-slate-900">{campaign.name}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {campaign.description || 'Chưa có mô tả cho quỹ này.'}
            </p>
          </div>
          <div className="rounded-2xl bg-blue-50 px-3 py-2 text-right">
            <div className="text-[11px] font-bold text-blue-700">Đã quyên</div>
            <div className="text-sm font-black text-blue-900">{donatedEth} ETH</div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Mục tiêu: {goalEth} ETH</span>
          <span>{Math.min(percent, 100).toFixed(0)}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </CardBody>

      <CardFooter className="pt-0">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowDonate(true)}>Quyên góp</Button>
          <Button variant="secondary" onClick={() => setShowHistory(true)}>
            Lịch sử giao dịch
          </Button>
          {isAdmin && onWithdraw && campaign.totalDonated > 0n && (
            <Button variant="danger" onClick={() => onWithdraw(campaign.id)}>
              Rút tiền
            </Button>
          )}
        </div>
      </CardFooter>

      <DonateModal
        isOpen={showDonate}
        onClose={() => setShowDonate(false)}
        campaignId={campaign.id}
        onSuccess={() => {
          setDonationRefresh((k) => k + 1);
          // Cập nhật progress ở card ngay sau donate
          onCampaignUpdated?.();
        }}
      />

      <Modal
        open={showHistory}
        onClose={() => setShowHistory(false)}
        title="Lịch sử giao dịch"
        description={`Quỹ #${campaign.id}`}
      >
        <DonationHistory campaignId={campaign.id} refreshKey={donationRefresh} />
      </Modal>
    </Card>
  );
};

export default CampaignCard;