import { useEffect, useState } from 'react';
import { getWithdrawalsByCampaign, getAllWithdrawals } from '../services/api';

export function useWithdrawalsByCampaign(campaignId, refreshKey = 0, setError) {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (campaignId === null || campaignId === undefined || campaignId === '') {
      setWithdrawals([]);
      return;
    }
    setLoading(true);
    if (setError) setError(null);
    getWithdrawalsByCampaign(campaignId)
      .then((data) => {
        setWithdrawals(data);
      })
      .catch((err) => {
        console.error(err);
        if (setError) {
          setError(
            err.response?.data?.error || err.message || 'Không lấy được dữ liệu',
          );
        }
      })
      .finally(() => setLoading(false));
  }, [campaignId, refreshKey, setError]);
  return { withdrawals, loading };
}

export function useAllWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getAllWithdrawals()
      .then(setWithdrawals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  return { withdrawals, loading };
}