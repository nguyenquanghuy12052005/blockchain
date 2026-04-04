
//file test
import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS not set in .env");
  }

  const contract = await ethers.getContractAt("MultiCampaignFund", contractAddress);

  // ===== 1. Tạo campaign mới (chỉ super admin mới làm được) =====
  console.log("Creating a new campaign...");
  const tx1 = await contract.createCampaign(
    "Xây trường vùng cao",
    "Quyên góp xây dựng trường học cho trẻ em vùng khó khăn",
    ethers.utils.parseEther("10") // Mục tiêu 10 ETH
  );
  await tx1.wait();
  console.log("✅ Campaign created!");

  // ===== 2. Lấy số lượng campaign hiện có =====
  const count = await contract.getCampaignsCount();
  console.log(`Total campaigns: ${count}`);

  // ===== 3. Lấy thông tin campaign đầu tiên (id = 0) =====
  const campaign = await contract.getCampaign(0);
  console.log(`Campaign 0: ${campaign.name}, goal: ${ethers.utils.formatEther(campaign.goal)} ETH`);

  // ===== 4. Donate vào campaign 0 =====
  const donateAmount = ethers.utils.parseEther("1");
  console.log(`Donating ${ethers.utils.formatEther(donateAmount)} ETH to campaign 0...`);
  const tx2 = await contract.donate(0, { value: donateAmount });
  await tx2.wait();
  console.log("✅ Donated!");

  // ===== 5. Kiểm tra lại số tiền đã quyên =====
  const updatedCampaign = await contract.getCampaign(0);
  console.log(`Total donated now: ${ethers.utils.formatEther(updatedCampaign.totalDonated)} ETH`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});