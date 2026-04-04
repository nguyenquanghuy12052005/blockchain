import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/constants';
import { contractABI } from '../contractABI';

export function useAdmin(address) {
  const { data: superAdmin } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'superAdmin', // khớp với contract
  });

  const isAdmin =
    !!address &&
    !!superAdmin &&
    address.toLowerCase() === superAdmin.toLowerCase();

  return { isAdmin, superAdmin };
}