/**
 * VoterList Component
 * 
 * Displays a list of all members and their voting status:
 * - Who voted FOR
 * - Who voted AGAINST
 * - Who hasn't voted yet
 */

import { useReadContract } from 'wagmi'
import MembershipNFTABI from '../../../artifacts/contracts/MembershipNFT.sol/MembershipNFT.json'
import ClubDAOABI from '../../../artifacts/contracts/ClubDAO.sol/ClubDAO.json'

function VoterCard({ memberAddress, hasVoted, voteDirection, isLoading }) {
  if (isLoading) {
    return (
      <div style={{
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '4px',
        marginBottom: '8px',
      }}>
        <div style={{ fontSize: '14px', color: '#999' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '12px',
      background: hasVoted
        ? (voteDirection ? '#e7f8ed' : '#fee')
        : '#f8f9fa',
      border: `1px solid ${hasVoted ? (voteDirection ? '#c3e6cb' : '#f5c6cb') : '#e9ecef'}`,
      borderRadius: '4px',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '14px',
          fontFamily: 'monospace',
          color: '#333',
          marginBottom: '4px',
        }}>
          {memberAddress.slice(0, 6)}...{memberAddress.slice(-4)}
        </div>
        <a
          href={`https://etherscan.io/address/${memberAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '12px', color: '#667eea' }}
        >
          View on Etherscan ↗
        </a>
      </div>
      <div style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        background: hasVoted
          ? (voteDirection ? '#28a745' : '#dc3545')
          : '#6c757d',
        color: 'white',
      }}>
        {hasVoted ? (voteDirection ? '👍 FOR' : '👎 AGAINST') : '⏳ Not Voted'}
      </div>
    </div>
  )
}

export default function VoterList({ daoAddress, nftAddress, proposalId }) {
  // Get total supply of membership NFTs
  const { data: totalSupply } = useReadContract({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    functionName: 'totalSupply',
  })

  const memberCount = totalSupply ? Number(totalSupply) : 0

  // Generate array of token IDs
  const tokenIds = Array.from({ length: memberCount }, (_, i) => i + 1)

  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>
        Voting Breakdown ({memberCount} members)
      </h2>

      {memberCount === 0 ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          background: '#f8f9fa',
          borderRadius: '4px',
          color: '#666',
        }}>
          No members yet
        </div>
      ) : (
        <div>
          {tokenIds.map(tokenId => (
            <MemberVoteStatus
              key={tokenId}
              nftAddress={nftAddress}
              tokenId={tokenId}
              daoAddress={daoAddress}
              proposalId={proposalId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Helper component to fetch and display a single member's vote status
 */
function MemberVoteStatus({ nftAddress, tokenId, daoAddress, proposalId }) {
  // Get member address from token ID
  const { data: memberAddress, isLoading: addressLoading } = useReadContract({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    functionName: 'ownerOf',
    args: [BigInt(tokenId)],
  })

  // Check if member voted
  const { data: hasVoted, isLoading: votedLoading } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'hasVoted',
    args: [BigInt(proposalId), memberAddress],
    query: { enabled: !!memberAddress },
  })

  // Get vote direction
  const { data: voteDirection, isLoading: directionLoading } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'voteDirection',
    args: [BigInt(proposalId), memberAddress],
    query: { enabled: !!memberAddress && hasVoted },
  })

  const isLoading = addressLoading || votedLoading || directionLoading

  if (!memberAddress) return null

  return (
    <VoterCard
      memberAddress={memberAddress}
      hasVoted={hasVoted}
      voteDirection={voteDirection}
      isLoading={isLoading}
    />
  )
}
