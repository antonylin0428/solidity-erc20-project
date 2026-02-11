/**
 * Component: Treasury
 * 
 * PURPOSE:
 * - Display the DAO's ETH balance
 * - Allow members to deposit ETH into the DAO
 * - Show funding statistics
 * 
 * HOW IT WORKS:
 * 1. useBalance hook reads the DAO contract's ETH balance
 * 2. useSendTransaction sends ETH to the DAO
 * 3. Visual cards display balance and funding info
 * 
 * KEY CONCEPTS:
 * - Every contract can hold ETH (like a wallet)
 * - The DAO needs ETH to execute proposals that send payments
 * - Members can voluntarily fund the DAO
 */

import { useState } from 'react'
import { useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { useToast } from '../hooks/useToast'

export default function Treasury({ daoAddress, isMember }) {
  const toast = useToast()
  // State for deposit form
  const [depositAmount, setDepositAmount] = useState('')
  const [showDepositForm, setShowDepositForm] = useState(false)

  /**
   * useBalance Hook - Reads ETH balance of an address
   * 
   * HOW IT WORKS:
   * - Queries the blockchain for the address's balance
   * - Auto-updates when balance changes
   * - Returns balance in wei and formatted in ETH
   * 
   * PARAMETERS:
   * - address: The address to check (our DAO contract)
   * - watch: Auto-refresh when balance changes
   */
  const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = useBalance({
    address: daoAddress,
    watch: true, // Auto-refresh when balance changes
  })

  /**
   * useSendTransaction Hook - Sends ETH transactions
   * 
   * HOW IT WORKS:
   * - Prepares a transaction to send ETH
   * - Opens MetaMask for user approval
   * - Returns transaction hash when sent
   * 
   * This is simpler than useWriteContract because we're just
   * sending ETH, not calling a contract function
   */
  const {
    sendTransaction,
    data: hash,
    isPending,
    error: sendError,
  } = useSendTransaction()

  /**
   * Wait for transaction confirmation
   * 
   * WHY WE NEED THIS:
   * - sendTransaction only sends the tx, doesn't wait for mining
   * - We need to wait for the transaction to be included in a block
   * - isSuccess tells us when it's confirmed
   */
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  /**
   * Handle deposit submission
   * 
   * FLOW:
   * 1. User enters amount (e.g., "0.1")
   * 2. We convert to wei using parseEther (1 ETH = 10^18 wei)
   * 3. Send transaction to DAO address with that value
   * 4. Wait for confirmation
   * 5. Balance auto-updates (thanks to watch: true)
   */
  const handleDeposit = async (e) => {
    e.preventDefault()

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.warning('Please enter a valid amount')
      return
    }

    try {
      // parseEther converts "0.1" → "100000000000000000" wei
      await sendTransaction({
        to: daoAddress,
        value: parseEther(depositAmount),
      })
      toast.success('Deposit transaction sent!')
    } catch (error) {
      console.error('Failed to deposit:', error)
      toast.error('Failed to deposit. Please try again.')
    }
  }

  /**
   * Reset form after successful deposit
   */
  if (isConfirmed) {
    return (
      <div style={{
        padding: '20px',
        background: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#155724', marginBottom: '10px' }}>✅ Deposit Successful!</h3>
        <p style={{ color: '#155724', marginBottom: '10px' }}>
          Your ETH has been deposited to the DAO treasury.
        </p>
        {hash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#155724', textDecoration: 'underline' }}
          >
            View transaction on Etherscan
          </a>
        )}
        <button
          onClick={() => {
            setDepositAmount('')
            setShowDepositForm(false)
            refetchBalance() // Manually refresh balance
          }}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Make Another Deposit
        </button>
      </div>
    )
  }

  return (
    <div style={{
      padding: '24px',
      background: '#f8f9fa',
      borderRadius: '8px',
      marginBottom: '24px'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Treasury</h3>

      {/* Balance Display Card */}
      <div style={{
        padding: '24px',
        background: 'white',
        borderRadius: '8px',
        border: '2px solid #667eea',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
          Available Balance
        </div>
        {balanceLoading ? (
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
            Loading...
          </div>
        ) : (
          <>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea' }}>
              {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'}
            </div>
            <div style={{ fontSize: '18px', color: '#999' }}>
              {balance?.symbol || 'ETH'}
            </div>
          </>
        )}
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#999',
          fontStyle: 'italic'
        }}>
          This balance can be used for proposal executions
        </div>
      </div>

      {/* Info Box */}
      <div style={{
        padding: '16px',
        background: '#e7f3ff',
        borderRadius: '8px',
        border: '1px solid #b3d9ff',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '14px', color: '#0c5460', lineHeight: '1.6' }}>
          <strong>💡 How the Treasury Works:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Members can deposit ETH to fund the DAO</li>
            <li>Proposals can include actions to send ETH from this balance</li>
            <li>Only executed proposals can spend treasury funds</li>
            <li>All transactions are transparent on the blockchain</li>
          </ul>
        </div>
      </div>

      {/* Deposit Section */}
      {!isMember && (
        <div style={{
          padding: '12px',
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          ⚠️ You are not a member, but you can still fund the DAO
        </div>
      )}

      {!showDepositForm ? (
        <button
          onClick={() => setShowDepositForm(true)}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          💰 Deposit ETH to Treasury
        </button>
      ) : (
        <form onSubmit={handleDeposit} style={{
          padding: '20px',
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Deposit Amount (ETH)
            </label>
            <input
              type="number"
              step="0.001"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.1"
              required
              min="0.001"
              disabled={isPending || isConfirming}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Minimum: 0.001 ETH (~$2-5 depending on ETH price)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="submit"
              disabled={isPending || isConfirming}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: isPending || isConfirming ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isPending ? 'Preparing Transaction...' :
               isConfirming ? 'Confirming...' :
               'Deposit ETH'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDepositForm(false)
                setDepositAmount('')
              }}
              disabled={isPending || isConfirming}
              style={{
                padding: '12px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>

          {sendError && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              color: '#721c24',
              fontSize: '14px'
            }}>
              Error: {sendError.message}
            </div>
          )}
        </form>
      )}
    </div>
  )
}
