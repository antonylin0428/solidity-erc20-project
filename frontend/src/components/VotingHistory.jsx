/**
 * VotingHistory Component
 * 
 * Displays a chronological list of all proposals the user voted on:
 * - Proposal description
 * - Vote direction (FOR/AGAINST)
 * - Proposal status
 * - Link to view details
 */

import { useReadContract } from 'wagmi'
import { useMemo } from 'react'
import ClubDAOABI from '../contracts/ClubDAO.json'

function VoteHistoryItem({ daoAddress, proposalId, userAddress }) {
  // Get proposal data
  const { data: proposal } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'getProposal',
    args: [BigInt(proposalId)],
  })

  // Check if user voted
  const { data: hasVoted } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'hasVoted',
    args: [BigInt(proposalId), userAddress],
    query: { enabled: !!userAddress },
  })

  // Get vote direction
  const { data: voteDirection } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'voteDirection',
    args: [BigInt(proposalId), userAddress],
    query: { enabled: !!userAddress && hasVoted },
  })

  // Check if proposal passed
  const { data: proposalPassed } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'proposalPassed',
    args: [BigInt(proposalId)],
    query: { enabled: !!proposal },
  })

  // Don't render if user didn't vote on this proposal
  if (!hasVoted || !proposal) return null

  const deadline = Number(proposal.deadline) * 1000
  const isExpired = Date.now() > deadline

  return (
    <div style={{
      padding: '16px',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '12px',
      transition: 'all 0.2s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#667eea'
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#ddd'
      e.currentTarget.style.boxShadow = 'none'
    }}>
      {/* Header with Proposal ID and Vote Badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '8px',
      }}>
        <div style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
          Proposal #{proposalId}
        </div>
        <div style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          background: voteDirection ? '#d4edda' : '#f8d7da',
          color: voteDirection ? '#155724' : '#721c24',
        }}>
          {voteDirection ? '👍 FOR' : '👎 AGAINST'}
        </div>
      </div>

      {/* Proposal Description */}
      <p style={{
        color: '#666',
        fontSize: '13px',
        margin: '8px 0',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {proposal.description}
      </p>

      {/* Footer with Status and Vote Count */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #f0f0f0',
        fontSize: '12px',
      }}>
        <div style={{ display: 'flex', gap: '16px', color: '#666' }}>
          <span>👍 {Number(proposal.votesFor)}</span>
          <span>👎 {Number(proposal.votesAgainst)}</span>
        </div>
        <div style={{
          padding: '2px 8px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: 'bold',
          background: proposal.executed ? '#d4edda' : isExpired ? (proposalPassed ? '#d1ecf1' : '#f8d7da') : '#fff3cd',
          color: proposal.executed ? '#155724' : isExpired ? (proposalPassed ? '#0c5460' : '#721c24') : '#856404',
        }}>
          {proposal.executed ? 'Executed' : isExpired ? (proposalPassed ? 'Passed' : 'Failed') : 'Active'}
        </div>
      </div>

      {/* Result indicator - Did their vote align with outcome? */}
      {isExpired && !proposal.executed && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: (voteDirection && proposalPassed) || (!voteDirection && !proposalPassed) ? '#e7f3ff' : '#fff3cd',
          borderRadius: '4px',
          fontSize: '11px',
          color: (voteDirection && proposalPassed) || (!voteDirection && !proposalPassed) ? '#0066cc' : '#856404',
        }}>
          {(voteDirection && proposalPassed) || (!voteDirection && !proposalPassed)
            ? '✓ Your vote aligned with the outcome'
            : '⚠ Your vote was in the minority'}
        </div>
      )}
    </div>
  )
}

export default function VotingHistory({ daoAddress, userAddress, totalProposals }) {
  // Generate list of proposal IDs (newest first)
  const proposalIds = useMemo(() => {
    if (!totalProposals) return []
    return Array.from({ length: totalProposals }, (_, i) => totalProposals - i)
  }, [totalProposals])

  return (
    <div style={{
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', color: '#333' }}>
        🗳️ Voting History
      </h3>

      {proposalIds.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: '#f8f9fa',
          borderRadius: '8px',
          color: '#666',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>No proposals yet</div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            When proposals are created, your voting history will appear here
          </div>
        </div>
      ) : (
        <>
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '16px',
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '4px',
          }}>
            💡 Showing all proposals. Only proposals you voted on will be highlighted.
          </div>

          <div style={{
            maxHeight: '600px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}>
            {proposalIds.map(proposalId => (
              <VoteHistoryItem
                key={proposalId}
                daoAddress={daoAddress}
                proposalId={proposalId}
                userAddress={userAddress}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
