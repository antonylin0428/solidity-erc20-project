/**
 * Component: MemberList
 * 
 * PURPOSE:
 * - Display all members of the DAO
 * - Show their addresses and token IDs
 * 
 * THE CHALLENGE:
 * - The NFT contract doesn't have a "getAllMembers()" function
 * - We need to figure out who owns which NFTs
 * 
 * SOLUTION OPTIONS:
 * 1. Listen to Transfer events (when NFTs are minted/transferred)
 * 2. Loop through token IDs and check ownership
 * 3. Use a subgraph/indexer (advanced)
 * 
 * WE'LL USE OPTION 2:
 * - Loop from tokenId 1 to totalSupply
 * - For each tokenId, call nft.ownerOf(tokenId)
 * - This gives us all member addresses
 * 
 * WHY THIS WORKS:
 * - Token IDs are sequential (1, 2, 3, ...)
 * - totalSupply tells us the highest minted ID
 * - ownerOf(tokenId) returns the current owner
 */

import { useReadContract } from 'wagmi'
import { useMembershipNFT } from '../hooks/useMembershipNFT'
import MembershipNFTABI from '../../../artifacts/contracts/MembershipNFT.sol/MembershipNFT.json'

export default function MemberList({ nftAddress }) {
  // Get total supply to know how many members exist
  const { totalSupply, name, symbol, isLoading } = useMembershipNFT(nftAddress)

  if (isLoading) {
    return <div>Loading members...</div>
  }

  if (totalSupply === 0) {
    return (
      <div style={{ 
        padding: '24px', 
        textAlign: 'center',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <p style={{ color: '#666' }}>No members yet.</p>
        <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
          Add the first member using the form above!
        </p>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '24px', 
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #ddd'
    }}>
      <h3 style={{ marginBottom: '16px', color: '#333' }}>
        Members ({totalSupply})
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gap: '12px'
      }}>
        {/* 
          Create an array from 1 to totalSupply
          For each tokenId, render a MemberCard
          
          WHY Array.from():
          - Creates an array of length totalSupply
          - (_, i) => i + 1 converts index to tokenId (1-based)
        */}
        {Array.from({ length: totalSupply }, (_, i) => {
          const tokenId = i + 1
          return (
            <MemberCard 
              key={tokenId} 
              nftAddress={nftAddress}
              tokenId={tokenId} 
            />
          )
        })}
      </div>
    </div>
  )
}

/**
 * Component: MemberCard
 * 
 * Displays a single member's information
 * 
 * HOW IT WORKS:
 * - Takes a tokenId (e.g., 1, 2, 3)
 * - Calls nft.ownerOf(tokenId) to get the owner's address
 * - Displays the address and token ID
 * 
 * CONTRACT FUNCTION USED:
 * function ownerOf(uint256 tokenId) returns (address)
 * - This is a standard ERC721 function
 * - Returns the current owner of the NFT
 */
function MemberCard({ nftAddress, tokenId }) {
  // Read who owns this token ID
  const { data: owner, isLoading } = useReadContract({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    functionName: 'ownerOf',
    args: [BigInt(tokenId)],
  })

  if (isLoading) {
    return (
      <div style={{ 
        padding: '12px', 
        background: '#f8f9fa',
        borderRadius: '4px'
      }}>
        Loading member #{tokenId}...
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '12px', 
      background: '#f8f9fa',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
          Member #{tokenId}
        </div>
        <div style={{ 
          fontFamily: 'monospace', 
          fontSize: '14px',
          color: '#333'
        }}>
          {owner}
        </div>
      </div>
      
      {/* Link to view on Etherscan */}
      <a 
        href={`https://sepolia.etherscan.io/address/${owner}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: '6px 12px',
          background: '#667eea',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '12px'
        }}
      >
        View →
      </a>
    </div>
  )
}
