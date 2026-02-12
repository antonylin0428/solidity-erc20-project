/**
 * Component: OrganizationList
 * 
 * WHAT DOES THIS COMPONENT DO?
 * - Displays a list of organizations created by the factory
 * - Uses Wagmi's useReadContract to read from the blockchain
 * - Shows organization details (name, creator, addresses)
 * 
 * IMPORTANT CONCEPT: Reading from Blockchain
 * - Reading data is FREE (no gas cost)
 * - Reading is SYNCHRONOUS (happens immediately)
 * - We can read data without a wallet connection (if the contract allows)
 */

import { useState, useMemo } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { CONFIG } from '../config'
// Import ABI - path is relative to frontend/src
import ClubDAOFactoryABI from '../../../artifacts/contracts/ClubDAOFactory.sol/ClubDAOFactory.json'
import OrganizationFilters from './OrganizationFilters'

export default function OrganizationList({ onViewDAO }) {
  const { address: userAddress } = useAccount()
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    sortBy: 'newest',
    showOnlyMine: false,
  })

  // Read the total number of organizations
  // This is a "read" operation - no transaction, no gas cost, instant
  const { data: orgCount, isLoading } = useReadContract({
    address: CONFIG.CLUB_DAO_FACTORY_ADDRESS,
    abi: ClubDAOFactoryABI.abi,
    functionName: 'organizationCount',
  })

  // Convert BigInt to number (if it exists)
  const count = orgCount ? Number(orgCount) : 0
  
  // Generate list of org IDs with sorting
  const orgIds = useMemo(() => {
    if (!count) return []
    let ids = Array.from({ length: count }, (_, i) => i + 1)
    
    // Basic sorting (newest/oldest)
    if (filters.sortBy === 'newest') {
      ids = ids.reverse()
    }
    // Note: name sorting requires fetching all org data
    
    return ids
  }, [count, filters.sortBy])

  if (isLoading) {
    return <div>Loading organizations...</div>
  }

  if (count === 0) {
    return (
      <div style={{ 
        padding: '24px', 
        textAlign: 'center',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <p style={{ color: '#666' }}>No organizations created yet.</p>
        <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
          Create your first organization using the form above!
        </p>
      </div>
    )
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        Organizations ({count})
      </h2>
      
      {/* Filters */}
      <OrganizationFilters 
        filters={filters}
        onFiltersChange={setFilters}
        userAddress={userAddress}
      />
      
      {/* Results Count */}
      <div style={{
        padding: '12px 16px',
        background: '#f8f9fa',
        borderRadius: '6px',
        marginBottom: '16px',
        fontSize: '14px',
        color: '#666',
      }}>
        <strong>{orgIds.length}</strong> {orgIds.length === 1 ? 'organization' : 'organizations'} found
      </div>
      
      <div style={{ 
        display: 'grid', 
        gap: '16px'
      }}>
        {orgIds.map((orgId) => (
          <OrganizationCard 
            key={orgId} 
            orgId={orgId} 
            onViewDAO={onViewDAO}
            filters={filters}
            userAddress={userAddress}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Component: OrganizationCard
 * 
 * Displays details for a single organization
 * 
 * PROPS:
 * - orgId: The organization ID
 * - onViewDAO: Callback function to view the DAO (passes daoAddress)
 * - filters: Current filter settings
 * - userAddress: Current user's address
 */
function OrganizationCard({ orgId, onViewDAO, filters, userAddress }) {
  // Read organization details from the contract
  const { data: org, isLoading } = useReadContract({
    address: CONFIG.CLUB_DAO_FACTORY_ADDRESS,
    abi: ClubDAOFactoryABI.abi,
    functionName: 'getOrganization',
    args: [orgId],
  })

  if (isLoading) {
    return (
      <div style={{ 
        padding: '16px', 
        background: 'white', 
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        Loading organization #{orgId}...
      </div>
    )
  }

  if (!org) {
    return null
  }

  // Apply filters
  const searchLower = filters.searchTerm.toLowerCase()
  
  // Search filter: check name and creator address
  if (searchLower && 
      !org.name?.toLowerCase().includes(searchLower) &&
      !org.creator?.toLowerCase().includes(searchLower)) {
    return null
  }

  // Show only mine filter
  if (filters.showOnlyMine && userAddress &&
      org.creator?.toLowerCase() !== userAddress.toLowerCase()) {
    return null
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: 'white', 
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#333' }}>
          {org.name || `Organization #${orgId}`}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onViewDAO(org.daoContract)
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          View DAO →
        </button>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Creator:</strong>{' '}
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {org.creator}
        </span>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>NFT Contract:</strong>{' '}
        <a 
          href={`https://sepolia.etherscan.io/address/${org.nftContract}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: 'monospace', fontSize: '12px', color: '#667eea' }}
          onClick={(e) => e.stopPropagation()}
        >
          {org.nftContract.slice(0, 6)}...{org.nftContract.slice(-4)}
        </a>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>DAO Contract:</strong>{' '}
        <a 
          href={`https://sepolia.etherscan.io/address/${org.daoContract}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: 'monospace', fontSize: '12px', color: '#667eea' }}
          onClick={(e) => e.stopPropagation()}
        >
          {org.daoContract.slice(0, 6)}...{org.daoContract.slice(-4)}
        </a>
      </div>
      
      <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
        Created: {new Date(Number(org.createdAt) * 1000).toLocaleString()}
      </div>
    </div>
  )
}
