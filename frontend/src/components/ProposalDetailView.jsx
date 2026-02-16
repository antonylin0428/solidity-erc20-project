/**
 * ProposalDetailView Component
 * 
 * A comprehensive, full-page view of a single proposal with:
 * - Complete proposal information
 * - Detailed voting breakdown with voter list
 * - Timeline of events
 * - Action details
 * - Voting interface
 */

import { useReadContract } from 'wagmi'
import { useClubDAO } from '../hooks/useClubDAO'
import { useToast } from '../hooks/useToast'
import ClubDAOABI from '../contracts/ClubDAO.json'
import MembershipNFTABI from '../contracts/MembershipNFT.json'
import ProposalActionPreview from './ProposalActionPreview'
import VotingChart from './VotingChart'
import ProposalTimeline from './ProposalTimeline'
import VoterList from './VoterList'

export default function ProposalDetailView({ daoAddress, proposalId, isMember, userAddress, onBack }) {
  const toast = useToast()

  // Fetch proposal data
  const { data: proposal, isLoading: proposalLoading } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'getProposal',
    args: [BigInt(proposalId)],
  })

  // Fetch membership NFT address
  const { data: membershipNFTAddress } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'membershipNFT',
  })

  // Fetch quorum threshold
  const { data: quorumThreshold } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'quorumThreshold',
  })

  // Check if user has voted
  const { data: hasVoted } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'hasVoted',
    args: [BigInt(proposalId), userAddress],
    query: { enabled: !!userAddress },
  })

  // Get user's vote direction
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
  })

  // Get DAO settings
  const { data: votingPeriodDays } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'votingPeriod',
  })

  // Vote and execute functions
  const { vote, executeProposal, isPending, isConfirming } = useClubDAO(daoAddress)

  // Loading state
  if (proposalLoading || !proposal) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading proposal details...</div>
      </div>
    )
  }

  // Calculate time-related values
  const deadline = Number(proposal.deadline) * 1000
  const now = Date.now()
  const isExpired = now > deadline
  const canExecute = proposalPassed && isExpired && !proposal.executed
  const timeRemaining = deadline - now
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
  const daysRemaining = Math.floor(hoursRemaining / 24)

  // Handle voting
  const handleVote = async (support) => {
    try {
      await vote(proposalId, support)
      toast.success(`Vote cast ${support ? 'FOR' : 'AGAINST'} successfully!`)
      setTimeout(() => window.location.reload(), 2000)
    } catch (error) {
      console.error('Vote error:', error)
      toast.error('Failed to cast vote. Please try again.')
    }
  }

  // Handle execution
  const handleExecute = async () => {
    try {
      await executeProposal(proposalId)
      toast.success('Proposal executed successfully!')
      setTimeout(() => window.location.reload(), 2000)
    } catch (error) {
      console.error('Execution error:', error)
      toast.error('Failed to execute proposal. Please try again.')
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header with Back Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            background: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          ← Back to Proposals
        </button>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column - Main Content */}
        <div>
          {/* Proposal Header Card */}
          <div style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>
                Proposal #{proposalId}
              </h1>
              <div style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                background: proposal.executed ? '#d4edda' : canExecute ? '#d1ecf1' : isExpired ? '#f8d7da' : '#fff3cd',
                color: proposal.executed ? '#155724' : canExecute ? '#0c5460' : isExpired ? '#721c24' : '#856404',
              }}>
                {proposal.executed ? '✓ Executed' : canExecute ? '⚡ Ready to Execute' : isExpired ? '⏱ Expired' : '🔴 Active'}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#666', fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Description</h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
              }}>
                {proposal.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Proposer</div>
                <div style={{ fontSize: '14px', fontFamily: 'monospace', color: '#333' }}>
                  {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                </div>
                <a
                  href={`https://etherscan.io/address/${proposal.proposer}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: '#667eea' }}
                >
                  View on Etherscan ↗
                </a>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Deadline</div>
                <div style={{ fontSize: '14px', color: '#333' }}>
                  {new Date(deadline).toLocaleString()}
                </div>
                {!isExpired && (
                  <div style={{ fontSize: '12px', color: '#667eea', marginTop: '4px' }}>
                    {daysRemaining > 0 ? `${daysRemaining} days remaining` : `${hoursRemaining} hours remaining`}
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Voting Period</div>
                <div style={{ fontSize: '14px', color: '#333' }}>
                  {votingPeriodDays ? `${votingPeriodDays.toString()} days` : 'Loading...'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Required Quorum</div>
                <div style={{ fontSize: '14px', color: '#333' }}>
                  {quorumThreshold ? `${quorumThreshold.toString()}%` : 'Loading...'}
                </div>
              </div>
            </div>
          </div>

          {/* Proposed Action Card */}
          <div style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>Proposed Action</h2>
            <ProposalActionPreview proposal={proposal} />
          </div>

          {/* Voting Chart */}
          {membershipNFTAddress && (
            <div style={{
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              <VotingChart
                daoAddress={daoAddress}
                nftAddress={membershipNFTAddress}
                proposal={proposal}
                proposalPassed={proposalPassed}
                quorumThreshold={quorumThreshold ? Number(quorumThreshold) : 50}
              />
            </div>
          )}

          {/* Voter List */}
          {membershipNFTAddress && (
            <div style={{
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              <VoterList
                daoAddress={daoAddress}
                nftAddress={membershipNFTAddress}
                proposalId={proposalId}
              />
            </div>
          )}
        </div>

        {/* Right Column - Actions & Timeline */}
        <div>
          {/* Voting Actions Card */}
          <div style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: '24px',
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Actions</h3>

            {/* User's Vote Status */}
            {hasVoted && (
              <div style={{
                padding: '12px',
                background: '#e7f3ff',
                border: '1px solid #b3d9ff',
                borderRadius: '4px',
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '14px', color: '#0066cc', fontWeight: 'bold' }}>
                  ✓ You voted {voteDirection ? 'FOR' : 'AGAINST'}
                </div>
              </div>
            )}

            {/* Vote Buttons */}
            {!isExpired && !proposal.executed && isMember && !hasVoted && (
              <div style={{ marginBottom: '16px' }}>
                <button
                  onClick={() => handleVote(true)}
                  disabled={isPending || isConfirming}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: isPending || isConfirming ? '#ccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                    marginBottom: '8px',
                  }}
                >
                  {isPending || isConfirming ? 'Voting...' : '👍 Vote FOR'}
                </button>
                <button
                  onClick={() => handleVote(false)}
                  disabled={isPending || isConfirming}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: isPending || isConfirming ? '#ccc' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isPending || isConfirming ? 'Voting...' : '👎 Vote AGAINST'}
                </button>
              </div>
            )}

            {/* Execute Button */}
            {canExecute && (
              <button
                onClick={handleExecute}
                disabled={isPending || isConfirming}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: isPending || isConfirming ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                }}
              >
                {isPending || isConfirming ? 'Executing...' : '⚡ Execute Proposal'}
              </button>
            )}

            {/* Info Messages */}
            {!isMember && (
              <div style={{
                padding: '12px',
                background: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#856404',
              }}>
                ⚠️ Only members can vote
              </div>
            )}

            {isExpired && !proposal.executed && !canExecute && (
              <div style={{
                padding: '12px',
                background: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#721c24',
              }}>
                ⏱ This proposal has expired without passing
              </div>
            )}

            {proposal.executed && (
              <div style={{
                padding: '12px',
                background: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#155724',
              }}>
                ✓ This proposal has been executed
              </div>
            )}
          </div>

          {/* Timeline Card */}
          <div style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Timeline</h3>
            <ProposalTimeline
              proposal={proposal}
              proposalId={proposalId}
              deadline={deadline}
              isExpired={isExpired}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
