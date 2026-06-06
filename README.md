# Tu Thien - Blockchain Donation Platform

A decentralized charity and donation platform built with blockchain technology. This project allows users to create fundraising campaigns, donate crypto funds, and manage withdrawals through a smart contract on the blockchain.

## 🌟 Project Overview

Tu Thien is a full-stack blockchain application that combines:
- **Smart Contract Layer**: Solidity contracts for managing campaigns and donations
- **Backend Layer**: Node.js/Express API with MongoDB database
- **Frontend Layer**: React UI with Web3 integration

### Key Features
- 📊 Create and manage multiple fundraising campaigns
- 💰 Donate to campaigns using cryptocurrency
- 🔐 Track donations on-chain with smart contracts
- 💳 Manage fund withdrawals with admin controls
- 📱 Responsive web interface with wallet integration
- 🔗 Real-time event synchronization between blockchain and database

---

## 📁 Project Structure

```
tu_thien/
├── BE/                    # Backend (Node.js/Express)
├── CONTRACT/              # Smart Contracts (Solidity/Hardhat)
└── FE/                    # Frontend (React/Vite)
```

---

## 🔧 Tech Stack

### Backend (BE)
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB (Mongoose 9.4.1)
- **Blockchain**: ethers.js 5.7.2
- **Other**: CORS, dotenv, Nodemon (dev)

### Smart Contracts (CONTRACT)
- **Language**: Solidity ^0.8.24
- **Framework**: Hardhat
- **Testing**: Hardhat test framework
- **Plugins**: 
  - @nomiclabs/hardhat-ethers
  - @nomiclabs/hardhat-waffle
  - hardhat-gas-reporter
  - solidity-coverage

### Frontend (FE)
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Styling**: Tailwind CSS 3.4.0
- **Web3**: Wagmi 3.6.0, Viem 2.47.10
- **HTTP Client**: Axios 1.14.0
- **State Management**: @tanstack/react-query 5.96.2
- **UI Icons**: lucide-react 1.14.0

---

## 📂 Detailed Directory Structure

### Backend (BE/)
```
BE/
├── app.js                           # Express app setup
├── server.js                        # Entry point
├── package.json                     # Dependencies
├── config/
│   ├── blockchain.js                # Web3/ethers configuration
│   └── db.js                        # MongoDB connection
├── controllers/
│   ├── campaignController.js        # Campaign logic
│   ├── donationController.js        # Donation handling
│   ├── verifyController.js          # Verification logic
│   └── withdrawalController.js      # Withdrawal management
├── models/
│   ├── Campaign.js                  # Campaign schema
│   ├── Donation.js                  # Donation schema
│   └── Withdrawal.js                # Withdrawal schema
├── routes/
│   ├── donationRoutes.js            # /api/donation endpoints
│   └── withdrawalRoutes.js          # /api/withdrawal endpoints
├── services/
│   ├── campaignService.js           # Campaign business logic
│   ├── donationService.js           # Donation service
│   └── withdrawalService.js         # Withdrawal service
├── listeners/
│   └── eventListener.js             # Listen to blockchain events
├── middleware/
│   └── upload.js                    # File upload configuration
├── scripts/
│   └── setupWithdrawal.js           # Setup scripts
└── uploads/                         # Uploaded files storage
```

### Smart Contracts (CONTRACT/)
```
CONTRACT/
├── contracts/
│   ├── Lock.sol                     # Lock contract
│   └── MultiCampaignFund.sol        # Main campaign funding contract
├── scripts/
│   ├── deployMulti.ts               # Deployment script
│   └── interact.ts                  # Interaction script
├── test/
│   └── Lock.ts                      # Contract tests
├── artifacts/                       # Compiled contract artifacts
├── cache/                           # Build cache
├── hardhat.config.ts                # Hardhat configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
└── README.md                        # Contract documentation
```

### Frontend (FE/)
```
FE/
├── src/
│   ├── App.jsx                      # Root component
│   ├── main.jsx                     # Entry point
│   ├── index.css                    # Global styles
│   ├── contractABI.js               # Contract ABI
│   ├── components/
│   │   ├── AdminPanel.jsx           # Admin interface
│   │   ├── CampaignCard.jsx         # Campaign card component
│   │   ├── ConnectWallet.jsx        # Wallet connection
│   │   ├── DonateModal.jsx          # Donation modal
│   │   ├── DonationHistory.jsx      # Donation history view
│   │   ├── Layout.jsx               # Layout wrapper
│   │   └── WithdrawalHistory.jsx    # Withdrawal history
│   ├── pages/
│   │   └── HomePage.jsx             # Home page
│   ├── config/
│   │   ├── constants.js             # App constants
│   │   └── wagmi.js                 # Wagmi Web3 config
│   ├── hooks/
│   │   ├── useAdmin.js              # Admin hook
│   │   ├── useContract.js           # Contract interaction hook
│   │   ├── useDonations.js          # Donations hook
│   │   └── useWithdrawals.js        # Withdrawals hook
│   ├── services/
│   │   └── api.js                   # API service (axios)
│   └── ui/
│       ├── Badge.jsx                # Badge component
│       ├── Button.jsx               # Button component
│       ├── Card.jsx                 # Card component
│       ├── Field.jsx                # Form field
│       ├── Input.jsx                # Input field
│       ├── Modal.jsx                # Modal component
│       ├── Select.jsx               # Select component
│       ├── Textarea.jsx             # Textarea component
│       ├── Toast.jsx                # Toast notifications
│       ├── toastStore.js            # Toast state management
│       └── cn.js                    # Class name utility
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS config
└── postcss.config.js                # PostCSS config
```

---

#

