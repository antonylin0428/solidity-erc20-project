/**
 * Component: VotingChart
 * 
 * PURPOSE:
 * - Display voting progress with visual bars
 * - Show quorum status
 * - Indicate if proposal is passing or failing
 * - Make vote counts easy to understand at a glance
 * 
 * KEY CONCEPTS:
 * 
 * 1. Voting Progress:
 *    - Shows ratio of For vs Against votes
 *    - Color: Green for "For", Red for "Against"
 * 
 * 2. Quorum:
 *    - Minimum number of votes needed for proposal to be valid
 *    - Example: If 50% quorum with 10 members = need 5 total votes
 *    - Shows progress toward meeting quorum
 * 
 * 3. Pass/Fail Status:
 *    - Passing: votesFor > votesAgainst AND quorum met
 *    - Failing: votesAgainst >= votesFor OR quorum not met
 */

import { useReadContract } from 'wagmi'
import MembershipNFTABI from '../../../artifacts/contracts/MembershipNFT.sol/MembershipNFT.json'

export default function VotingChart({ 
  daoAddress,
  nftAddress, 
  proposal, 
  proposalPassed,
  quorumThreshold 
}) {
  // Get total number of members for quorum calculation
  const { data: totalMembers } = useReadContract({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    functionName: 'totalSupply',
    query: {
      enabled: !!nftAddress,
    },
  })

  // Convert BigInt to numbers for calculation
  const votesFor = Number(proposal.votesFor)
  const votesAgainst = Number(proposal.votesAgainst)
  const totalVotes = votesFor + votesAgainst
  const memberCount = totalMembers ? Number(totalMembers) : 0

  /**
   * Calculate voting percentages
   * 
   * MATH EXPLANATION:
   * If votesFor = 7 and votesAgainst = 3:
   * - Total votes = 10
   * - Percentage For = (7 / 10) * 100 = 70%
   * - Percentage Against = (3 / 10) * 100 = 30%
   * 
   * Special case: If no votes yet, show 0%
   */
  const percentageFor = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0
  const percentageAgainst = totalVotes > 0 ? (votesAgainst / totalVotes) * 100 : 0

  /**
   * Calculate quorum requirement
   * 
   * MATH EXPLANATION:
   * If quorumThreshold = 50 (meaning 50%) and totalMembers = 10:
   * - Required votes = (10 * 50) / 100 = 5 votes
   * 
   * Quorum Progress:
   * - If totalVotes = 3 → 60% progress (3/5 * 100)
   * - If totalVotes = 5 → 100% progress (5/5 * 100)
   * - If totalVotes = 7 → 100% progress (capped at 100)
   */
  const requiredVotes = Math.ceil((memberCount * quorumThreshold) / 100)
  const quorumProgress = requiredVotes > 0 
    ? Math.min((totalVotes / requiredVotes) * 100, 100) 
    : 0
  const quorumMet = totalVotes >= requiredVotes

  /**
   * Determine proposal status
   * 
   * LOGIC:
   * - Passing: votesFor > votesAgainst AND quorumMet
   * - Failing: Either not enough votes for OR quorum not met
   * - Tied: Equal votes (counts as failing)
   */
  const isLeading = votesFor > votesAgainst
  const isTied = votesFor === votesAgainst
  const isPassing = proposalPassed || (isLeading && quorumMet)

  // Determine status color
  const statusColor = isPassing ? '#28a745' : isTied ? '#ffc107' : '#dc3545'

  return (
    <div style={{
      padding: '20px',
      background: '#f8f9fa',
      borderRadius: '8px',
      marginBottom: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h4 style={{ margin: 0, color: '#333' }}>Voting Progress</h4>
        <div style={{
          padding: '6px 14px',
          background: `${statusColor}20`,
          border: `2px solid ${statusColor}`,
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: 'bold',
          color: statusColor,
        }}>
          {isPassing ? '✓ Passing' : isTied ? '⚖ Tied' : '✗ Failing'}
        </div>
      </div>

      {/* Vote Counts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '20px',
      }}>
        {/* Votes For */}
        <div style={{
          padding: '16px',
          background: 'white',
          borderRadius: '8px',
          border: '2px solid #28a745',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
            Votes For
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
            {votesFor}
          </div>
          <div style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>
            {percentageFor.toFixed(1)}% of votes
          </div>
        </div>

        {/* Votes Against */}
        <div style={{
          padding: '16px',
          background: 'white',
          borderRadius: '8px',
          border: '2px solid #dc3545',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
            Votes Against
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
            {votesAgainst}
          </div>
          <div style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>
            {percentageAgainst.toFixed(1)}% of votes
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      {totalVotes > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            height: '40px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid #ddd',
          }}>
            {/* For Bar */}
            {votesFor > 0 && (
              <div
                style={{
                  width: `${percentageFor}%`,
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'width 0.3s ease',
                }}
              >
                {percentageFor > 15 && `${percentageFor.toFixed(0)}%`}
              </div>
            )}

            {/* Against Bar */}
            {votesAgainst > 0 && (
              <div
                style={{
                  width: `${percentageAgainst}%`,
                  background: 'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'width 0.3s ease',
                }}
              >
                {percentageAgainst > 15 && `${percentageAgainst.toFixed(0)}%`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quorum Section */}
      <div style={{
        padding: '16px',
        background: quorumMet ? '#d4edda' : '#fff3cd',
        border: `2px solid ${quorumMet ? '#c3e6cb' : '#ffc107'}`,
        borderRadius: '8px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: quorumMet ? '#155724' : '#856404',
              marginBottom: '4px',
            }}>
              {quorumMet ? '✓ Quorum Met' : '⚠ Quorum Required'}
            </div>
            <div style={{
              fontSize: '12px',
              color: quorumMet ? '#155724' : '#856404',
            }}>
              {totalVotes} of {requiredVotes} required votes ({quorumThreshold}% of {memberCount} members)
            </div>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: quorumMet ? '#155724' : '#856404',
          }}>
            {quorumProgress.toFixed(0)}%
          </div>
        </div>

        {/* Quorum Progress Bar */}
        <div style={{
          height: '10px',
          background: 'white',
          borderRadius: '5px',
          overflow: 'hidden',
          border: `1px solid ${quorumMet ? '#c3e6cb' : '#ffc107'}`,
        }}>
          <div
            style={{
              width: `${quorumProgress}%`,
              height: '100%',
              background: quorumMet 
                ? 'linear-gradient(90deg, #28a745 0%, #20c997 100%)'
                : 'linear-gradient(90deg, #ffc107 0%, #ff8c00 100%)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* No Votes Yet Message */}
      {totalVotes === 0 && (
        <div style={{
          padding: '20px',
          background: '#e7f3ff',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#0c5460',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗳️</div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            No votes yet
          </div>
          <div style={{ fontSize: '13px' }}>
            Be the first to vote on this proposal!
          </div>
        </div>
      )}

      {/* Participation Rate */}
      {memberCount > 0 && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: 'white',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#666',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>Participation Rate:</span>
          <span style={{ fontWeight: 'bold', color: '#333' }}>
            {((totalVotes / memberCount) * 100).toFixed(1)}% 
            <span style={{ fontWeight: 'normal', color: '#999' }}>
              {' '}({totalVotes}/{memberCount} members)
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
