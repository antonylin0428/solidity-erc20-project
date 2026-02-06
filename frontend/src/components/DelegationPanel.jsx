import { useState } from 'react'
import { isAddress } from 'viem'
import { useDelegation } from '../hooks/useDelegation'

export default function DelegationPanel({ daoAddress, userAddress, isMember }) {
  const [delegateAddress, setDelegateAddress] = useState('')
  const [showForm, setShowForm] = useState(false)

  const {
    hasDelegated,
    delegatedTo,
    delegators,
    votingPower,
    delegate,
    revokeDelegation,
    isPending,
    isConfirming,
    error,
  } = useDelegation(daoAddress, userAddress)

  const handleDelegate = async (e) => {
    e.preventDefault()
    if (!isAddress(delegateAddress)) {
      alert('Invalid address')
      return
    }
    try {
      await delegate(delegateAddress)
      setDelegateAddress('')
      setShowForm(false)
    } catch (err) {
      alert('Failed to delegate')
    }
  }

  return (
    <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '24px' }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Delegation</h3>
      
      <div style={{ padding: '16px', background: 'white', borderRadius: '8px', marginBottom: '16px', border: '2px solid #667eea' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>Your Voting Power</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
          {votingPower} {votingPower === 1 ? 'vote' : 'votes'}
        </div>
      </div>

      {!isMember && (
        <div style={{ padding: '12px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', marginBottom: '16px' }}>
          ⚠️ Only members can delegate
        </div>
      )}

      {hasDelegated ? (
        <div style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Delegated to:</div>
          <div style={{ fontSize: '14px', fontFamily: 'space', marginBottom: '12px', wordBreak: 'break-all' }}>
            {delegatedTo}
          </div>
          <button
            onClick={() => revokeDelegation()}
            disabled={isPending || isConfirming || !isMember}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isPending ? 'Preparing...' : isConfirming ? 'Revoking...' : 'Revoke Delegation'}
          </button>
        </div>
      ) : (
        !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            disabled={!isMember}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Delegate Your Voting Power
          </button>
        ) : (
          <form onSubmit={handleDelegate} style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
            <input
              type="text"
              value={delegateAddress}
              onChange={(e) => setDelegateAddress(e.target.value)}
              placeholder="0x..."
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '12px',
                fontFamily: 'monospace'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" disabled={isPending} style={{ flex: 1, padding: '10px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {isPending ? 'Preparing...' : 'Delegate'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        )
      )}

      {delegators.length > 0 && (
        <div style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #ddd', marginTop: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0' }}>Delegated to you ({delegators.length})</h4>
          {delegators.map((d, i) => (
            <div key={i} style={{ padding: '8px', background: '#f8f9fa', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', marginBottom: '4px', wordBreak: 'break-all' }}>
              {d}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div style={{ marginTop: '12px', padding: '12px', background: '#f8d7da', borderRadius: '4px', color: '#721c24' }}>
          Error: {error.message}
        </div>
      )}
    </div>
  )
}
