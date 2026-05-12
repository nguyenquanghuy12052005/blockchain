import { BACKEND_URL } from '../config/constants';
import React, { useEffect, useState } from 'react';
import { useReadContract, useReadContracts, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/constants';
import { contractABI } from '../contractABI';
import CampaignCard from '../components/CampaignCard';
import AdminPanel from '../components/AdminPanel';
import { useAdmin } from '../hooks/useAdmin';
import Layout from '../components/Layout';
import Button from '../ui/Button';
import axios from 'axios';
import { Heart, Users, Coins } from 'lucide-react';

const heroImages = [
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=600&fit=crop',
];

const HomePage = () => {
  const { address } = useAccount();
  const { isAdmin } = useAdmin(address);

  const [campaigns, setCampaigns] = useState([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [campaignsWithImages, setCampaignsWithImages] = useState([]);
  const [currentHero, setCurrentHero] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const campaignsPerPage = 9;

  const { data: countData, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getCampaignsCount',
  });

  const count = countData ? Number(countData) : 0;

  const contracts = Array.from({ length: count }, (_, i) => ({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getCampaign',
    args: [BigInt(i)],
  }));

  const {
    data: campaignsData,
    isLoading,
    refetch: refetchCampaigns,
  } = useReadContracts({
    contracts,
  });

  // Hero Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Fetch blockchain campaigns
  useEffect(() => {
    if (!campaignsData || isLoading) return;

    const fetched = campaignsData
      .map((result) => {
        if (result.error || !result.result) return null;

        const c = result.result;

        return {
          id: Number(c.id),
          name: c.name,
          description: c.description,
          goal: c.goal,
          totalDonated: c.totalDonated,
          active: c.active,
          owner: c.owner,
        };
      })
      .filter(Boolean)
      .filter((c) => c.active);

    setCampaigns(fetched);

    const total = fetched.reduce(
      (sum, c) => sum + Number(c.totalDonated) / 1e18,
      0
    );

    setTotalRaised(total);
  }, [campaignsData, isLoading]);

  // Fetch images from MongoDB
  useEffect(() => {
    const fetchImages = async () => {
      if (!campaigns.length) {
        setCampaignsWithImages([]);
        return;
      }

      try {
        const res = await axios.get(`${BACKEND_URL}/campaigns`);

        const mongoCampaigns = res.data;

        const merged = campaigns.map((c) => {
          const m = mongoCampaigns.find(
            (mc) => mc.onChainId === c.id
          );

          return {
            ...c,
            imageUrl: m?.imageUrl || '',
          };
        });

        setCampaignsWithImages(merged);
      } catch (err) {
        console.warn('Không lấy được ảnh từ MongoDB', err);
        setCampaignsWithImages(campaigns);
      }
    };

    fetchImages();
  }, [campaigns]);

  const handleFundCreated = async () => {
    await refetchCount();

    setTimeout(() => {
      refetchCampaigns();
    }, 1000);
  };


const indexOfLastCampaign = currentPage * campaignsPerPage;

const indexOfFirstCampaign =
  indexOfLastCampaign - campaignsPerPage;

const currentCampaigns =
  campaignsWithImages.slice(
    indexOfFirstCampaign,
    indexOfLastCampaign
  );

const totalPages = Math.ceil(
  campaignsWithImages.length / campaignsPerPage
);

  return (
    <Layout>

      {/* HERO SECTION */}
      <div className="relative mb-10 overflow-hidden rounded-[32px] shadow-2xl">

        <div className="relative h-[320px] w-full md:h-[450px]">

          {/* Images */}
          {heroImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Hero ${index}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                currentHero === index
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            />
          ))}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/45" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">

            <div className="max-w-3xl">

              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
                Chung Tay
                <span className="block bg-gradient-to-r from-rose-300 to-amber-200 bg-clip-text text-transparent">
                  Vì Cộng Đồng
                </span>
              </h1>

              <p className="mt-5 text-base leading-relaxed text-white/90 md:text-lg">
                Nền tảng quyên góp minh bạch bằng Blockchain.
                Theo dõi giao dịch, quản lý quỹ và hỗ trợ
                những hoàn cảnh cần giúp đỡ.
              </p>

              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => {
                    window.scrollTo({
                      top: 700,
                      behavior: 'smooth',
                    });
                  }}
                  className="rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-6 text-base font-bold shadow-xl hover:scale-105 transition"
                >
                  💝 Khám phá quỹ
                </Button>
              </div>

            </div>

          </div>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHero(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentHero === index
                    ? 'w-8 bg-white'
                    : 'w-3 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Header */}
     <div className="relative mb-10 overflow-hidden rounded-[28px] border border-rose-100 bg-white/70 p-8 shadow-xl backdrop-blur">

  {/* Blur background */}
  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rose-200/40 blur-3xl" />
  <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />

  <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

    {/* Left */}
    <div className="max-w-2xl">

      <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-1 text-sm font-semibold text-rose-500 shadow-sm">
        ✨ Nền tảng từ thiện blockchain
      </div>

      <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
        <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
          Quyên góp minh bạch
        </span>

        <span className="block text-gray-800">
          Theo dõi mọi giao dịch theo thời gian thực
        </span>
      </h2>

      <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600">
        Mọi khoản quyên góp đều được lưu trữ on-chain,
        giúp đảm bảo tính minh bạch, dễ kiểm tra và hạn chế
        thất thoát trong quá trình quản lý quỹ từ thiện.
      </p>

    </div>

    {/* Right Stats */}
    <div className="grid grid-cols-2 gap-4">

      <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-white p-5 shadow-lg border border-rose-100">
        <div className="text-3xl font-black text-rose-500">
          {campaigns.length}
        </div>

        <div className="mt-1 text-sm font-medium text-gray-500">
          Quỹ đang hoạt động
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white p-5 shadow-lg border border-amber-100">
        <div className="text-3xl font-black text-amber-500">
          {totalRaised.toFixed(1)}
        </div>

        <div className="mt-1 text-sm font-medium text-gray-500">
          ETH đã quyên góp
        </div>
      </div>

    </div>

  </div>

</div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-4 bg-white/40 rounded-2xl border border-rose-100">

        <div className="flex items-center justify-center gap-2">
          <Coins className="w-5 h-5 text-amber-500" />

          <span className="text-sm font-medium text-gray-600">
            Tổng quyên:
          </span>

          <span className="font-bold text-rose-600">
            {totalRaised.toFixed(3)} ETH
          </span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 text-rose-400" />

          <span className="text-sm font-medium text-gray-600">
            Quỹ đang hoạt động:
          </span>

          <span className="font-bold text-rose-600">
            {campaigns.length}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Users className="w-5 h-5 text-rose-400" />

          <span className="text-sm font-medium text-gray-600">
            Minh bạch:
          </span>

          <span className="font-bold text-rose-600">
            100% on-chain
          </span>
        </div>

      </div>

      {/* Admin Panel */}
      {isAdmin && (
        <AdminPanel
          campaignOptions={campaigns.map((c) => ({
            id: c.id,
            name: c.name,
          }))}
          onCreated={handleFundCreated}
        />
      )}

      {/* Campaigns */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-lg"
            >
              <div className="h-5 w-2/3 animate-pulse rounded bg-rose-200" />

              <div className="mt-3 h-4 w-full animate-pulse rounded bg-rose-100" />

              <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-rose-100" />

              <div className="mt-6 h-2 w-full animate-pulse rounded bg-rose-200" />

              <div className="mt-5 flex gap-2">
                <div className="h-10 w-28 animate-pulse rounded-xl bg-rose-200" />
                <div className="h-10 w-36 animate-pulse rounded-xl bg-rose-200" />
              </div>
            </div>
          ))}

        </div>
      ) : campaigns.length === 0 ? (

        <div className="rounded-3xl border border-rose-200 bg-white/70 p-10 text-center text-gray-600 shadow-lg">

          {isAdmin
            ? 'Chưa có quỹ nào. Bạn có thể tạo quỹ đầu tiên ở phần Admin.'
            : 'Chưa có quỹ từ thiện nào đang hoạt động.'}

        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {currentCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              isAdmin={isAdmin}
              onCampaignUpdated={() => {
                setTimeout(() => {
                  refetchCampaigns();
                }, 400);
              }}
            />
          ))}

        </div>
      )}
{totalPages > 1 && (
  <div className="mt-10 flex items-center justify-center gap-3">

    {/* Prev */}
    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.max(prev - 1, 1)
        )
      }
      disabled={currentPage === 1}
      className="rounded-2xl border border-rose-200 bg-white px-5 py-2 font-semibold text-rose-500 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      ← Trước
    </button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }).map((_, index) => {
      const page = index + 1;

      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`h-11 w-11 rounded-2xl font-bold transition ${
            currentPage === page
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg'
              : 'border border-rose-100 bg-white text-gray-600 hover:bg-rose-50'
          }`}
        >
          {page}
        </button>
      );
    })}

    {/* Next */}
    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, totalPages)
        )
      }
      disabled={currentPage === totalPages}
      className="rounded-2xl border border-rose-200 bg-white px-5 py-2 font-semibold text-rose-500 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Sau →
    </button>

  </div>
)}

    

    </Layout>
  );
};

export default HomePage;