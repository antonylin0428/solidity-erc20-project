/**
 * MemberDashboard Component
 * 
 * A personalized dashboard for DAO members showing:
 * - Membership information
 * - Voting statistics
 * - Complete voting history
 * - Participation metrics
 */

import { useReadContract } from 'wagmi'
import ClubDAOABI from '../contracts/ClubDAO.json'
import MembershipNFTABI from '../contracts/MembershipNFT.json'
import MemberStats from './MemberStats'
import VotingHistory from './VotingHistory'
import MembershipInfo from './MembershipInfo'

export default function MemberDashboard({ daoAddress, userAddress, isMember }) {
  // Get NFT address
  const { data: nftAddress } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'membershipNFT',
  })

  // Get total proposal count
  const { data: proposalCount } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'proposalCount',
  })

  // Get user's token ID (if member)
  const { data: userBalance } = useReadContract({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    functionName: 'balanceOf',
    args: [userAddress],
    query: { enabled: !!nftAddress && !!userAddress },
  })

  const { data: userTokenId } = useReadContract({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    functionName: 'tokenOfOwnerByIndex',
    args: [userAddress, 0n],
    query: { enabled: !!nftAddress && !!userAddress && userBalance > 0n },
  })

  // Get DAO name
  const { data: daoName } = useReadContract({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    functionName: 'name',
    query: { enabled: !!nftAddress },
  })

  // Get delegation info
  const { data: delegatedTo } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'delegates',
    args: [userAddress],
    query: { enabled: !!userAddress },
  })

  // If not a member, show message
  if (!isMember) {
    return (
      <div style={{
        padding: '40px',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: '#333', marginBottom: '12px' }}>Member Access Required</h2>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>
          You must be a member of this DAO to view your dashboard.
        </p>
        <div style={{
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '4px',
          color: '#666',
          fontSize: '14px',
        }}>
          💡 Ask an existing member to add you, or acquire a membership NFT.
        </div>
      </div>
    )
  }

  const totalProposals = proposalCount ? Number(proposalCount) : 0
  const isDelegating = delegatedTo && delegatedTo !== userAddress

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', color: '#333', marginBottom: '8px' }}>
          📊 My Dashboard
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Your personal voting history and statistics for {daoName || 'this DAO'}
        </p>
      </div>

      {/* Delegation Notice */}
      {isDelegating && (
        <div style={{
          padding: '16px',
          background: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{ fontSize: '24px' }}>🤝</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', color: '#0066cc', marginBottom: '4px' }}>
              Voting Power Delegated
            </div>
            <div style={{ fontSize: '14px', color: '#0066cc' }}>
              You've delegated your voting power to {delegatedTo.slice(0, 6)}...{delegatedTo.slice(-4)}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
        {/* Left Column - Membership Info & Stats */}
        <div>
          {/* Membership Info Card */}
          <MembershipInfo
            userAddress={userAddress}
            nftAddress={nftAddress}
            tokenId={userTokenId}
            daoName={daoName}
          />

          {/* Stats Card */}
          <MemberStats
            daoAddress={daoAddress}
            userAddress={userAddress}
            totalProposals={totalProposals}
          />
        </div>

        {/* Right Column - Voting History */}
        <div>
          <VotingHistory
            daoAddress={daoAddress}
            userAddress={userAddress}
            totalProposals={totalProposals}
          />
        </div>
      </div>
    </div>
  )
}
