import { useState, useMemo } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { useClubDAO } from '../hooks/useClubDAO'
import ClubDAOABI from '../../../artifacts/contracts/ClubDAO.sol/ClubDAO.json'
import ProposalCard from './ProposalCard.jsx'

export default function ProposalList({ daoAddress, isMember, onProposalUpdate, onViewDetails }) {
    const { address, isConnected } = useAccount()
    const { proposalCount } = useClubDAO(daoAddress)
    
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    // Fetch all proposals to enable filtering
    const proposals = useMemo(() => {
        if (!proposalCount) return []
        return Array.from({ length: proposalCount }, (_, i) => proposalCount - i)
    }, [proposalCount])

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
            {/* Filters and Search Bar */}
            <div style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                {/* Search Bar */}
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="text"
                        placeholder="Search proposals by description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                    />
                </div>

                {/* Status Filter Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['all', 'active', 'passed', 'failed', 'executed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: statusFilter === status ? '#667eea' : 'white',
                                color: statusFilter === status ? 'white' : '#333',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: statusFilter === status ? 'bold' : 'normal',
                                textTransform: 'capitalize'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
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
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                        onProposalUpdate={onProposalUpdate}
                        onViewDetails={onViewDetails}
                    />
                ))}
            </div>
        </div>
    )
}
