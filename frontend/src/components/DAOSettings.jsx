/**
 * Component: DAOSettings
 * 
 * PURPOSE:
 * - Display current DAO settings (voting period, quorum)
 * - Show history of settings changes
 * - Link to create proposals to change settings
 * 
 * PROPS:
 * - daoAddress: The ClubDAO contract address
 * - votingPeriod: Current voting period in seconds
 * - quorumThreshold: Current quorum percentage
 */

import { useState } from 'react'

export default function DAOSettings({ daoAddress, votingPeriod, quorumThreshold }) {
  const [showInfo, setShowInfo] = useState(false)

  const votingPeriodDays = votingPeriod ? votingPeriod / (24 * 60 * 60) : 0

  return (
    <div style={{ 
      padding: '24px', 
      background: '#f8f9fa', 
      borderRadius: '8px',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: '#333' }}>DAO Settings</h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showInfo ? 'Hide Info' : 'Show Info'}
        </button>
      </div>

      {/* Current Settings Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: showInfo ? '20px' : '0' }}>
        {/* Voting Period Card */}
        <div style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '8px',
          border: '2px solid #667eea'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            Voting Period
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea', marginBottom: '8px' }}>
            {votingPeriodDays} days
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            How long members have to vote on proposals
          </div>
        </div>

        {/* Quorum Threshold Card */}
        <div style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '8px',
          border: '2px solid #667eea'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            Quorum Threshold
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea', marginBottom: '8px' }}>
            {quorumThreshold}%
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            Minimum percentage needed for proposals to pass
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div style={{ 
          padding: '16px', 
          background: '#e7f3ff', 
          borderRadius: '8px',
          border: '1px solid #b3d9ff'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#0c5460' }}>How to Change Settings</h4>
          <div style={{ fontSize: '14px', color: '#0c5460', lineHeight: '1.6' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              DAO settings can only be changed through governance proposals:
            </p>
            <ol style={{ margin: '0 0 12px 16px', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Create a Proposal:</strong> Use the "Create Proposal" section above and select either "Change Voting Period" or "Change Quorum Threshold"
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Vote on Proposal:</strong> Members vote on whether to approve the change
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Execute Proposal:</strong> If passed, anyone can execute the proposal to apply the new settings
              </li>
            </ol>
            <div style={{ 
              padding: '12px', 
              background: '#fff3cd', 
              borderRadius: '4px',
              fontSize: '13px',
              color: '#856404'
            }}>
              💡 <strong>Tip:</strong> Changing settings requires member consensus. Make sure to discuss proposed changes with other members before creating a proposal.
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ 
        marginTop: '16px',
        padding: '16px', 
        background: 'white', 
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          Current Configuration
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
          <div>
            <span style={{ color: '#999' }}>Voting Duration:</span>
            <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>
              {votingPeriod ? `${(votingPeriod / 3600).toFixed(0)} hours` : 'N/A'}
            </span>
          </div>
          <div>
            <span style={{ color: '#999' }}>Min Votes to Pass:</span>
            <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>
              {quorumThreshold}% of members
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
