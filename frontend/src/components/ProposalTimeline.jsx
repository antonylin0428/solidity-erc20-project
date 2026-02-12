/**
 * ProposalTimeline Component
 * 
 * Displays a chronological timeline of proposal events:
 * - Proposal created
 * - Voting period ends
 * - Execution (if applicable)
 */

export default function ProposalTimeline({ proposal, proposalId, deadline, isExpired }) {
  // Calculate creation time (deadline - voting period)
  // Note: We don't have the exact creation time from the contract,
  // so we estimate based on deadline and voting period
  
  const now = Date.now()
  const events = []

  // Event 1: Proposal Created (always first)
  events.push({
    title: 'Proposal Created',
    description: `Proposal #${proposalId} was created`,
    timestamp: null, // We don't have exact creation time
    icon: '✨',
    color: '#667eea',
    status: 'completed',
  })

  // Event 2: Voting Activity
  const totalVotes = Number(proposal.votesFor) + Number(proposal.votesAgainst)
  if (totalVotes > 0) {
    events.push({
      title: 'Votes Cast',
      description: `${totalVotes} vote${totalVotes === 1 ? '' : 's'} received (${Number(proposal.votesFor)} for, ${Number(proposal.votesAgainst)} against)`,
      timestamp: null,
      icon: '🗳️',
      color: '#28a745',
      status: 'completed',
    })
  }

  // Event 3: Voting Period Ends
  events.push({
    title: isExpired ? 'Voting Ended' : 'Voting Ends',
    description: new Date(deadline).toLocaleString(),
    timestamp: deadline,
    icon: isExpired ? '🔒' : '⏰',
    color: isExpired ? '#6c757d' : '#ffc107',
    status: isExpired ? 'completed' : 'pending',
  })

  // Event 4: Execution (if executed)
  if (proposal.executed) {
    events.push({
      title: 'Proposal Executed',
      description: 'Action was successfully executed on-chain',
      timestamp: null,
      icon: '✅',
      color: '#28a745',
      status: 'completed',
    })
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Timeline Line */}
      <div style={{
        position: 'absolute',
        left: '15px',
        top: '8px',
        bottom: '8px',
        width: '2px',
        background: '#e9ecef',
        zIndex: 0,
      }} />

      {/* Timeline Events */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {events.map((event, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: index === events.length - 1 ? 0 : '24px',
            }}
          >
            {/* Icon Circle */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: event.status === 'completed' ? event.color : 'white',
              border: `2px solid ${event.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              flexShrink: 0,
              opacity: event.status === 'pending' ? 0.6 : 1,
            }}>
              {event.icon}
            </div>

            {/* Event Content */}
            <div style={{ flex: 1, paddingTop: '2px' }}>
              <div style={{
                fontWeight: 'bold',
                fontSize: '14px',
                color: event.status === 'completed' ? '#333' : '#666',
                marginBottom: '4px',
              }}>
                {event.title}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#666',
                lineHeight: '1.4',
              }}>
                {event.description}
              </div>
              {event.timestamp && event.status === 'pending' && (
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginTop: '4px',
                }}>
                  {Math.floor((event.timestamp - now) / (1000 * 60 * 60))} hours remaining
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
