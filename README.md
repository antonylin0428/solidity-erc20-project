# ClubDAO - Transparent Governance for Student Organizations

> **Live Demo**: [https://solidity-erc20-project.vercel.app](https://solidity-erc20-project.vercel.app)  
> **Deployed on**: Sepolia Testnet  
> **Factory Address**: `0x6bdE8374C5119f61fc3730CbFBB11433cF77da06`

## The Problem

Student clubs manage thousands of dollars with zero transparency. Treasurers have full control. Members can't see spending. Voting happens on Google Forms that anyone can manipulate.

## The Solution

A DAO platform purpose-built for student clubs:
- **On-chain voting** (verifiable, transparent)
- **NFT-based membership** (prevents duplicate votes)
- **Treasury management** (every member sees spending)
- **Proposal execution** (budgets are automatically enforced)

### Example: Pizza Club

Pizza Club has 30 members and $500 budget:
1. Member proposes: "Buy pizza oven for $300"
2. All 30 members vote on-chain
3. If passed, funds automatically release
4. Full audit trail forever

## Architecture

### Smart Contracts

1. **ClubDAOFactory** (`ClubDAOFactory.sol`)
   - Factory for deploying new club organizations
   - One-time deployment, used by all clubs
   - Automatically mints first membership NFT to creator

2. **MembershipNFT** (`MembershipNFT.sol`)
   - ERC721 token representing club membership
   - 1 NFT = 1 vote in governance
   - Deployed per organization

3. **ClubDAO** (`ClubDAO.sol`)
   - Governance contract with proposal/voting logic
   - Vote delegation support
   - Executable proposals (can send ETH, call contracts)
   - Deployed per organization

4. **ClubTreasury** (`ClubTreasury.sol`)
   - Treasury contract for managing club funds
   - Optional, deployed per organization

### Frontend Stack

- **React 18** with Vite
- **Wagmi v2** for Ethereum interaction
- **Viem** for type-safe contract calls
- **TanStack Query** for data fetching
- **Vercel** deployment

## Engineering Highlights

### Gas Optimization: ~60% Savings

**Problem**: Proposal creation cost 0.17 ETH  
**Solution**: Store only `bytes32` description hash on-chain, emit full description in events  
**Result**: Gas cost reduced by ~60%

```solidity
// Instead of storing the full string:
struct Proposal {
    bytes32 descriptionHash;  // Only 32 bytes!
    // ... other fields
}

// Emit the full description in events:
emit ProposalCreated(proposalId, proposer, descriptionHash, description);
```

Frontend fetches descriptions from event logs using `getLogs()`.

### Network Safety

**Problem**: Users accidentally connecting to Ethereum mainnet  
**Solution**: Built `NetworkGuard` component with auto-switch UX  
**Result**: Blocks entire app if not on Sepolia, prevents real ETH transactions

### Security Features

- ✅ ReentrancyGuard on `executeProposal`
- ✅ Double-voting prevention via mapping
- ✅ Quorum validation before execution
- ✅ Only NFT holders can vote
- ✅ Proposal execution safety checks
## How It Works

1. **Deploy Factory** (one-time): Deploy `ClubDAOFactory` to blockchain
2. **Create Organization**: Call `createOrganization()` with name, symbol, max members
3. **Factory Deploys**: Automatically deploys `MembershipNFT` + `ClubDAO` contracts
4. **Creator Gets NFT**: First membership NFT automatically minted to creator
5. **Add Members**: Mint NFTs to new members via `addMember()`
6. **Governance**: Members create proposals, vote, delegate, and execute actions

## Quick Start

### Prerequisites

- Node.js v16+
- MetaMask (or web3 wallet)
- Sepolia testnet ETH ([get from faucet](https://sepoliafaucet.com/))

### Backend Setup (Smart Contracts)

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run contract tests
npx hardhat test

# Deploy to Sepolia (requires .env file)
npx hardhat ignition deploy ignition/modules/ClubDAOFactory.js --network sepolia
```

**Environment Variables** (create `.env` file):
```env
SEPOLIA_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_here
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run frontend tests
npm test
```

**Frontend Environment Variables** (optional, `frontend/.env`):
```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id  # For WalletConnect support
```

## Usage Examples

### 1. Creating a New Club (via Frontend)

1. Connect wallet to Sepolia testnet
2. Enter organization name, symbol, and max members
3. Confirm transaction
4. Receive first membership NFT automatically
5. Share DAO address with other members

### 2. Creating a Proposal

**Frontend**: Use the "Create Proposal" form in the DAO view

**Smart Contract**:
```javascript
await dao.createProposal(
  "Buy pizza oven for $300",        // Description
  treasuryAddress,                   // Target contract
  "0x",                              // Action data (empty for ETH transfer)
  ethers.parseEther("0.3")          // Value to send
);
```

### 3. Voting on Proposals

**Frontend**: Click "Vote FOR" or "Vote AGAINST" buttons

**Smart Contract**:
```javascript
await dao.vote(proposalId, true);   // true = FOR, false = AGAINST
```

### 4. Delegating Your Vote

**Frontend**: Enter delegate address in member dashboard

**Smart Contract**:
```javascript
await dao.delegate(trustedMemberAddress);
```

### 5. Executing Passed Proposals

**Frontend**: Click "Execute" button after voting period ends

**Smart Contract**:
```javascript
// Only works after deadline + proposal passed
await dao.executeProposal(proposalId);
```

### 6. Adding New Members

**Frontend**: Enter member address in "Add Member" form

**Smart Contract**:
```javascript
await dao.addMember(newMemberAddress);  // Mints membership NFT
```

## Features

### Smart Contract Features
- ✅ NFT-based membership (ERC721, 1 NFT = 1 vote)
- ✅ Factory pattern for deploying organizations
- ✅ Proposal creation with executable actions
- ✅ Vote delegation system
- ✅ Quorum-based governance
- ✅ Configurable voting periods
- ✅ Gas-optimized proposal storage (events)
- ✅ Reentrancy protection

### Frontend Features
- ✅ Web3 wallet integration (MetaMask, WalletConnect)
- ✅ Network guard (prevents mainnet accidents)
- ✅ Real-time proposal monitoring
- ✅ Member dashboard with voting history
- ✅ Search and filter proposals
- ✅ Toast notifications for transactions
- ✅ Responsive UI design

## Project Structure

```
solidity-erc20-project-clean/
├── contracts/
│   ├── ClubDAOFactory.sol      # Factory for deploying DAOs
│   ├── MembershipNFT.sol        # ERC721 membership tokens
│   ├── ClubDAO.sol              # Main governance contract
│   └── ClubTreasury.sol         # Treasury management
│
├── test/
│   ├── ClubDAOFactory.test.js   # Factory contract tests
│   ├── ClubDAO.test.js          # DAO contract tests
│   ├── MembershipNFT.test.js    # NFT contract tests
│   └── ClubTreasury.test.js     # Treasury tests
│
├── ignition/
│   └── modules/
│       └── ClubDAOFactory.js    # Hardhat Ignition deployment
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── CreateOrganization.jsx
│   │   │   ├── OrganizationList.jsx
│   │   │   ├── DAOView.jsx
│   │   │   ├── CreateProposal.jsx
│   │   │   ├── ProposalCard.jsx
│   │   │   ├── NetworkGuard.jsx
│   │   │   └── ...
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useToast.js
│   │   │   └── useProposalDescriptions.js
│   │   ├── contracts/           # Contract ABIs
│   │   ├── config.js            # Frontend config
│   │   ├── wagmi.config.js      # Wagmi configuration
│   │   └── App.jsx              # Main app component
│   └── package.json
│
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Root package.json
└── README.md                    # This file
```

## Tech Stack

### Backend
- **Solidity 0.8.28** - Smart contract language
- **Hardhat** - Development environment
- **Hardhat Ignition** - Deployment framework
- **OpenZeppelin** - Secure contract libraries
- **Ethers.js** - Ethereum library

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Wagmi v2** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **TanStack Query** - Data fetching
- **Vitest** - Testing framework

### Deployment
- **Sepolia Testnet** - Ethereum test network
- **Vercel** - Frontend hosting

## Testing

### Smart Contract Tests

```bash
# Run all contract tests
npx hardhat test

# Run specific test file
npx hardhat test test/ClubDAO.test.js

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

## Deployment

The project is currently deployed on **Sepolia Testnet**:

- **Factory Contract**: `0x6bdE8374C5119f61fc3730CbFBB11433cF77da06`
- **Network**: Sepolia (Chain ID: 11155111)
- **Frontend**: [https://solidity-erc20-project.vercel.app](https://solidity-erc20-project.vercel.app)

### Deploying Your Own Instance

1. Set up environment variables (`.env`):
```env
SEPOLIA_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_here
```

2. Deploy factory contract:
```bash
npx hardhat ignition deploy ignition/modules/ClubDAOFactory.js --network sepolia
```

3. Update frontend config (`frontend/src/config.js`):
```javascript
export const CONFIG = {
  CLUB_DAO_FACTORY_ADDRESS: "your_deployed_address_here",
  CHAIN_ID: 11155111,
  RPC_URL: "https://ethereum-sepolia-rpc.publicnode.com"
}
```

4. Deploy frontend to Vercel:
```bash
cd frontend
npm run build
# Connect to Vercel and deploy
```

## Key Learnings & Engineering Decisions

### 1. Gas Optimization Strategy
- **Challenge**: Initial proposal creation cost 0.17 ETH
- **Research**: Analyzed storage costs (20,000 gas per 32 bytes)
- **Solution**: Store `bytes32` hash on-chain, emit full string in events
- **Impact**: 60% gas reduction, frontend fetches from logs

### 2. Network Safety
- **Challenge**: Users connecting to Ethereum mainnet by mistake
- **Impact**: Real ETH at risk ($0.15 per transaction)
- **Solution**: `NetworkGuard` blocks app, forces network switch
- **Result**: Zero mainnet transactions possible

### 3. Factory Pattern
- **Benefit**: Single deployment, infinite DAOs
- **Tradeoff**: Higher initial deployment cost, lower per-DAO cost
- **Result**: Scalable architecture for multi-tenant platform

### 4. Event-Driven Frontend
- **Approach**: Use `getLogs()` for historical data
- **Benefit**: No backend needed, fully decentralized
- **Tradeoff**: More complex frontend logic

## Security Considerations

- ✅ Only NFT holders can vote (verified on-chain)
- ✅ Double-voting prevention via mapping
- ✅ Reentrancy guards on `executeProposal`
- ✅ Quorum validation before execution
- ✅ Proposal safety checks (target, value, data)
- ✅ Network validation (prevents mainnet accidents)

## Future Enhancements

- [ ] Multi-choice voting (not just for/against)
- [ ] Time-locked proposals (execution delay)
- [ ] Proposal cancellation by proposer
- [ ] Snapshot voting (gasless off-chain voting)
- [ ] IPFS integration for proposal metadata
- [ ] Mobile-responsive wallet connection
- [ ] Analytics dashboard

## License

ISC

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/solidity-erc20-project/issues).

## Author

Built by [Your Name] as a demonstration of full-stack Web3 development with modern tooling (Hardhat, Wagmi v2, React 18, Vite).

## Acknowledgments

- OpenZeppelin for secure contract libraries
- Hardhat team for excellent developer tooling
- Wagmi team for React Ethereum hooks
