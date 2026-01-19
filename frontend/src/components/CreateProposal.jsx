/**
 * Component: CreateProposal
 * 
 * WHAT DOES THIS COMPONENT DO?
 * - Provides a form to create new proposals
 * - Handles simple proposals (description only) for now
 * - Can be extended to support executable proposals later
 */

import { useState } from 'react'
import { useClubDAO } from '../hooks/useClubDAO'

export default function CreateProposal({ daoAddress }) {
    const [description, setDescription] = useState('')
    const { createProposal, isPending, isConfirming, isConfirmed, hash } = useClubDAO(daoAddress)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!description.trim()) {
            alert('Please enter a proposal description')
            return
        }

        try {
            // For now, we'll create simple proposals with no action
            // target = zero address, value = 0
            await createProposal(description, '0x0000000000000000000000000000000000000000', '0')
        } catch (error) {
            console.error('Failed to create proposal:', error)
            alert('Failed to create proposal. Please try again.')
        }
    }

    // Show success message
    if (isConfirmed) {
        return (
            <div style={{
                padding: '20px',
                background: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h3 style={{ color: '#155724', marginBottom: '10px' }}>✅ Proposal Created!</h3>
                <p style={{ color: '#155724', marginBottom: '10px' }}>
                    Your proposal has been successfully created.
                </p>
                {hash && (
                    <a
                        href={`https://sepolia.etherscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#155724', textDecoration: 'underline' }}
                    >
                        View transaction on Etherscan
                    </a>
                )}
                <button
                    onClick={() => {
                        setDescription('')
                        window.location.reload() // Refresh to show new proposal
                    }}
                    style={{
                        marginTop: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Create Another Proposal
                </button>
            </div>
        )
    }

    return (
        <div style={{
            padding: '24px',
            background: '#f8f9fa',
            borderRadius: '8px',
            marginBottom: '24px'
        }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Create New Proposal</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Proposal Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what this proposal is about..."
                        required
                        disabled={isPending || isConfirming}
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending || isConfirming}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: isPending || isConfirming ? '#6c757d' : '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {isPending ? 'Preparing Transaction...' :
                        isConfirming ? 'Waiting for Confirmation...' :
                            'Create Proposal'}
                </button>
            </form>
        </div>
    )
}
