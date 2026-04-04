import axios from 'axios';
import { BACKEND_URL } from '../config/constants';

const api = axios.create({ baseURL: BACKEND_URL });

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