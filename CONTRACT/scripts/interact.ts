//file test
import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) throw new Error("CONTRACT_ADDRESS not set");
  
  const contract = await ethers.getContractAt("MultiCampaignFund", contractAddress);

  console.log("Creating campaign...");
  const tx1 = await contract.createCampaign(
    "Xây trường vùng cao",
    "Quyên góp xây trường cho trẻ em",
    ethers.utils.parseEther("10")
  );
  await tx1.wait();
  console.log("Campaign created");

  const count = await contract.getCampaignsCount();
  console.log(`Số campaign: ${count}`);

  const donateAmount = ethers.utils.parseEther("1");
  const tx2 = await contract.donate(0, { value: donateAmount });
  await tx2.wait();
  console.log(`Đã donate ${ethers.utils.formatEther(donateAmount)} ETH`);

  const campaign = await contract.getCampaign(0);
  console.log(`Tổng đã quyên: ${ethers.utils.formatEther(campaign.totalDonated)} ETH`);
}

main().catch(console.error);