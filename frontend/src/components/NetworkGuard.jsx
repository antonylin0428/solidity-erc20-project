/**
 * NetworkGuard Component
 * 
 * Ensures the user is connected to the correct network (Sepolia).
 * If not, shows a prominent warning and a button to switch networks.
 */

import { useChainId, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export default function NetworkGuard() {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  // If on correct network, don't show anything
  if (chainId === sepolia.id) {
    return null
  }

  const getNetworkName = (id) => {
    const networks = {
      1: 'Ethereum Mainnet',
      5: 'Goerli',
      11155111: 'Sepolia',
      137: 'Polygon',
      80001: 'Mumbai',
    }
    return networks[id] || `Chain ID ${id}`
  }

  const handleSwitchNetwork = () => {
    switchChain({ chainId: sepolia.id })
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '20px',
        }}>
          ⚠️
        </div>
        
        <h2 style={{
          color: '#dc3545',
          marginBottom: '16px',
          fontSize: '24px',
        }}>
          Wrong Network Detected
        </h2>
        
        <div style={{
          background: '#f8d7da',
          border: '2px solid #dc3545',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <p style={{
            color: '#721c24',
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
          }}>
            ⛔ You are currently on: {getNetworkName(chainId)}
          </p>
          <p style={{
            color: '#721c24',
            fontSize: '14px',
            marginBottom: '12px',
          }}>
            ✅ This app requires: Sepolia Testnet
          </p>
          {chainId === 1 && (
            <p style={{
              color: '#dc3545',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '16px',
              padding: '12px',
              background: '#fff',
              borderRadius: '4px',
            }}>
              🚨 WARNING: You're on MAINNET with REAL ETH! 🚨<br/>
              Switch to Sepolia immediately!
            </p>
          )}
        </div>

        <button
          onClick={handleSwitchNetwork}
          disabled={isPending}
          style={{
            width: '100%',
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!isPending) {
              e.target.style.backgroundColor = '#218838'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)'
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#28a745'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = 'none'
          }}
        >
          {isPending ? '⏳ Switching...' : '🔄 Switch to Sepolia Testnet'}
        </button>

        <p style={{
          marginTop: '20px',
          fontSize: '12px',
          color: '#666',
        }}>
          This will prompt MetaMask to switch networks.<br/>
          Sepolia uses free test ETH, not real ETH.
        </p>
      </div>
    </div>
  )
}
