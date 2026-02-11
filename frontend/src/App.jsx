/**
 * Main App Component
 * 
 * ARCHITECTURE OVERVIEW:
 * 
 * 1. WALLET CONNECTION (Wagmi)
 *    - useAccount: Gets connected wallet address
 *    - useConnect: Connects wallet
 *    - useDisconnect: Disconnects wallet
 *    - useBalance: Gets wallet ETH balance
 * 
 * 2. COMPONENT STRUCTURE
 *    - App.jsx: Main container, handles wallet connection
 *    - CreateOrganization: Form to create new clubs
 *    - OrganizationList: Displays all created organizations
 * 
 * 3. DATA FLOW
 *    - User connects wallet → useAccount provides address
 *    - User creates organization → useClubDAOFactory hook → blockchain transaction
 *    - Transaction confirmed → OrganizationList reads updated data
 * 
 * 4. BLOCKCHAIN INTERACTION
 *    - READ operations: useReadContract (free, instant)
 *    - WRITE operations: useWriteContract (costs gas, takes time)
 */

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import CreateOrganization from './components/CreateOrganization'
import OrganizationList from './components/OrganizationList'
import DAOView from './components/DAOView'
import ToastContainer from './components/ToastContainer'

function App() {
  // useState: Manages whether we should refresh the organization list
  // When an organization is created, we set this to trigger a refresh
  const [refreshKey, setRefreshKey] = useState(0)

  // useState: Tracks which DAO is being viewed (null = viewing organization list)
  const [viewingDAO, setViewingDAO] = useState(null)

  // Wagmi hooks for wallet connection
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h1 style={{ marginBottom: '10px', color: '#333' }}>
          🗳️ ClubDAO dApp
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Create and manage decentralized autonomous organizations (DAOs) with NFT-based membership
        </p>

        {/* Wallet Connection Section */}
        {!isConnected ? (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#666' }}>Connect Your Wallet</h2>
            <p style={{ marginBottom: '20px', color: '#888' }}>
              Connect your wallet to create organizations and interact with DAOs
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
            <div style={{
              marginBottom: '20px',
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px'
            }}>
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
          </div>
        )}
      </div>

      {/* Main Content - Only show when wallet is connected */}
      {isConnected && (
        <div>
          {viewingDAO ? (
            /* Viewing a specific DAO */
            <DAOView
              daoAddress={viewingDAO}
              onBack={() => setViewingDAO(null)}
            />
          ) : (
            /* Viewing organization list */
            <>
              {/* Create Organization Form */}
              <CreateOrganization
                onOrganizationCreated={() => {
                  // Trigger refresh of organization list
                  // We increment refreshKey to force OrganizationList to re-render
                  setRefreshKey(prev => prev + 1)
                }}
              />

              {/* Organization List */}
              <div key={refreshKey}>
                <OrganizationList
                  onViewDAO={(daoAddress) => setViewingDAO(daoAddress)}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
    </>
  )
}

export default App

