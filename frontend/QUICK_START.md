# Quick Start Guide

## 🚀 Running the Frontend

1. **Install dependencies** (if not already done):
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   - The app should open automatically at `http://localhost:3000`
   - Or manually navigate to that URL

## 🔧 Configuration

### WalletConnect Setup (Optional but Recommended)

1. Go to https://cloud.walletconnect.com
2. Sign up for a free account
3. Create a new project
4. Copy your Project ID
5. Create a `.env` file in the `frontend/` directory:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

### Contract Address

The factory contract address is in `src/config.js`:
- **Sepolia**: `0x08755c93633B2C267B0242c0C520DBa26F0b6dd3`

If you deploy to a different network, update this address.

## 📱 Using the App

### 1. Connect Your Wallet
- Click "Connect Wallet"
- Choose your wallet provider (MetaMask, WalletConnect, etc.)
- Approve the connection

### 2. Create an Organization
- Fill out the form:
  - **Name**: e.g., "Pizza Club"
  - **Symbol**: e.g., "PIZZA" (will be uppercase)
  - **Max Members**: e.g., 30
- Click "Create Organization"
- Approve the transaction in your wallet
- Wait for confirmation (~15-30 seconds on Sepolia)

### 3. View Organizations
- After creation, your organization will appear in the list
- Click the Etherscan links to view contracts on the blockchain

## 🐛 Troubleshooting

### "Cannot find module" errors
- Make sure you've run `npm install` in the frontend directory
- Check that the ABI files exist in `artifacts/contracts/`

### Wallet won't connect
- Make sure you're on Sepolia testnet in your wallet
- Check that WalletConnect Project ID is set (if using WalletConnect)
- Try refreshing the page

### Transaction fails
- Make sure you have Sepolia ETH (get free testnet ETH from faucets)
- Check that you're connected to Sepolia network
- Verify the contract address is correct

### Organizations not showing
- Wait a few seconds for the blockchain to sync
- Refresh the page
- Check browser console for errors

## 📚 Learn More

See `FRONTEND_ARCHITECTURE.md` for detailed explanations of how everything works!
