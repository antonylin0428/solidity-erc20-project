import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

// Get WalletConnect Project ID from https://cloud.walletconnect.com
// This is free - just sign up and create a new project
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
})

