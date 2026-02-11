import { useState } from 'react'
import { useClubDAO } from '../hooks/useClubDAO'
import { useToast } from '../hooks/useToast'
import { encodeFunctionData, parseEther, isAddress } from 'viem'
import ClubDAOABI from '../../../artifacts/contracts/ClubDAO.sol/ClubDAO.json'

export default function CreateProposal({ daoAddress, onProposalCreated }) {
    const [proposalType, setProposalType] = useState('text')
    const [description, setDescription] = useState('')
    const [paymentAddress, setPaymentAddress] = useState('')
    const [paymentAmount, setPaymentAmount] = useState('')
    const [newVotingPeriod, setNewVotingPeriod] = useState('')
    const [newQuorum, setNewQuorum] = useState('')

    const toast = useToast()
    const { createProposal, isPending, isConfirming, isConfirmed, hash } = useClubDAO(daoAddress)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!description.trim()) {
            toast.warning('Please enter a proposal description')
            return
        }

        try {
            let target = '0x0000000000000000000000000000000000000000'
            let actionData = '0x'
            let value = '0'

            if (proposalType === 'payment') {
                if (!isAddress(paymentAddress)) {
                    toast.error('Invalid payment address')
                    return
                }
                if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
                    toast.error('Invalid payment amount')
                    return
                }
                target = paymentAddress
                value = parseEther(paymentAmount).toString()
                actionData = '0x'

            } else if (proposalType === 'votingPeriod') {
                if (!newVotingPeriod || parseInt(newVotingPeriod) <= 0) {
                    toast.error('Invalid voting period')
                    return
                }
                target = daoAddress
                value = '0'
                actionData = encodeFunctionData({
                    abi: ClubDAOABI.abi,
                    functionName: 'setVotingPeriod',
                    args: [BigInt(parseInt(newVotingPeriod) * 24 * 60 * 60)]
                })

            } else if (proposalType === 'quorum') {
                if (!newQuorum || parseInt(newQuorum) < 1 || parseInt(newQuorum) > 100) {
                    toast.error('Quorum must be between 1 and 100')
                    return
                }
                target = daoAddress
                value = '0'
                actionData = encodeFunctionData({
                    abi: ClubDAOABI.abi,
                    functionName: 'setQuorumThreshold',
                    args: [BigInt(newQuorum)]
                })
            }

            await createProposal(description, target, value, actionData)
            toast.success('Proposal created successfully!')
        } catch (error) {
            console.error('Failed to create proposal:', error)
            toast.error('Failed to create proposal. Please try again.')
        }
    }

    if (isConfirmed) {
        return (
            <div style={{ padding: '20px', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ color: '#155724', marginBottom: '10px' }}>✅ Proposal Created!</h3>
                <p style={{ color: '#155724', marginBottom: '10px' }}>Your proposal has been successfully created.</p>
                {hash && (
                    <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#155724', textDecoration: 'underline' }}>
                        View transaction on Etherscan
                    </a>
                )}
                <button onClick={() => {
                    setDescription('')
                    setPaymentAddress('')
                    setPaymentAmount('')
                    setNewVotingPeriod('')
                    setNewQuorum('')
                    onProposalCreated?.()
                }} style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Create Another Proposal
                </button>
            </div>
        )
    }

    return (
        <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '24px' }}>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Proposal Type</label>
                    <select value={proposalType} onChange={(e) => setProposalType(e.target.value)} disabled={isPending || isConfirming} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', backgroundColor: 'white' }}>
                        <option value="text">Text Only (No Action)</option>
                        <option value="payment">Treasury Payment (Send ETH)</option>
                        <option value="votingPeriod">Change Voting Period</option>
                        <option value="quorum">Change Quorum Threshold</option>
                    </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Proposal Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what this proposal is about..." required disabled={isPending || isConfirming} rows={4} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', resize: 'vertical' }} />
                </div>

                {proposalType === 'payment' && (
                    <>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Payment Address</label>
                            <input type="text" value={paymentAddress} onChange={(e) => setPaymentAddress(e.target.value)} placeholder="0x..." required disabled={isPending || isConfirming} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Amount (ETH)</label>
                            <input type="number" step="0.001" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="0.1" required disabled={isPending || isConfirming} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }} />
                        </div>
                    </>
                )}

                {proposalType === 'votingPeriod' && (
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>New Voting Period (days)</label>
                        <input type="number" value={newVotingPeriod} onChange={(e) => setNewVotingPeriod(e.target.value)} placeholder="7" required min="1" disabled={isPending || isConfirming} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }} />
                    </div>
                )}

                {proposalType === 'quorum' && (
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>New Quorum Threshold (%)</label>
                        <input type="number" value={newQuorum} onChange={(e) => setNewQuorum(e.target.value)} placeholder="50" required min="1" max="100" disabled={isPending || isConfirming} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }} />
                    </div>
                )}

                <button type="submit" disabled={isPending || isConfirming} style={{ width: '100%', padding: '12px', backgroundColor: isPending || isConfirming ? '#6c757d' : '#667eea', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: isPending || isConfirming ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {isPending ? 'Preparing Transaction...' : isConfirming ? 'Waiting for Confirmation...' : 'Create Proposal'}
                </button>
            </form>
        </div>
    )
}
