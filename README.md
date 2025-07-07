# Ticquette NFT Project

## Overview
Ticquette is a decentralized application (dApp) that revolutionizes kiosk
rental through blockchain technology and NFTs. The platform enables seamless
rental of digital kiosks, vending machines, and interactive terminals using
Non-Fungible Tokens as proof of ownership and access rights.
This is the backend dApp for generating leasing NFTs, featuring a Hardhat smart
contract and an Express.js backend API.

## 📁 Repository Structure

```
ticquette/
│
├── smart-contract/                 # Hardhat Smart Contract
│   ├── contracts/                  # Solidity source files
│   │   └── TicquetteNFT.sol        # ERC-721 lease-enabled NFT contract
│   ├── scripts/                    # Deployment scripts
│   │   └── deploy.js               # Deploy to networks
│   ├── test/                       # Smart contract tests
│   │   └── TicquetteNFT.test.js    # Mocha/Chai test suite
│   ├── artifacts/                  # Compilation artifacts (includes ABI)
│   ├── hardhat.config.js           # Hardhat configuration
│   ├── package.json                # NPM metadata & scripts
│   └── .env                        # Network & private key settings
│
├── backend-api/                    # Express.js Backend API
│   ├── src/
│   │   ├── controllers/            # Route handlers
│   │   │   ├── appController.js    # /status, /stats
│   │   │   ├── userController.js   # POST /users
│   │   │   └── nftController.js    # POST /mint, GET /nfts, GET /nft/:tokenId
│   │   ├── routes/                 # Express routers
│   │   │   ├── index.js            # Mounts all routes under /api
│   │   │   ├── userRoutes.js       # /users
│   │   │   └── nftRoutes.js        # /mint, /nfts, /nft/:tokenId
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── User.js
│   │   │   └── NFT.js
│   │   ├── utils/                  # Helper modules
│   │   │   ├── ipfsUtils.js        # Pinata IPFS integration
│   │   │   ├── contractUtils.js    # ethers.js contract wrapper
│   │   │   └── validation.js       # Metadata validation
│   │   ├── config/                 # Configuration clients
│   │   │   ├── db.js               # MongoDB client
│   │   │   └── redis.js            # Redis client
│   │   └── server.js               # Express server entry
│   ├── package.json
│   └── .env                        # DB, Redis, Pinata, RPC settings
│
└── README.md                       # Project overview & instructions
```

---

## 🔧 Prerequisites

* **Node.js** v16+ and **npm**
* **MongoDB** locally or remote
* **Redis** locally or remote
* **Hardhat** (`npm install --global hardhat`)
* **Pinata** account for IPFS pinning

## 🏗️ Smart Contract Setup & Deployment

1. **Install dependencies**

   ```bash
   cd smart-contract
   npm install
   ```

2. **Configure `.env`**

   ```env
   SEPOLIA_URL=https://eth-sepolia.alchemyapi.io/v2/your-key
   PRIVATE_KEY=0x...
   CONTRACT_ADDRESS=
   ETHERSCAN_API_KEY=...
   ```

3. **Compile & Deploy**

   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **ABI Extraction**  (optional)

   ```bash
   npm run extract-abi
   ```

---

## 🚀 Backend API Setup & Running

1. **Install dependencies**

   ```bash
   cd backend-api
   npm install
   ```

2. **Configure `.env`**

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=27017
   DB_DATABASE=ticquette_nft
   REDIS_URL=redis://localhost:6379
   SEPOLIA_URL=https://eth-sepolia.alchemyapi.io/v2/your-key
   PRIVATE_KEY=0x...
   CONTRACT_ADDRESS=0x...
   PINATA_API_KEY=
   PINATA_SECRET_API_KEY=
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start services**

   * MongoDB: `mongod`
   * Redis: `redis-server`

4. **Run server**

   ```bash
   npm run dev
   ```

---

## 🔍 Exploring API Endpoints

All endpoints are prefixed with `/api`:

| Method | Endpoint            | Description                            |
| ------ | ------------------- | -------------------------------------- |
| GET    | `/api/status`       | Health check (Redis & MongoDB)         |
| GET    | `/api/stats`        | Collection counts (users, NFTs)        |
| POST   | `/api/users`        | Create or fetch user by wallet address |
| POST   | `/api/mint`         | Mint a new Ticquette NFT               |
| GET    | `/api/nfts`         | List all minted NFTs                   |
| GET    | `/api/nft/:tokenId` | Fetch a specific NFT by its token ID   |

### Example: Create User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{ "walletAddress": "0xAbC...123" }'
```

### Example: Mint NFT

```bash
curl -X POST http://localhost:5000/api/mint \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0xAbC...123",
    "useOfSpace": "Office",
    "description": "Monthly Lease",
    "dimensionOfSpace": "10x20x8",
    "lga": "Central",
    "state": "Lagos",
    "country": "NG",
    "durationOfLease": 31536000
  }'
```

### Example: Fetch NFT by Token ID

```bash
curl http://localhost:5000/api/nft/0
```

---

## 📚 Testing & Development

* **Smart Contract Tests**: `cd smart-contract && npm test`
* **Backend Tests**: `cd backend-api && npm test`

---

## 🌐 License

MIT © Ticquette Team

