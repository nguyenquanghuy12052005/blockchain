import { useEffect, useState } from 'react';
import { getDonationsByCampaign, getAllDonations } from '../services/api';

export function useDonationsByCampaign(campaignId, refreshKey = 0) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (campaignId === null) return;
    setLoading(true);
    getDonationsByCampaign(campaignId)
      .then(setDonations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [campaignId, refreshKey]);
  return { donations, loading };
}

export function useAllDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getAllDonations()
      .then(setDonations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  return { donations, loading };
}