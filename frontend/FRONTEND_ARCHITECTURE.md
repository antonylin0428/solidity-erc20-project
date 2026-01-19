# Frontend Architecture Guide

## 📁 Project Structure

```
frontend/
├── src/
│   ├── main.jsx              # Entry point - sets up React, Wagmi, React Query
│   ├── App.jsx               # Main app component - wallet connection & layout
│   ├── config.js             # Configuration (contract addresses, chain IDs)
│   ├── wagmi.config.js       # Wagmi configuration (chains, connectors)
│   ├── hooks/
│   │   └── useClubDAOFactory.js  # Custom hook for factory contract interactions
│   └── components/
│       ├── CreateOrganization.jsx  # Form to create new organizations
│       └── OrganizationList.jsx     # List of all organizations
└── package.json
```

## 🔑 Key Concepts

### 1. **Wagmi (Web3 React Hooks)**
- **What it is**: A React library for Ethereum interactions
- **Why we use it**: Provides hooks like `useAccount`, `useReadContract`, `useWriteContract`
- **Key hooks**:
  - `useAccount()` - Gets connected wallet address
  - `useReadContract()` - Reads data from contracts (FREE, instant)
  - `useWriteContract()` - Writes to contracts (COSTS GAS, takes time)
  - `useWaitForTransactionReceipt()` - Waits for transaction confirmation

### 2. **React Query**
- **What it is**: Data fetching and caching library
- **Why we use it**: Caches blockchain reads, handles loading/error states
- **How Wagmi uses it**: Wagmi hooks use React Query under the hood

### 3. **Components vs Hooks**
- **Components**: UI pieces (buttons, forms, lists) - what users see
- **Hooks**: Logic pieces (contract interactions, state management) - what components use

### 4. **Read vs Write Operations**

#### READ Operations (useReadContract)
```javascript
// FREE - No gas cost, instant
const { data } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'organizationCount',
})
```

#### WRITE Operations (useWriteContract)
```javascript
// COSTS GAS - Requires wallet, takes time
const { writeContract } = useWriteContract()
await writeContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'createOrganization',
  args: [name, symbol, maxMembers],
})
```

## 🔄 Data Flow

### Creating an Organization

1. **User fills form** → `CreateOrganization` component
2. **User clicks submit** → Calls `createOrganization()` from hook
3. **Hook calls** → `writeContract()` from Wagmi
4. **Transaction sent** → To blockchain network
5. **Transaction mined** → Included in a block
6. **Confirmation** → `useWaitForTransactionReceipt` detects success
7. **UI updates** → OrganizationList re-renders with new data

### Reading Organizations

1. **Component mounts** → `OrganizationList` renders
2. **Hook calls** → `useReadContract` for each organization
3. **Data fetched** → From blockchain (cached by React Query)
4. **UI updates** → Shows organization cards

## 📝 Important Files Explained

### `config.js`
- Stores contract addresses and network settings
- **Why separate**: Easy to update when deploying to different networks
- **Key values**: Factory address, chain ID, RPC URL

### `useClubDAOFactory.js`
- Custom hook that wraps Wagmi hooks
- **Purpose**: Makes it easy to interact with factory contract
- **Provides**: `createOrganization()` function, transaction status

### `CreateOrganization.jsx`
- Form component for creating organizations
- **State management**: Uses `useState` for form fields
- **Transaction handling**: Uses hook to send transactions
- **User feedback**: Shows loading/success/error states

### `OrganizationList.jsx`
- Displays all organizations
- **Data fetching**: Uses `useReadContract` for each org
- **Dynamic rendering**: Loops through organization IDs

## 🚀 How to Add New Features

### Adding a New Contract Interaction

1. **Create a hook** in `hooks/` folder
   ```javascript
   export function useNewContract() {
     const { writeContract } = useWriteContract()
     const { data } = useReadContract({ ... })
     return { functionName: () => writeContract({ ... }), data }
   }
   ```

2. **Create a component** in `components/` folder
   ```javascript
   export default function NewFeature() {
     const { functionName, data } = useNewContract()
     return <button onClick={functionName}>Click me</button>
   }
   ```

3. **Import in App.jsx**
   ```javascript
   import NewFeature from './components/NewFeature'
   // Use in JSX
   ```

## 🔍 Debugging Tips

1. **Check browser console** - Wagmi logs transaction details
2. **Check Etherscan** - View transactions on blockchain
3. **React DevTools** - Inspect component state
4. **Wagmi DevTools** - See wallet connection status

## 📚 Next Steps

- [ ] Add DAO interaction components (proposals, voting)
- [ ] Add NFT display component
- [ ] Add error boundaries
- [ ] Add loading skeletons
- [ ] Add transaction history
