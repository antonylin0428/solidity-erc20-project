/**
 * Component: DAOView
 * 
 * WHAT DOES THIS COMPONENT DO?
 * - Shows details of a specific DAO
 * - Displays all proposals for that DAO
 * - Allows creating new proposals
 * - Allows voting on proposals (if member)
 * - Allows managing members
 * 
 * PROPS:
 * - daoAddress: The address of the ClubDAO contract
 * - onBack: Callback to go back to organization list
 */

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useClubDAO } from '../hooks/useClubDAO'
import { useReadContract } from 'wagmi'
import ClubDAOABI from '../../../artifacts/contracts/ClubDAO.sol/ClubDAO.json'
import CreateProposal from './CreateProposal'
import ProposalList from './ProposalList'
import AddMember from './AddMember'
import MemberList from './MemberList'
import DelegationPanel from './DelegationPanel'
import DAOSettings from './DAOSettings'
import Treasury from './Treasury'
import ProposalDetailView from './ProposalDetailView'
import MemberDashboard from './MemberDashboard'
import EventMonitor from './EventMonitor'

export default function DAOView({ daoAddress, onBack }) {
  const { address, isConnected } = useAccount()
  const [refreshKey, setRefreshKey] = useState(0)
  const [view, setView] = useState('overview') // 'overview', 'proposals', 'dashboard', or 'detail'
  const [selectedProposalId, setSelectedProposalId] = useState(null)
  
  // Callback to trigger refresh without full page reload
  const handleDataUpdate = () => {
    setRefreshKey(prev => prev + 1)
  }
  
  // Handler to view proposal details
  const handleViewDetails = (proposalId) => {
    setSelectedProposalId(proposalId)
    setView('detail')
  }
  
  // Handler to go back to proposals view
  const handleBackToProposals = () => {
    setView('proposals')
    setSelectedProposalId(null)
  }
  
  const { proposalCount, votingPeriod, quorumThreshold } = useClubDAO(daoAddress)

  // Read membership NFT address
  const { data: membershipNFTAddress } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'membershipNFT',
  })

  // Check if user is a member
  const { data: isMember } = useReadContract({
    address: membershipNFTAddress,
    abi: [
      {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'isMember',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'isMember',
    args: [address],
    query: {
      enabled: isConnected && !!membershipNFTAddress,
    },
  })

  return (
    <div>
      {/* Header with back button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            marginBottom: '16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ← Back to Organizations
        </button>
        
        <h1 style={{ marginBottom: '8px', color: '#333' }}>DAO Details</h1>
        <p style={{ color: '#666', fontSize: '14px', fontFamily: 'monospace' }}>
          {daoAddress}
        </p>
        
        {/* DAO Stats */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginTop: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            padding: '12px', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            minWidth: '150px'
          }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              Proposals
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {proposalCount}
            </div>
          </div>
          
          <div style={{ 
            padding: '12px', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            minWidth: '150px'
          }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              Voting Period
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {votingPeriod ? `${votingPeriod / (24 * 60 * 60)} days` : '...'}
            </div>
          </div>
          
          <div style={{ 
            padding: '12px', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            minWidth: '150px'
          }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              Quorum
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {quorumThreshold}%
            </div>
          </div>
        </div>

        {/* Membership Status */}
        {isConnected && (
          <div style={{ 
            marginTop: '16px',
            padding: '12px',
            background: isMember ? '#d4edda' : '#fff3cd',
            border: `1px solid ${isMember ? '#c3e6cb' : '#ffc107'}`,
            borderRadius: '8px'
          }}>
            {isMember ? (
              <span>✅ You are a member of this DAO</span>
            ) : (
              <span>⚠️ You are not a member. You can view proposals but cannot vote.</span>
            )}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      {view !== 'detail' && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          background: 'white',
          padding: '8px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <button
            onClick={() => setView('overview')}
            style={{
              padding: '14px 28px',
              background: view === 'overview' ? '#667eea' : '#f8f9fa',
              color: view === 'overview' ? 'white' : '#333',
              border: view === 'overview' ? '2px solid #667eea' : '2px solid #e9ecef',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: view === 'overview' ? 'bold' : '600',
              transition: 'all 0.2s',
              boxShadow: view === 'overview' ? '0 4px 8px rgba(102, 126, 234, 0.3)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (view !== 'overview') {
                e.target.style.background = '#e9ecef'
                e.target.style.borderColor = '#667eea'
              }
            }}
            onMouseLeave={(e) => {
              if (view !== 'overview') {
                e.target.style.background = '#f8f9fa'
                e.target.style.borderColor = '#e9ecef'
              }
            }}
          >
            🏠 Overview
          </button>
          <button
            onClick={() => setView('proposals')}
            style={{
              padding: '14px 28px',
              background: view === 'proposals' ? '#667eea' : '#f8f9fa',
              color: view === 'proposals' ? 'white' : '#333',
              border: view === 'proposals' ? '2px solid #667eea' : '2px solid #e9ecef',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: view === 'proposals' ? 'bold' : '600',
              transition: 'all 0.2s',
              boxShadow: view === 'proposals' ? '0 4px 8px rgba(102, 126, 234, 0.3)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (view !== 'proposals') {
                e.target.style.background = '#e9ecef'
                e.target.style.borderColor = '#667eea'
              }
            }}
            onMouseLeave={(e) => {
              if (view !== 'proposals') {
                e.target.style.background = '#f8f9fa'
                e.target.style.borderColor = '#e9ecef'
              }
            }}
          >
            📋 Proposals ({proposalCount})
          </button>
          {isConnected && isMember && (
            <button
              onClick={() => setView('dashboard')}
              style={{
                padding: '14px 28px',
                background: view === 'dashboard' ? '#667eea' : '#f8f9fa',
                color: view === 'dashboard' ? 'white' : '#333',
                border: view === 'dashboard' ? '2px solid #667eea' : '2px solid #e9ecef',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: view === 'dashboard' ? 'bold' : '600',
                transition: 'all 0.2s',
                boxShadow: view === 'dashboard' ? '0 4px 8px rgba(102, 126, 234, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (view !== 'dashboard') {
                  e.target.style.background = '#e9ecef'
                  e.target.style.borderColor = '#667eea'
                }
              }}
              onMouseLeave={(e) => {
                if (view !== 'dashboard') {
                  e.target.style.background = '#f8f9fa'
                  e.target.style.borderColor = '#e9ecef'
                }
              }}
            >
              📊 My Dashboard
            </button>
          )}
        </div>
      )}

      {/* Overview Tab - Show DAO management sections */}
      {view === 'overview' && (
        <>
          {/* Real-time Event Monitoring */}
          {membershipNFTAddress && (
            <EventMonitor
              daoAddress={daoAddress}
              nftAddress={membershipNFTAddress}
              onDataUpdate={handleDataUpdate}
            />
          )}

          {/* Treasury Section */}
          <Treasury 
            daoAddress={daoAddress}
            isMember={isMember || false}
          />

          {/* Member Management Section */}
          {isConnected && membershipNFTAddress && (
            <div style={{ marginBottom: '32px' }} key={`members-${refreshKey}`}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Member Management</h2>
              <AddMember 
                daoAddress={daoAddress} 
                nftAddress={membershipNFTAddress}
                isMember={isMember || false}
                onMemberAdded={handleDataUpdate}
              />
              <MemberList nftAddress={membershipNFTAddress} />
            </div>
          )}

          {/* Delegation Section */}
          {isConnected && address && (
            <div style={{ marginBottom: '32px' }}>
              <DelegationPanel 
                daoAddress={daoAddress} 
                userAddress={address}
                isMember={isMember || false}
              />
            </div>
          )}
        </>
      )}

      {/* Proposals Tab - Show create proposal form and proposal list */}
      {view === 'proposals' && (
        <div key={`proposals-${refreshKey}`}>
          {/* Create Proposal Section */}
          {isConnected && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Create Proposal</h2>
              <CreateProposal 
                daoAddress={daoAddress}
                onProposalCreated={handleDataUpdate}
              />
            </div>
          )}

          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            Proposals ({proposalCount})
          </h2>
          <ProposalList 
            daoAddress={daoAddress} 
            isMember={isMember || false}
            onProposalUpdate={handleDataUpdate}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}

      {/* Proposal Detail View */}
      {view === 'detail' && selectedProposalId && (
        <ProposalDetailView
          daoAddress={daoAddress}
          proposalId={selectedProposalId}
          isMember={isMember || false}
          userAddress={address}
          onBack={handleBackToProposals}
        />
      )}

      {/* Member Dashboard Tab */}
      {view === 'dashboard' && isConnected && isMember && (
        <MemberDashboard
          daoAddress={daoAddress}
          userAddress={address}
          isMember={isMember}
        />
      )}
    </div>
  )
}
