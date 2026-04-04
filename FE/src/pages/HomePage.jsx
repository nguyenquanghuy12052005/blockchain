import React, { useEffect, useState } from 'react';
import { useReadContract, useReadContracts, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/constants';
import { contractABI } from '../contractABI';
import CampaignCard from '../components/CampaignCard';
import AdminPanel from '../components/AdminPanel';
import { useAdmin } from '../hooks/useAdmin';
import Layout from '../components/Layout';

const HomePage = () => {
  const { address } = useAccount();
  const { isAdmin } = useAdmin(address);
  const [campaigns, setCampaigns] = useState([]);

  // ── Bước 1: đọc tổng số quỹ ──────────────────────────────
  const { data: countData, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getCampaignsCount',  // khớp contract
  });
  const count = countData ? Number(countData) : 0;

  // ── Bước 2: đọc từng quỹ song song ───────────────────────
  const contracts = Array.from({ length: count }, (_, i) => ({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getCampaign',        // khớp contract
    args: [BigInt(i)],
  }));

  const { data: campaignsData, isLoading, refetch: refetchCampaigns } =
    useReadContracts({ contracts });

  // ── Bước 3: parse kết quả ─────────────────────────────────
  useEffect(() => {
    if (!campaignsData || isLoading) return;

    const fetched = campaignsData
      .map((result) => {
        if (result.error || !result.result) return null;

        // getCampaign trả về struct Campaign (dạng object vì ABI dùng tuple)
        const c = result.result;
        return {
          id:           Number(c.id),
          name:         c.name,
          description:  c.description,
          goal:         c.goal,           // BigInt, đơn vị wei
          totalDonated: c.totalDonated,   // BigInt, đơn vị wei
          active:       c.active,
          owner:        c.owner,
        };
      })
      .filter(Boolean)
      .filter(c => c.active);            // chỉ hiện quỹ đang hoạt động

    setCampaigns(fetched);
  }, [campaignsData, isLoading]);

  // Refresh sau khi admin tạo quỹ
  const handleFundCreated = async () => {
    await refetchCount();
    setTimeout(() => refetchCampaigns(), 1000);
  };

  return (
    <Layout>
      {/* Panel admin — chỉ hiện khi ví admin kết nối */}
      {isAdmin && (
        <AdminPanel
          campaignIds={campaigns.map(c => c.id)}
          onCreated={handleFundCreated}
        />
      )}

      {/* Danh sách quỹ */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Đang tải danh sách quỹ...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          {isAdmin
            ? '📋 Chưa có quỹ nào. Tạo quỹ đầu tiên ở trên nhé!'
            : 'Chưa có quỹ từ thiện nào đang hoạt động.'}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default HomePage;