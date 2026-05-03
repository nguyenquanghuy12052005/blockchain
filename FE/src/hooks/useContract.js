import { useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/constants';
import { contractABI } from '../contractABI';
import { parseEther } from 'viem';

// ── Donate vào quỹ ────────────────────────────────────────────
export function useDonate() {
  const { writeContractAsync } = useWriteContract();

  const donate = async (campaignId, amountEth) => {
    const txHash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'donate',            // khớp contract
      args: [BigInt(campaignId)],
      value: parseEther(String(amountEth)),
    });
    return txHash;
  };

  return { donate };
}

// ── Tạo quỹ mới (superAdmin) ─────────────────────────────────
export function useCreateCampaign() {
  const { writeContractAsync } = useWriteContract();

  const createCampaign = async (name, description, goalEth) => {
    const txHash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'createCampaign',    // khớp contract
      args: [name, description, parseEther(String(goalEth))],
    });
    return txHash;
  };

  return { createCampaign };
}

// ── Rút tiền (superAdmin) ─────────────────────────────────────
export function useWithdraw() {
  const { writeContractAsync } = useWriteContract();

  const withdraw = async (campaignId, recipient, amountEth) => {
    const txHash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'withdraw',          // khớp contract
      args: [BigInt(campaignId), recipient, parseEther(String(amountEth))],
    });
    return txHash;
  };

  return { withdraw };
}