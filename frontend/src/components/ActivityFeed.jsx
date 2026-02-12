/**
 * ActivityFeed Component
 * 
 * Displays a live feed of recent DAO events:
 * - Proposals created
 * - Votes cast
 * - Proposals executed
 * - New members added
 * 
 * Updates in real-time as events occur
 */

import { useState, useEffect } from 'react'

export default function ActivityFeed({ events = [], maxEvents = 10 }) {
  const [displayEvents, setDisplayEvents] = useState([])

  useEffect(() => {
    // Keep only the most recent events
    setDisplayEvents(events.slice(0, maxEvents))
  }, [events, maxEvents])

  if (displayEvents.length === 0) {
    return (
      <div style={{
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', color: '#333' }}>
          📡 Recent Activity
        </h3>
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: '#f8f9fa',
          borderRadius: '8px',
          color: '#666',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔇</div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>No recent activity</div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            Events will appear here as they happen
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
          📡 Recent Activity
        </h3>
        <div style={{
          padding: '4px 8px',
          background: '#d4edda',
          color: '#155724',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            background: '#28a745',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
          }} />
          Live
        </div>
      </div>

      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '8px',
      }}>
        {displayEvents.map((event, index) => (
          <ActivityItem key={event.id || index} event={event} isNew={index === 0} />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

function ActivityItem({ event, isNew }) {
  const getEventIcon = (type) => {
    switch (type) {
      case 'ProposalCreated':
        return '📋'
      case 'VoteCast':
        return '🗳️'
      case 'ProposalExecuted':
        return '⚡'
      case 'MemberAdded':
        return '👥'
      default:
        return '📌'
    }
  }

  const getEventColor = (type) => {
    switch (type) {
      case 'ProposalCreated':
        return '#667eea'
      case 'VoteCast':
        return '#17a2b8'
      case 'ProposalExecuted':
        return '#28a745'
      case 'MemberAdded':
        return '#ffc107'
      default:
        return '#6c757d'
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div style={{
      padding: '12px',
      marginBottom: '8px',
      background: isNew ? '#e7f3ff' : '#f8f9fa',
      border: `1px solid ${isNew ? '#b3d9ff' : '#e9ecef'}`,
      borderRadius: '8px',
      display: 'flex',
      gap: '12px',
      alignItems: 'start',
      animation: isNew ? 'slideIn 0.3s ease-out' : 'none',
    }}>
      {/* Icon */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: getEventColor(event.type),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        flexShrink: 0,
      }}>
        {getEventIcon(event.type)}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '4px',
        }}>
          {event.title}
        </div>
        {event.description && (
          <div style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {event.description}
          </div>
        )}
        <div style={{
          fontSize: '12px',
          color: '#999',
        }}>
          {formatTimestamp(event.timestamp)}
        </div>
      </div>

      {/* New badge */}
      {isNew && (
        <div style={{
          padding: '2px 8px',
          background: '#667eea',
          color: 'white',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 'bold',
          flexShrink: 0,
        }}>
          NEW
        </div>
      )}
    </div>
  )
}
