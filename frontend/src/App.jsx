import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '12px', 
      padding: '40px', 
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
    }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>
        🗳️ ClubDAO dApp
      </h1>

      {!isConnected ? (
        <div>
          <h2 style={{ marginBottom: '20px', color: '#666' }}>Connect Your Wallet</h2>
          <p style={{ marginBottom: '20px', color: '#888' }}>
            Connect using Gemini wallet or any WalletConnect-compatible wallet
          </p>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={isPending}
              style={{
                padding: '12px 24px',
                margin: '8px',
                fontSize: '16px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.6 : 1,
              }}
            >
              {isPending ? 'Connecting...' : `Connect ${connector.name}`}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
            <p><strong>Connected:</strong> {address}</p>
            {balance && (
              <p><strong>Balance:</strong> {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}</p>
            )}
          </div>
          
          <button
            onClick={() => disconnect()}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Disconnect
          </button>

          <div style={{ marginTop: '40px' }}>
            <h2 style={{ marginBottom: '20px', color: '#666' }}>ClubDAO Features</h2>
            <p style={{ color: '#888' }}>
              Create clubs, manage memberships, create proposals, vote, and execute actions!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

