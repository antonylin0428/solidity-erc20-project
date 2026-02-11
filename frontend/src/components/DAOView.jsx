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

export default function DAOView({ daoAddress, onBack }) {
  const { address, isConnected } = useAccount()
  const [refreshKey, setRefreshKey] = useState(0)
  
  // Callback to trigger refresh without full page reload
  const handleDataUpdate = () => {
    setRefreshKey(prev => prev + 1)
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

      {/* Proposals List */}
      <div key={`proposals-${refreshKey}`}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>
          Proposals ({proposalCount})
        </h2>
        <ProposalList 
          daoAddress={daoAddress} 
          isMember={isMember || false}
          onProposalUpdate={handleDataUpdate}
        />
      </div>
    </div>
  )
}
