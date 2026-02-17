/**
 * NetworkDebug Component
 * 
 * Displays network and gas fee information for debugging.
 * Shows which network you're connected to and current gas prices.
 */

import { useEffect } from 'react'
import { usePublicClient, useChainId } from 'wagmi'

export default function NetworkDebug() {
  const chainId = useChainId()
  const publicClient = usePublicClient()

  useEffect(() => {
    const logNetworkInfo = async () => {
      if (!publicClient) return

      try {
        // Get network info
        console.log('=== NETWORK DEBUG INFO ===')
        console.log('chainId:', chainId)
        console.log('network name:', chainId === 11155111 ? 'Sepolia' : 'Unknown')
        console.log('Is Sepolia?', chainId === 11155111 ? 'YES ✅' : 'NO ❌')
        
        // Get fee data
        const feeData = await publicClient.estimateFeesPerGas()
        console.log('=== FEE DATA ===')
        console.log('maxFeePerGas:', feeData.maxFeePerGas?.toString(), 'wei')
        console.log('maxPriorityFeePerGas:', feeData.maxPriorityFeePerGas?.toString(), 'wei')
        
        // Convert to Gwei for readability
        if (feeData.maxFeePerGas) {
          const gweiPrice = Number(feeData.maxFeePerGas) / 1e9
          console.log('Gas Price:', gweiPrice.toFixed(2), 'Gwei')
          
          // Estimate proposal creation cost
          const estimatedGas = 150000 // ~150k gas for proposal
          const costInEth = (Number(feeData.maxFeePerGas) * estimatedGas) / 1e18
          console.log('Estimated proposal cost:', costInEth.toFixed(4), 'ETH')
        }
        
        // Get block info
        const blockNumber = await publicClient.getBlockNumber()
        console.log('Current block:', blockNumber.toString())
        console.log('========================')
      } catch (error) {
        console.error('Error fetching network info:', error)
      }
    }

    logNetworkInfo()
  }, [chainId, publicClient])

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '12px 16px',
      background: chainId === 11155111 ? '#d4edda' : '#f8d7da',
      border: `2px solid ${chainId === 11155111 ? '#28a745' : '#dc3545'}`,
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        {chainId === 11155111 ? '✅ Sepolia Testnet' : '❌ Wrong Network'}
      </div>
      <div>Chain ID: {chainId}</div>
      <div style={{ fontSize: '10px', marginTop: '4px', color: '#666' }}>
        Check console for detailed gas info
      </div>
    </div>
  )
}
