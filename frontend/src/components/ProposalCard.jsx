import { useReadContract } from 'wagmi'
import { useClubDAO } from '../hooks/useClubDAO'
import { useToast } from '../hooks/useToast'
import ClubDAOABI from '../../../artifacts/contracts/ClubDAO.sol/ClubDAO.json'
import ProposalActionPreview from './ProposalActionPreview'
import VotingChart from './VotingChart'

function ProposalCard({ daoAddress, proposalId, isMember, userAddress, searchTerm = '', statusFilter = 'all', onProposalUpdate }) {
    const toast = useToast()
    // Get NFT address for member count in voting chart
    const { data: membershipNFTAddress } = useReadContract({
        address: daoAddress,
        abi: ClubDAOABI.abi,
        functionName: 'membershipNFT',
    })

    // Get quorum threshold for voting chart
    const { data: quorumThreshold } = useReadContract({
        address: daoAddress,
        abi: ClubDAOABI.abi,
        functionName: 'quorumThreshold',
    })
    const { data: proposal, isLoading } = useReadContract({
        address: daoAddress,
        abi: ClubDAOABI.abi,
        functionName: 'getProposal',
        args: [BigInt(proposalId)],
    })

    const { data: hasVoted } = useReadContract({
        address: daoAddress,
        abi: ClubDAOABI.abi,
        functionName: 'hasVoted',
        args: [BigInt(proposalId), userAddress],
        query: { enabled: !!userAddress },
    })

    const { data: voteDirection } = useReadContract({
        address: daoAddress,
        abi: ClubDAOABI.abi,
        functionName: 'voteDirection',
        args: [BigInt(proposalId), userAddress],
        query: { enabled: !!userAddress && hasVoted },
    })

    const { data: proposalPassed } = useReadContract({
        address: daoAddress,
        abi: ClubDAOABI.abi,
        functionName: 'proposalPassed',
        args: [BigInt(proposalId)],
    })

    const { vote, executeProposal, isPending, isConfirming } = useClubDAO(daoAddress)

    if (isLoading || !proposal) {
        return (
            <div style={{ padding: '16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px' }}>
                Loading proposal #{proposalId}...
            </div>
        )
    }

    const deadline = Number(proposal.deadline) * 1000
    const now = Date.now()
    const isExpired = now > deadline
    const canExecute = proposalPassed && isExpired && !proposal.executed

    // Filter by search term
    if (searchTerm && !proposal.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return null
    }

    // Filter by status
    if (statusFilter !== 'all') {
        if (statusFilter === 'active' && (isExpired || proposal.executed)) return null
        if (statusFilter === 'passed' && (!proposalPassed || proposal.executed)) return null
        if (statusFilter === 'failed' && (proposalPassed || !isExpired || proposal.executed)) return null
        if (statusFilter === 'executed' && !proposal.executed) return null
    }

    return (
        <div style={{ padding: '20px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, color: '#333' }}>Proposal #{proposalId}</h3>
                    <div style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: proposal.executed ? '#d4edda' : canExecute ? '#d1ecf1' : isExpired ? '#f8d7da' : '#fff3cd',
                        color: proposal.executed ? '#155724' : canExecute ? '#0c5460' : isExpired ? '#721c24' : '#856404'
                    }}>
                        {proposal.executed ? 'Executed' : canExecute ? 'Ready to Execute' : isExpired ? 'Expired' : 'Active'}
                    </div>
                </div>
                <p style={{ color: '#666', fontSize: '14px', margin: '8px 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {proposal.description}
                </p>
            </div>

            {/* Action Preview - Shows what the proposal will do */}
            <ProposalActionPreview proposal={proposal} />

            {/* Voting Progress Chart */}
            {membershipNFTAddress && (
                <VotingChart
                    daoAddress={daoAddress}
                    nftAddress={membershipNFTAddress}
                    proposal={proposal}
                    proposalPassed={proposalPassed}
                    quorumThreshold={quorumThreshold ? Number(quorumThreshold) : 50}
                />
            )}

            {/* Proposal Metadata */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                marginBottom: '16px',
                padding: '12px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px'
            }}>
                <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Deadline</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                        {new Date(deadline).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(deadline).toLocaleTimeString()}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Proposer</div>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#333' }}>
                        {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                    </div>
                </div>
            </div>

            {isMember && !isExpired && !proposal.executed && (
                <div style={{ marginBottom: '16px' }}>
                    {hasVoted ? (
                        <div style={{ padding: '12px', background: '#e7f3ff', borderRadius: '8px', textAlign: 'center' }}>
                            ✅ You voted <strong>{voteDirection ? 'FOR' : 'AGAINST'}</strong> this proposal
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={async () => {
                                    try {
                                        await vote(proposalId, true)
                                        toast.success('Vote cast successfully!')
                                        setTimeout(() => onProposalUpdate?.(), 2000)
                                    } catch (error) {
                                        toast.error('Failed to vote. Please try again.')
                                    }
                                }}
                                disabled={isPending || isConfirming}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Vote FOR
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await vote(proposalId, false)
                                        toast.success('Vote cast successfully!')
                                        setTimeout(() => onProposalUpdate?.(), 2000)
                                    } catch (error) {
                                        toast.error('Failed to vote. Please try again.')
                                    }
                                }}
                                disabled={isPending || isConfirming}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Vote AGAINST
                            </button>
                        </div>
                    )}
                </div>
            )}

            {canExecute && (
                <button
                    onClick={async () => {
                        if (confirm('Are you sure you want to execute this proposal?')) {
                            try {
                                await executeProposal(proposalId)
                                toast.success('Proposal executed successfully!')
                                setTimeout(() => onProposalUpdate?.(), 2000)
                            } catch (error) {
                                toast.error('Failed to execute proposal. Please try again.')
                            }
                        }
                    }}
                    disabled={isPending || isConfirming}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: isPending || isConfirming ? '#6c757d' : '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {isPending ? 'Preparing...' : isConfirming ? 'Executing...' : 'Execute Proposal'}
                </button>
            )}

            {!isMember && !isExpired && (
                <div style={{
                    padding: '12px',
                    background: '#fff3cd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#856404',
                    textAlign: 'center'
                }}>
                    ⚠️ You must be a member to vote on proposals
                </div>
            )}
        </div>
    )
}

export default ProposalCard
