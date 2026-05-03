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

// Gửi thông tin sau khi withdraw — BE tạo hoặc update record theo txHash
// Route: POST /api/withdraw
export const sendWithdrawalInfo = async (payload) => {
  const { data } = await api.post('/api/withdraw', payload);
  return data;
};

// Lấy lịch sử withdraw của 1 quỹ
// Route: GET /api/campaigns/:campaignId/withdrawals
export const getWithdrawalsByCampaign = async (campaignId) => {
  const { data } = await api.get(`/api/campaigns/${campaignId}/withdrawals`);
  return data;
};

// Lấy tất cả withdrawals
// Route: GET /api/withdrawals
export const getAllWithdrawals = async () => {
  const { data } = await api.get('/api/withdrawals');
  return data;
};

/**
 * Verify giao dịch kép: kiểm tra đồng thời trên Ganache (on-chain) và MongoDB.
 * Route: GET /api/verify/:txHash
 * Trả về: { verdict, chain: {...}, db: {...} }
 *   verdict: 'authentic' | 'chain_only' | 'db_only' | 'chain_failed' | 'not_found' | 'pending_confirm'
 */
export const verifyTransaction = async (txHash) => {
  const { data } = await api.get(`/api/verify/${encodeURIComponent(txHash)}`);
  return data;
};