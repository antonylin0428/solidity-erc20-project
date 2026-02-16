/**
 * MemberStats Component
 * 
 * Displays voting statistics and participation metrics:
 * - Total proposals voted on
 * - Participation rate
 * - Votes FOR vs AGAINST
 * - Recent activity
 */

import { useReadContract } from 'wagmi'
import { useMemo } from 'react'
import ClubDAOABI from '../contracts/ClubDAO.json'

export default function MemberStats({ daoAddress, userAddress, totalProposals }) {
  // Calculate voting stats by checking all proposals
  const proposalIds = useMemo(() => {
    if (!totalProposals) return []
    return Array.from({ length: totalProposals }, (_, i) => i + 1)
  }, [totalProposals])

  // Count how many proposals the user voted on
  let votesCount = 0
  let votesFor = 0
  let votesAgainst = 0

  // We'll query a sample of recent proposals (last 10) for stats
  // In production, you might want to use events or backend indexing
  const recentProposals = proposalIds.slice(-10)

  const votingData = recentProposals.map(proposalId => {
    const { data: hasVoted } = useReadContract({
      address: daoAddress,
      abi: ClubDAOABI.abi,
      functionName: 'hasVoted',
      args: [BigInt(proposalId), userAddress],
      query: { enabled: !!userAddress },
    })

    const { data: voteDirection } = useReadContract({
      address: daoAddress,
      abi: ClubDAOABI.abi,
      functionName: 'voteDirection',
      args: [BigInt(proposalId), userAddress],
      query: { enabled: !!userAddress && hasVoted },
    })

    return { hasVoted, voteDirection }
  })

  // Calculate stats from recent proposals
  votingData.forEach(({ hasVoted, voteDirection }) => {
    if (hasVoted) {
      votesCount++
      if (voteDirection) {
        votesFor++
      } else {
        votesAgainst++
      }
    }
  })

  const participationRate = recentProposals.length > 0
    ? Math.round((votesCount / recentProposals.length) * 100)
    : 0

  return (
    <div style={{
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', color: '#333' }}>
        📈 Voting Statistics
      </h3>

      {/* Participation Rate - Big Number */}
      <div style={{
        textAlign: 'center',
        padding: '24px',
        background: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
          Participation Rate (Last 10 Proposals)
        </div>
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: participationRate >= 70 ? '#28a745' : participationRate >= 40 ? '#ffc107' : '#dc3545',
          lineHeight: '1',
          marginBottom: '4px',
        }}>
          {participationRate}%
        </div>
        <div style={{ fontSize: '13px', color: '#666' }}>
          {votesCount} of {recentProposals.length} proposals
        </div>
      </div>

      {/* Voting Breakdown */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
          Voting Breakdown
        </div>

        {/* Votes For */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
            fontSize: '13px',
          }}>
            <span style={{ color: '#666' }}>👍 Votes FOR</span>
            <span style={{ fontWeight: 'bold', color: '#28a745' }}>{votesFor}</span>
          </div>
          <div style={{
            height: '8px',
            background: '#e9ecef',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: '#28a745',
              width: votesCount > 0 ? `${(votesFor / votesCount) * 100}%` : '0%',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Votes Against */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
            fontSize: '13px',
          }}>
            <span style={{ color: '#666' }}>👎 Votes AGAINST</span>
            <span style={{ fontWeight: 'bold', color: '#dc3545' }}>{votesAgainst}</span>
          </div>
          <div style={{
            height: '8px',
            background: '#e9ecef',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: '#dc3545',
              width: votesCount > 0 ? `${(votesAgainst / votesCount) * 100}%` : '0%',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Additional Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #e9ecef',
      }}>
        <div style={{ textAlign: 'center', padding: '12px', background: '#f8f9fa', borderRadius: '4px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginBottom: '4px' }}>
            {votesCount}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Votes</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', background: '#f8f9fa', borderRadius: '4px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginBottom: '4px' }}>
            {totalProposals}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Proposals</div>
        </div>
      </div>

      {/* Engagement Level Badge */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        background: participationRate >= 70 ? '#d4edda' : participationRate >= 40 ? '#fff3cd' : '#f8d7da',
        border: `1px solid ${participationRate >= 70 ? '#c3e6cb' : participationRate >= 40 ? '#ffc107' : '#f5c6cb'}`,
        borderRadius: '4px',
        textAlign: 'center',
      }}>
        <div style={{
          color: participationRate >= 70 ? '#155724' : participationRate >= 40 ? '#856404' : '#721c24',
          fontSize: '13px',
          fontWeight: 'bold',
        }}>
          {participationRate >= 70 ? '🌟 Highly Active' : participationRate >= 40 ? '⚡ Moderately Active' : '😴 Low Activity'}
        </div>
      </div>
    </div>
  )
}
