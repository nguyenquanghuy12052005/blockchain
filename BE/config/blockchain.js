const ethers = require('ethers');  // không dùng destructuring

// ethers v5 dùng providers.JsonRpcProvider
const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_RPC_URL);

const contractABI = [
  "event Donated(uint256 indexed campaignId, address indexed donor, uint256 amount, uint256 timestamp)",
  "event CampaignCreated(uint256 indexed id, string name, uint256 goal, address owner)",
  "event Withdrawn(uint256 indexed campaignId, address indexed recipient, uint256 amount)",
  "function withdraw(uint256 _campaignId, address _recipient, uint256 _amount) external",
  "function getCampaign(uint256 _id) external view returns (tuple(uint256 id,string name,string description,uint256 goal,uint256 totalDonated,bool active,address owner))",
];

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, provider);

module.exports = { provider, contract };