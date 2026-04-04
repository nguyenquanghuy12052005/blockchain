const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_RPC_URL);
const contractABI = [
  "event Donated(uint256 indexed campaignId, address indexed donor, uint256 amount, uint256 timestamp)",
];
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, provider);

module.exports = { provider, contract };