import axios from 'axios';
import { BACKEND_URL } from '../config/constants';

const api = axios.create({
  baseURL: BACKEND_URL || 'http://localhost:5000',
});

// POST /donate
export const sendDonationMessage = async (payload) => {
  console.log('[FE] sendDonationMessage payload:', payload);

  const { data } = await api.post('/donate', payload);

  console.log('[FE] sendDonationMessage response:', data);

  return data;
};

// GET /campaigns/:campaignId/donations
export const getDonationsByCampaign = async (campaignId) => {
  console.log('[FE] getDonationsByCampaign campaignId:', campaignId);

  const { data } = await api.get(`/campaigns/${campaignId}/donations`);

  console.log('[FE] getDonationsByCampaign response:', data);

  return data;
};

// GET /donations
export const getAllDonations = async () => {
  console.log('[FE] getAllDonations called');

  const { data } = await api.get('/donations');

  console.log('[FE] getAllDonations response:', data);

  return data;
};

// POST /campaigns/sync-tx
export const syncCampaignFromTx = async (transactionHash) => {
  console.log('[FE] syncCampaignFromTx txHash:', transactionHash);

  const { data } = await api.post('/campaigns/sync-tx', {
    transactionHash: String(transactionHash),
  });

  console.log('[FE] syncCampaignFromTx response:', data);

  return data;
};

// POST /withdraw
export const sendWithdrawalInfo = async (payload) => {
  console.log('[FE] sendWithdrawalInfo payload:', payload);

  const { data } = await api.post('/withdraw', payload);

  console.log('[FE] sendWithdrawalInfo response:', data);

  return data;
};

// GET /campaigns/:campaignId/withdrawals
export const getWithdrawalsByCampaign = async (campaignId) => {
  console.log('[FE] getWithdrawalsByCampaign campaignId:', campaignId);

  const { data } = await api.get(`/campaigns/${campaignId}/withdrawals`);

  console.log('[FE] getWithdrawalsByCampaign response:', data);

  return data;
};

// GET /withdrawals
export const getAllWithdrawals = async () => {
  console.log('[FE] getAllWithdrawals called');

  const { data } = await api.get('/withdrawals');

  console.log('[FE] getAllWithdrawals response:', data);

  return data;
};

// GET /verify/:txHash
export const verifyTransaction = async (txHash) => {
  console.log('[FE] verifyTransaction txHash:', txHash);

  const { data } = await api.get(
    `/verify/${encodeURIComponent(txHash)}`
  );

  console.log('[FE] verifyTransaction response:', data);

  return data;
};


// PUT /campaigns/:campaignId/image
export const updateCampaignImage = async (campaignId, imageUrl) => {
  console.log('[FE] updateCampaignImage', campaignId, imageUrl);
  const { data } = await api.put(`/campaigns/${campaignId}/image`, { imageUrl });
  return data;
};

export const uploadCampaignImage = async (campaignId, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post(`/campaigns/${campaignId}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};