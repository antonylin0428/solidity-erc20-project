# ClubDAO - NFT-Based DAO System

A complete decentralized autonomous organization (DAO) system where clubs can create their own governance structures using membership NFTs, voting, delegation, and executable proposals.

## Overview

ClubDAO enables any group to create their own DAO with:
- **Membership NFTs**: ERC721 tokens representing club membership (1 NFT = 1 vote)
- **Governance**: Create proposals, vote, and execute actions
- **Delegation**: Members can delegate their voting power to trusted members
- **Executable Proposals**: Proposals can execute on-chain actions (send ETH, call contracts, etc.)

## Architecture

### Contracts

1. **ClubDAOFactory** - Factory contract to deploy new club organizations
2. **MembershipNFT** - ERC721 token representing club membership
3. **ClubDAO** - Governance contract handling proposals, voting, and execution
4. **ClubTreasury** - Optional treasury contract for managing club funds

### How It Works

1. Deploy `ClubDAOFactory` (one-time deployment)
2. Users call `createOrganization()` to create a new club
3. Factory deploys a `MembershipNFT` and `ClubDAO` contract
4. Members are added by minting membership NFTs
5. Members can create proposals, vote, delegate, and execute actions

## Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Hardhat

### Installation

```shell
npm install
```

### Compile Contracts

```shell
npx hardhat compile
```

### Run Tests

```shell
npx hardhat test
```

### Deploy

```shell
npx hardhat ignition deploy ignition/modules/ClubDAOFactory.js --network <network>
```

## Usage

### Creating a Club

```javascript
const factory = await ethers.getContractAt("ClubDAOFactory", factoryAddress);

const tx = await factory.createOrganization(
  "Pizza Club",  // Name
  "PIZZA",       // Symbol
  30             // Max members
);

const receipt = await tx.wait();
// Get NFT and DAO addresses from events
```

### Adding Members

```javascript
await dao.addMember(memberAddress);
```

### Creating a Proposal

```javascript
await dao.createProposal(
  "Approve $50 pizza budget",
  pizzaVendorAddress,
  "0x",  // Empty calldata (just sending ETH)
  ethers.parseEther("0.1")
);
```

### Voting

```javascript
await dao.vote(proposalId, true);  // true = for, false = against
```

### Delegating Votes

```javascript
await dao.delegate(delegateeAddress);
```

### Executing Proposals

```javascript
// After voting period ends and proposal passes
await dao.executeProposal(proposalId);
```

## Features

- ✅ NFT-based membership (1 NFT = 1 vote)
- ✅ Proposal creation and voting
- ✅ Vote delegation system
- ✅ Executable proposals (send ETH, call contracts)
- ✅ Quorum requirements
- ✅ Configurable voting periods
- ✅ Reentrancy protection

## Development

### Project Structure

```
contracts/
  ├── ClubDAOFactory.sol    # Factory for creating clubs
  ├── MembershipNFT.sol      # ERC721 membership tokens
  ├── ClubDAO.sol           # Governance contract
  └── ClubTreasury.sol      # Treasury contract (optional)

test/
  └── [test files]

ignition/
  └── modules/
      └── ClubDAOFactory.js  # Deployment script

frontend/
  └── [React frontend]
```

## Security Considerations

- Only members can vote (verified via NFT ownership)
- Double voting prevention
- Reentrancy guards on critical functions
- Proposal execution safety checks

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
