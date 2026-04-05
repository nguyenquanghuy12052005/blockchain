import axios from 'axios';
import { BACKEND_URL } from '../config/constants';

const api = axios.create({
  baseURL: BACKEND_URL || 'http://localhost:5000',
});

// Gửi lời nhắn sau khi donate — BE tạo hoặc update record theo txHash
// Route: POST /api/donate
export const sendDonationMessage = async (payload) => {
  const { data } = await api.post('/api/donate', payload);
  return data;
};

// Lấy lịch sử donate của 1 quỹ
// Route: GET /api/campaigns/:campaignId/donations
export const getDonationsByCampaign = async (campaignId) => {
  const { data } = await api.get(`/api/campaigns/${campaignId}/donations`);
  return data;
};

// Lấy tất cả donations
// Route: GET /api/donations
export const getAllDonations = async () => {
  const { data } = await api.get('/api/donations');
  return data;
};

/** Đồng bộ quỹ vừa tạo vào MongoDB (đọc receipt + getCampaign) */
export const syncCampaignFromTx = async (transactionHash) => {
  const { data } = await api.post('/api/campaigns/sync-tx', {
    transactionHash: String(transactionHash),
  });
  return data;
};

export const getMongoCampaigns = async () => {
  const { data } = await api.get('/api/campaigns');
  return data;
};