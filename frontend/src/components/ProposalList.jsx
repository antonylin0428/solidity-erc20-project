import { useState, useMemo } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { useClubDAO } from '../hooks/useClubDAO'
import ClubDAOABI from '../contracts/ClubDAO.json'
import ProposalCard from './ProposalCard.jsx'
import AdvancedProposalFilters from './AdvancedProposalFilters'

export default function ProposalList({ daoAddress, isMember, onProposalUpdate, onViewDetails }) {
    const { address, isConnected } = useAccount()
    const { proposalCount } = useClubDAO(daoAddress)
    
    const [filters, setFilters] = useState({
        searchTerm: '',
        status: 'all',
        sortBy: 'newest',
        actionType: 'all',
        showOnlyVoted: false,
    })

    // Fetch all proposals with sorting
    const proposals = useMemo(() => {
        if (!proposalCount) return []
        let ids = Array.from({ length: proposalCount }, (_, i) => i + 1)
        
        // Apply sorting
        switch (filters.sortBy) {
            case 'newest':
                ids = ids.reverse() // Reverse to show newest first
                break
            case 'oldest':
                // Already in order
                break
            // Note: mostVotes, leastVotes, closingFirst require fetching proposal data
            // For now, these will be handled by fetching all data
            default:
                ids = ids.reverse()
        }
        
        return ids
    }, [proposalCount, filters.sortBy])

    if (proposalCount === 0) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ color: '#666' }}>No proposals yet.</p>
                <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
                    Create the first proposal using the form above!
                </p>
            </div>
        )
    }

    return (
        <div>
            {/* Advanced Filters */}
            <AdvancedProposalFilters 
                filters={filters} 
                onFiltersChange={setFilters}
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
                <strong>{proposals.length}</strong> {proposals.length === 1 ? 'proposal' : 'proposals'} found
            </div>

            {/* Proposals List */}
            <div style={{ display: 'grid', gap: '16px' }}>
                {proposals.map((proposalId) => (
                    <ProposalCard
                        key={proposalId}
                        daoAddress={daoAddress}
                        proposalId={proposalId}
                        isMember={isMember}
                        userAddress={address}
                        searchTerm={filters.searchTerm}
                        statusFilter={filters.status}
                        onProposalUpdate={onProposalUpdate}
                        onViewDetails={onViewDetails}
                    />
                ))}
            </div>
        </div>
    )
}
