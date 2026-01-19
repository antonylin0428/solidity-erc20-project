/**
 * Wagmi Configuration
 * 
 * WHAT IS WAGMI?
 * - Wagmi = "We're All Gonna Make It" - a React library for Ethereum
 * - Provides hooks to interact with Ethereum wallets and contracts
 * 
 * WHAT DOES THIS FILE DO?
 * - Configures which blockchain networks to connect to (Sepolia testnet)
 * - Configures wallet connectors (MetaMask, WalletConnect)
 * - Sets up the RPC transport (how to communicate with the blockchain)
 */

import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Get WalletConnect Project ID from https://cloud.walletconnect.com
// This is free - just sign up and create a new project
// If not set, WalletConnect won't work but MetaMask will still work
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID'

export const config = createConfig({
  // Which blockchain networks to support
  chains: [sepolia],
  
  // Wallet connectors - how users can connect their wallets
  connectors: [
    // Injected connector = MetaMask, Brave Wallet, etc. (browser extension wallets)
    injected(),
    
    // WalletConnect = Mobile wallets, QR code connection
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],
  
  // Transport = How to communicate with the blockchain
  // http() = Uses HTTP RPC endpoints (like publicnode.com)
  transports: {
    [sepolia.id]: http(),
  },
})

