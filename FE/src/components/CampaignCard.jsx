import React, { useState } from 'react';
import { formatEther } from 'viem';
import DonateModal from './DonateModal';
import DonationHistory from './DonationHistory';
import Card, { CardBody, CardFooter, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { BACKEND_URL_IMAGE } from '../config/constants';

const CampaignCard = ({ campaign, isAdmin, onWithdraw, onCampaignUpdated }) => {
  const [showDonate, setShowDonate] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [donationRefresh, setDonationRefresh] = useState(0);
  const goalEth = Number(formatEther(campaign.goal));
  const donatedEth = Number(formatEther(campaign.totalDonated));
  const percent = goalEth > 0 ? (donatedEth / goalEth) * 100 : 0;
  console.log('imageUrl:', BACKEND_URL_IMAGE + campaign.imageUrl);
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl border border-rose-100 bg-white/80 backdrop-blur-sm overflow-hidden">
      
{campaign.imageUrl && (
  <div className="w-full h-48 overflow-hidden rounded-2xl">
    <img
      src={`${BACKEND_URL_IMAGE}${campaign.imageUrl}`}
      alt={campaign.name}
      className="w-full h-full object-cover"
    />
  </div>
)}
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black text-gray-800">{campaign.name}</h2>
         <p className="mt-1 line-clamp-2 max-w-[85%] text-sm text-gray-500">
              {campaign.description || 'Chưa có mô tả cho quỹ này.'}
            </p>
          </div>
          <div className="shrink-0 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 px-3 py-2 text-right shadow-inner">
            <div className="text-[11px] font-bold text-rose-500">Đã quyên</div>
            <div className="text-sm font-black text-rose-600">{donatedEth.toFixed(3)} ETH</div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
          <span>🎯 Mục tiêu: {goalEth} ETH</span>
          <span>{Math.min(percent, 100).toFixed(0)}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full rounded-full bg-rose-100">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-rose-400 to-amber-400"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </CardBody>

      <CardFooter className="pt-0">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowDonate(true)} className="bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md hover:shadow-lg">
            💝 Quyên góp
          </Button>
          <Button variant="secondary" onClick={() => setShowHistory(true)} className="border-rose-200 text-rose-600">
            📜 Lịch sử giao dịch
          </Button>
          {isAdmin && onWithdraw && campaign.totalDonated > 0n && (
            <Button variant="danger" onClick={() => onWithdraw(campaign.id)} className="bg-rose-600 hover:bg-rose-700">
              💸 Rút tiền
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