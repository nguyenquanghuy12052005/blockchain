import { ethers } from "hardhat";

async function main() {
  console.log("Deploying MultiCampaignFund...");
  const ContractFactory = await ethers.getContractFactory("MultiCampaignFund");
  const contract = await ContractFactory.deploy();
  await contract.deployed();

  console.log(`Contract deployed at: ${contract.address}`);
  console.log(`Super admin: ${await contract.superAdmin()}`);
}

main().catch(console.error);