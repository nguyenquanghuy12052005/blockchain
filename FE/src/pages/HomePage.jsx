import React, { useEffect, useState } from 'react';
import { useReadContract, useReadContracts, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/constants';
import { contractABI } from '../contractABI';
import CampaignCard from '../components/CampaignCard';
import AdminPanel from '../components/AdminPanel';
import { useAdmin } from '../hooks/useAdmin';
import Layout from '../components/Layout';
import Button from '../ui/Button';

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
      {/* Hero */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-bold text-slate-700">
              Minh bạch blockchain • Lịch sử rõ ràng
            </div> */}
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Quyên góp nhanh, theo dõi minh bạch, rút tiền có lịch sử
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Bạn có thể quyên góp vào các quỹ đang hoạt động. Admin quản trị quỹ, rút tiền và
              lịch sử giao dịch luôn được lưu lại để dễ đối soát.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Xem danh sách quỹ
            </Button>
          </div>
        </div>
      </div>

      {/* Panel admin — chỉ hiện khi ví admin kết nối */}
      {isAdmin && (
        <AdminPanel
          campaignOptions={campaigns.map((c) => ({ id: c.id, name: c.name }))}
          onCreated={handleFundCreated}
        />
      )}

      {/* Danh sách quỹ */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-lg"
            >
              <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-200" />
              <div className="mt-6 h-2 w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-5 flex gap-2">
                <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
                <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white/70 p-10 text-center text-slate-600 shadow-lg">
          {isAdmin
            ? 'Chưa có quỹ nào. Bạn có thể tạo quỹ đầu tiên ở phần Admin.'
            : 'Chưa có quỹ từ thiện nào đang hoạt động.'}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              isAdmin={isAdmin}
              onCampaignUpdated={() => {
                // Sau donate/withdraw, refetch để cập nhật progress ngay
                setTimeout(() => refetchCampaigns(), 400);
              }}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default HomePage;