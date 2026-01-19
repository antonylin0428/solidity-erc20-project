/**
 * Component: ProposalList
 * 
 * WHAT DOES THIS COMPONENT DO?
 * - Displays all proposals for a DAO
 * - Shows proposal details (description, votes, deadline, status)
 * - Allows voting on proposals (if member)
 * - Allows executing proposals (if passed and deadline passed)
 */

import { useReadContract } from 'wagmi'
import { useAccount } from 'wagmi'
import { useClubDAO } from '../hooks/useClubDAO'
import ClubDAOABI from '../../../artifacts/contracts/ClubDAO.sol/ClubDAO.json'
import ProposalCard from './ProposalCard.jsx'

export default function ProposalList({ daoAddress, isMember }) {
    const { address, isConnected } = useAccount()
    const { proposalCount } = useClubDAO(daoAddress)

    if (proposalCount === 0) {
        return (
            <div style={{
                padding: '24px',
                textAlign: 'center',
                background: '#f8f9fa',
                borderRadius: '8px'
            }}>
                <p style={{ color: '#666' }}>No proposals yet.</p>
                <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
                    Create the first proposal using the form above!
                </p>
            </div>
        )
    }

    return (
        <div style={{ display: 'grid', gap: '16px' }}>
            {/* Render proposals in reverse order (newest first) */}
            {Array.from({ length: proposalCount }, (_, i) => {
                const proposalId = proposalCount - i // Start from highest ID
                return (
                    <ProposalCard
                        key={proposalId}
                        daoAddress={daoAddress}
                        proposalId={proposalId}
                        isMember={isMember}
                        userAddress={address}
                    />
                )
            })}
        </div>
    )
}