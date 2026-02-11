/**
 * Component: ProposalActionPreview
 * 
 * PURPOSE:
 * - Display what a proposal will do in human-readable format
 * - Show decoded action details
 * - Warn users about high-value transfers
 * 
 * HOW IT WORKS:
 * - Uses proposalDecoder utility to parse actionData
 * - Displays the action with appropriate styling
 * - Shows warnings for risky actions
 */

import { decodeProposalAction, getActionColor } from '../utils/proposalDecoder'

export default function ProposalActionPreview({ proposal, compact = false }) {
  // Decode the proposal action
  const action = decodeProposalAction(proposal)

  // Compact view for lists
  if (compact) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        background: `${getActionColor(action.type)}15`,
        border: `1px solid ${getActionColor(action.type)}40`,
        borderRadius: '12px',
        fontSize: '13px',
        color: getActionColor(action.type),
        fontWeight: '500',
      }}>
        <span>{action.icon}</span>
        <span>{action.description}</span>
      </div>
    )
  }

  // Full view for proposal details
  return (
    <div style={{
      padding: '16px',
      background: `${getActionColor(action.type)}08`,
      border: `2px solid ${getActionColor(action.type)}30`,
      borderRadius: '8px',
      marginBottom: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px',
      }}>
        <div style={{ fontSize: '28px' }}>
          {action.icon}
        </div>
        <div>
          <div style={{
            fontSize: '12px',
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '600',
            marginBottom: '2px',
          }}>
            Proposed Action
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
          }}>
            {action.description}
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{
        padding: '12px',
        background: 'white',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#555',
        lineHeight: '1.6',
      }}>
        {action.details}
      </div>

      {/* Additional Information */}
      {action.targetAddress && (
        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: 'white',
          borderRadius: '6px',
          fontSize: '13px',
        }}>
          <div style={{ color: '#666', marginBottom: '4px', fontWeight: '600' }}>
            Target Address:
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#333',
            wordBreak: 'break-all',
          }}>
            {action.targetAddress}
          </div>
          <a
            href={`https://sepolia.etherscan.io/address/${action.targetAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '12px',
              color: getActionColor(action.type),
              marginTop: '4px',
              display: 'inline-block',
            }}
          >
            View on Etherscan →
          </a>
        </div>
      )}

      {/* High Value Warning */}
      {action.type === 'payment' && action.amount && parseFloat(action.amount) > 0.1 && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'start',
          gap: '10px',
        }}>
          <div style={{ fontSize: '20px' }}>⚠️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', color: '#856404', marginBottom: '4px' }}>
              High Value Transfer
            </div>
            <div style={{ fontSize: '13px', color: '#856404' }}>
              This proposal will transfer {action.amount} ETH. Please verify the recipient address carefully before voting.
            </div>
          </div>
        </div>
      )}

      {/* Unknown Action Warning */}
      {action.type === 'unknown' && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'start',
          gap: '10px',
        }}>
          <div style={{ fontSize: '20px' }}>⚠️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', color: '#856404', marginBottom: '4px' }}>
              Custom Action
            </div>
            <div style={{ fontSize: '13px', color: '#856404', marginBottom: '8px' }}>
              This proposal contains a custom smart contract call that cannot be automatically decoded. 
              Review the raw data carefully.
            </div>
            {action.rawData && (
              <details style={{ marginTop: '8px' }}>
                <summary style={{
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#856404',
                }}>
                  Show raw data
                </summary>
                <div style={{
                  marginTop: '8px',
                  padding: '8px',
                  background: '#fff',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  wordBreak: 'break-all',
                  color: '#333',
                }}>
                  {action.rawData}
                </div>
              </details>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {action.type === 'error' && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '6px',
          color: '#721c24',
          fontSize: '13px',
        }}>
          <strong>Decoding Error:</strong> Unable to parse this proposal's action data. 
          This may be a complex or non-standard action. Proceed with caution.
        </div>
      )}

      {/* Settings Change Info */}
      {(action.type === 'setVotingPeriod' || action.type === 'setQuorum') && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#0c5460',
        }}>
          <strong>💡 Note:</strong> This setting change will only affect future proposals, 
          not currently active ones.
        </div>
      )}
    </div>
  )
}
