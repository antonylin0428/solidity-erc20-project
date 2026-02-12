/**
 * EventMonitor Component
 * 
 * Coordinates real-time event monitoring for a DAO:
 * - Sets up event watchers
 * - Maintains event history
 * - Shows live monitoring indicator
 * - Displays activity feed
 */

import { useState, useCallback } from 'react'
import { useDAOEvents } from '../hooks/useDAOEvents'
import ActivityFeed from './ActivityFeed'

export default function EventMonitor({ daoAddress, nftAddress, onDataUpdate }) {
  const [events, setEvents] = useState([])

  // Generate unique event ID
  const generateEventId = () => `${Date.now()}-${Math.random()}`

  // Handler for new proposal events
  const handleProposalCreated = useCallback((proposalId, proposer, description) => {
    const newEvent = {
      id: generateEventId(),
      type: 'ProposalCreated',
      title: `New Proposal #${proposalId?.toString()}`,
      description: description?.substring(0, 100) || 'No description',
      timestamp: Date.now(),
      data: { proposalId, proposer, description },
    }
    
    setEvents(prev => [newEvent, ...prev])
    
    // Trigger data refresh in parent
    onDataUpdate?.()
  }, [onDataUpdate])

  // Handler for vote cast events
  const handleVoteCast = useCallback((voter, proposalId, support) => {
    const newEvent = {
      id: generateEventId(),
      type: 'VoteCast',
      title: `Vote cast on Proposal #${proposalId?.toString()}`,
      description: `${support ? 'FOR' : 'AGAINST'} by ${voter?.slice(0, 6)}...${voter?.slice(-4)}`,
      timestamp: Date.now(),
      data: { voter, proposalId, support },
    }
    
    setEvents(prev => [newEvent, ...prev])
    
    // Trigger data refresh in parent
    onDataUpdate?.()
  }, [onDataUpdate])

  // Handler for proposal executed events
  const handleProposalExecuted = useCallback((proposalId) => {
    const newEvent = {
      id: generateEventId(),
      type: 'ProposalExecuted',
      title: `Proposal #${proposalId?.toString()} executed`,
      description: 'On-chain action completed successfully',
      timestamp: Date.now(),
      data: { proposalId },
    }
    
    setEvents(prev => [newEvent, ...prev])
    
    // Trigger data refresh in parent
    onDataUpdate?.()
  }, [onDataUpdate])

  // Handler for new member events
  const handleMemberAdded = useCallback((memberAddress, tokenId) => {
    const newEvent = {
      id: generateEventId(),
      type: 'MemberAdded',
      title: 'New member joined',
      description: `${memberAddress?.slice(0, 6)}...${memberAddress?.slice(-4)} received Token #${tokenId?.toString()}`,
      timestamp: Date.now(),
      data: { memberAddress, tokenId },
    }
    
    setEvents(prev => [newEvent, ...prev])
    
    // Trigger data refresh in parent
    onDataUpdate?.()
  }, [onDataUpdate])

  // Set up event monitoring with callbacks
  const { isMonitoring } = useDAOEvents(daoAddress, nftAddress, {
    onProposalCreated: handleProposalCreated,
    onVoteCast: handleVoteCast,
    onProposalExecuted: handleProposalExecuted,
    onMemberAdded: handleMemberAdded,
    showNotifications: true,
  })

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Monitoring Status Banner */}
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            background: '#28a745',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
            boxShadow: '0 0 8px rgba(40, 167, 69, 0.8)',
          }} />
          <div>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
              🔔 Real-time Monitoring Active
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
              Watching for proposals, votes, and member changes
            </div>
          </div>
        </div>
        <div style={{
          padding: '4px 12px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          fontSize: '12px',
          color: 'white',
          fontWeight: 'bold',
        }}>
          {events.length} Events
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed events={events} maxEvents={10} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
