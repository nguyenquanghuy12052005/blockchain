export const contractABI = [
  // ── ĐỌC: địa chỉ superAdmin ──────────────────────────────
  {
    inputs: [],
    name: "superAdmin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },

  // ── ĐỌC: tổng số quỹ ─────────────────────────────────────
  {
    inputs: [],
    name: "getCampaignsCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },

  // ── ĐỌC: thông tin 1 quỹ theo id ─────────────────────────
  // getCampaign trả về struct Campaign gồm 7 trường
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "getCampaign",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id",          type: "uint256" },
          { internalType: "string",  name: "name",        type: "string"  },
          { internalType: "string",  name: "description", type: "string"  },
          { internalType: "uint256", name: "goal",        type: "uint256" },
          { internalType: "uint256", name: "totalDonated",type: "uint256" },
          { internalType: "bool",    name: "active",      type: "bool"    },
          { internalType: "address", name: "owner",       type: "address" },
        ],
        internalType: "struct MultiCampaignFund.Campaign",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  // ── GHI: quyên góp ───────────────────────────────────────
  {
    inputs: [{ internalType: "uint256", name: "_campaignId", type: "uint256" }],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },

  // ── GHI: tạo quỹ (chỉ superAdmin) ───────────────────────
  {
    inputs: [
      { internalType: "string",  name: "_name",        type: "string"  },
      { internalType: "string",  name: "_description", type: "string"  },
      { internalType: "uint256", name: "_goal",        type: "uint256" },
    ],
    name: "createCampaign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // ── GHI: rút tiền (chỉ superAdmin) ───────────────────────
  {
    inputs: [
      { internalType: "uint256",         name: "_campaignId", type: "uint256" },
      { internalType: "address payable", name: "_recipient",  type: "address" },
      { internalType: "uint256",         name: "_amount",     type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // ── GHI: bật/tắt quỹ (chỉ superAdmin) ───────────────────
  {
    inputs: [
      { internalType: "uint256", name: "_campaignId", type: "uint256" },
      { internalType: "bool",    name: "_active",     type: "bool"    },
    ],
    name: "setActive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // ── EVENT: có donation mới ────────────────────────────────
  {
    anonymous: false,
    inputs: [
      { indexed: true,  internalType: "uint256", name: "campaignId", type: "uint256" },
      { indexed: true,  internalType: "address", name: "donor",      type: "address" },
      { indexed: false, internalType: "uint256", name: "amount",     type: "uint256" },
      { indexed: false, internalType: "uint256", name: "timestamp",  type: "uint256" },
    ],
    name: "Donated",
    type: "event",
  },

  // ── EVENT: tạo quỹ mới ────────────────────────────────────
  {
    anonymous: false,
    inputs: [
      { indexed: true,  internalType: "uint256", name: "id",    type: "uint256" },
      { indexed: false, internalType: "string",  name: "name",  type: "string"  },
      { indexed: false, internalType: "uint256", name: "goal",  type: "uint256" },
      { indexed: false, internalType: "address", name: "owner", type: "address" },
    ],
    name: "CampaignCreated",
    type: "event",
  },

  // ── EVENT: rút tiền ───────────────────────────────────────
  {
    anonymous: false,
    inputs: [
      { indexed: true,  internalType: "uint256", name: "campaignId", type: "uint256" },
      { indexed: true,  internalType: "address", name: "recipient",  type: "address" },
      { indexed: false, internalType: "uint256", name: "amount",     type: "uint256" },
    ],
    name: "Withdrawn",
    type: "event",
  },
];