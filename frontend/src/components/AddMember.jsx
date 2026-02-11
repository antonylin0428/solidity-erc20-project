/**
 * Component: AddMember
 * 
 * PURPOSE:
 * - Provides a form for members to add new members to the DAO
 * - Validates the address before submitting
 * - Shows current member capacity (e.g., "5/30 members")
 * 
 * HOW IT WORKS:
 * 1. User enters wallet address
 * 2. Validates it's a valid Ethereum address
 * 3. Calls dao.addMember(address)
 * 4. DAO contract calls nft.mint(address)
 * 5. New member receives membership NFT
 * 
 * ACCESS CONTROL:
 * - Only existing members can add new members (enforced by contract)
 * - UI disables button if user is not a member
 * 
 * PROPS:
 * - daoAddress: The ClubDAO contract address
 * - nftAddress: The MembershipNFT contract address
 * - isMember: Boolean indicating if connected user is a member
 */

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { isAddress } from 'viem'
import { useMembershipNFT } from '../hooks/useMembershipNFT'
import { useToast } from '../hooks/useToast'
import ClubDAOABI from '../../../artifacts/contracts/ClubDAO.sol/ClubDAO.json'

export default function AddMember({ daoAddress, nftAddress, isMember, onMemberAdded }) {
  const toast = useToast()
  // Component state - stores the address input value
  const [newMemberAddress, setNewMemberAddress] = useState('')
  
  // Get NFT information using our custom hook
  const { totalSupply, maxSupply } = useMembershipNFT(nftAddress)
  
  // Wagmi hooks for writing to the blockchain
  const { 
    writeContract, 
    data: hash, 
    isPending, 
    error: writeError 
  } = useWriteContract()
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  /**
   * Handle form submission
   * 
   * VALIDATION CHECKS:
   * 1. Is the input a valid Ethereum address?
   * 2. Is there room for more members? (totalSupply < maxSupply)
   * 
   * TRANSACTION FLOW:
   * 1. Call writeContract with dao.addMember()
   * 2. User approves transaction in wallet
   * 3. Transaction sent to blockchain
   * 4. Wait for confirmation
   * 5. NFT minted to new member
   */
  const handleAddMember = async (e) => {
    e.preventDefault()

    // Validation 1: Check if it's a valid Ethereum address
    if (!isAddress(newMemberAddress)) {
      toast.error('Please enter a valid Ethereum address')
      return
    }

    // Validation 2: Check if there's room for more members
    if (totalSupply >= maxSupply) {
      toast.warning(`Maximum members (${maxSupply}) reached!`)
      return
    }

    try {
      // Call the addMember function on the DAO contract
      // NOTE: We call the DAO, not the NFT directly
      // The DAO will then call nft.mint() internally
      await writeContract({
        address: daoAddress,
        abi: ClubDAOABI.abi,
        functionName: 'addMember',
        args: [newMemberAddress],
      })
      toast.success('Member added successfully!')
    } catch (error) {
      console.error('Failed to add member:', error)
      toast.error('Failed to add member. Please try again.')
    }
  }

  // Show success message after confirmation
  if (isConfirmed) {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#d4edda', 
        border: '1px solid #c3e6cb',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#155724', marginBottom: '10px' }}>✅ Member Added!</h3>
        <p style={{ color: '#155724', marginBottom: '10px' }}>
          New member has been added to the DAO and received their membership NFT.
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
            setNewMemberAddress('')
            onMemberAdded?.()
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
          Add Another Member
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: '#333' }}>Add New Member</h3>
        {/* Show member capacity */}
        <div style={{ 
          padding: '6px 12px', 
          background: totalSupply >= maxSupply ? '#f8d7da' : '#d1ecf1',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {totalSupply} / {maxSupply} Members
        </div>
      </div>

      {/* Warning if not a member */}
      {!isMember && (
        <div style={{ 
          padding: '12px', 
          background: '#fff3cd', 
          border: '1px solid #ffc107',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          ⚠️ Only members can add new members
        </div>
      )}

      <form onSubmit={handleAddMember}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Member Wallet Address
          </label>
          <input
            type="text"
            value={newMemberAddress}
            onChange={(e) => setNewMemberAddress(e.target.value)}
            placeholder="0x..."
            required
            disabled={!isMember || isPending || isConfirming}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Enter the Ethereum address of the person you want to add
          </div>
        </div>

        <button
          type="submit"
          disabled={!isMember || isPending || isConfirming || totalSupply >= maxSupply}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: !isMember || isPending || isConfirming || totalSupply >= maxSupply 
              ? '#6c757d' 
              : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: !isMember || isPending || isConfirming || totalSupply >= maxSupply 
              ? 'not-allowed' 
              : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isPending ? 'Preparing Transaction...' : 
           isConfirming ? 'Waiting for Confirmation...' : 
           totalSupply >= maxSupply ? 'Max Members Reached' :
           !isMember ? 'Members Only' :
           'Add Member'}
        </button>
      </form>

      {/* Show error if any */}
      {writeError && (
        <div style={{ 
          marginTop: '12px',
          padding: '12px',
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          Error: {writeError.message}
        </div>
      )}
    </div>
  )
}
