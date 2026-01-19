/**
 * Component: CreateOrganization
 * 
 * WHAT IS A COMPONENT?
 * - A component is a reusable piece of UI (like a button, form, or page section)
 * - Components can have their own state (data that changes)
 * - Components can receive props (data passed from parent components)
 * 
 * WHAT DOES THIS COMPONENT DO?
 * - Provides a form to create a new club organization
 * - Uses the useClubDAOFactory hook to interact with the contract
 * - Shows loading states and success/error messages
 */

import { useState } from 'react'
import { useClubDAOFactory } from '../hooks/useClubDAOFactory'
import { useAccount } from 'wagmi'

export default function CreateOrganization({ onOrganizationCreated }) {
  // useState hook - manages component state (data that can change)
  // When state changes, React re-renders the component
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [maxMembers, setMaxMembers] = useState('')

  // useAccount hook from Wagmi - gets the connected wallet address
  const { address, isConnected } = useAccount()

  // Our custom hook - provides functions to interact with the factory contract
  const { 
    createOrganization, 
    isPending, 
    isConfirming, 
    isConfirmed,
    hash 
  } = useClubDAOFactory()

  /**
   * Handle form submission
   * 
   * EVENT FLOW:
   * 1. User fills out form and clicks "Create Organization"
   * 2. handleSubmit is called
   * 3. We call createOrganization() which sends a transaction
   * 4. Transaction is sent to the blockchain
   * 5. We wait for confirmation
   * 6. On success, we call onOrganizationCreated callback
   */
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent page refresh

    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    try {
      await createOrganization(name, symbol, parseInt(maxMembers))
      // Note: We don't reset the form here because we want to wait for confirmation
      // The parent component will handle the reset after confirmation
    } catch (error) {
      console.error('Failed to create organization:', error)
      alert('Failed to create organization. Please try again.')
    }
  }

  // Show success message when transaction is confirmed
  if (isConfirmed) {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#d4edda', 
        border: '1px solid #c3e6cb',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#155724', marginBottom: '10px' }}>✅ Organization Created!</h3>
        <p style={{ color: '#155724', marginBottom: '10px' }}>
          Your organization has been successfully created on the blockchain.
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
            setName('')
            setSymbol('')
            setMaxMembers('')
            onOrganizationCreated?.()
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
          Create Another Organization
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
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Create New Organization</h2>
      
      {!isConnected && (
        <div style={{ 
          padding: '12px', 
          background: '#fff3cd', 
          border: '1px solid #ffc107',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          ⚠️ Please connect your wallet to create an organization
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Organization Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Pizza Club"
            required
            disabled={isPending || isConfirming}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            NFT Symbol
          </label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g., PIZZA"
            required
            maxLength={10}
            disabled={isPending || isConfirming}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Maximum Members
          </label>
          <input
            type="number"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            placeholder="e.g., 30"
            required
            min="1"
            disabled={isPending || isConfirming}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!isConnected || isPending || isConfirming}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isPending || isConfirming ? '#6c757d' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isPending ? 'Preparing Transaction...' : 
           isConfirming ? 'Waiting for Confirmation...' : 
           'Create Organization'}
        </button>
      </form>
    </div>
  )
}
