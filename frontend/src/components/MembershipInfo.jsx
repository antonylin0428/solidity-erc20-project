/**
 * MembershipInfo Component
 * 
 * Displays personal membership information:
 * - Member address
 * - Token ID
 * - DAO name
 * - Links to Etherscan
 */

export default function MembershipInfo({ userAddress, nftAddress, tokenId, daoName }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', color: '#333' }}>
        👤 Membership Info
      </h3>

      {/* DAO Name */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>DAO</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
          {daoName || 'Loading...'}
        </div>
      </div>

      {/* Token ID */}
      {tokenId && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Token ID</div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#667eea',
            fontFamily: 'monospace',
          }}>
            #{tokenId.toString()}
          </div>
        </div>
      )}

      {/* Member Address */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>Your Address</div>
        <div style={{
          padding: '12px',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#333',
          wordBreak: 'break-all',
          marginBottom: '8px',
        }}>
          {userAddress}
        </div>
        <a
          href={`https://etherscan.io/address/${userAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '13px',
            color: '#667eea',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          View on Etherscan ↗
        </a>
      </div>

      {/* NFT Contract Link */}
      {nftAddress && (
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #e9ecef',
        }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>NFT Contract</div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#666',
            marginBottom: '4px',
          }}>
            {nftAddress.slice(0, 10)}...{nftAddress.slice(-8)}
          </div>
          <a
            href={`https://etherscan.io/address/${nftAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '13px',
              color: '#667eea',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View Contract ↗
          </a>
        </div>
      )}

      {/* Status Badge */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        background: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '4px',
        textAlign: 'center',
      }}>
        <div style={{ color: '#155724', fontWeight: 'bold', fontSize: '14px' }}>
          ✓ Active Member
        </div>
      </div>
    </div>
  )
}
