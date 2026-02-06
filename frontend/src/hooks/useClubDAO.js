/**
 * Custom Hook: useClubDAO
 * 
 * WHAT DOES THIS HOOK DO?
 * - Provides functions to interact with a specific ClubDAO contract
 * - Allows reading proposals, creating proposals, voting, etc.
 * 
 * HOW IT WORKS:
 * - Takes a DAO contract address as input
 * - Uses Wagmi hooks to read/write to that specific contract
 * - Returns functions and data for that DAO
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import ClubDAOABI from '../../../artifacts/contracts/ClubDAO.sol/ClubDAO.json'

export function useClubDAO(daoAddress) {
    // Only proceed if we have a valid address
    const isValid = daoAddress && daoAddress !== '0x'

    // Read proposal count
    const { data: proposalCount } = useReadContract({
        address: daoAddress,
        abi: ClubDAOABI.abi,
        functionName: 'proposalCount',
        query: {
            enabled: isValid,
        },
    })

    // Read voting period
    const { data: votingPeriod } = useReadContract({
        address: daoAddress,
        abi: ClubDAOABI.abi,
        functionName: 'votingPeriod',
        query: {
            enabled: isValid,
        },
    })

    // Read quorum threshold
    const { data: quorumThreshold } = useReadContract({
        address: daoAddress,
        abi: ClubDAOABI.abi,
        functionName: 'quorumThreshold',
        query: {
            enabled: isValid,
        },
    })

    // Write contract hook
    const {
        writeContract,
        data: hash,
        isPending,
        error: writeError
    } = useWriteContract()

    // Wait for transaction
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    /**
     * Create a new proposal
     * 
     * @param {string} description - What the proposal is about
     * @param {string} target - Address to call (or '0x0' for no action)
     * @param {string} value - ETH amount in wei (or '0' for no ETH)
     * @param {string} actionData - Encoded function call data (or '0x' for no function call)
     */
    const createProposal = async (description, target = '0x0000000000000000000000000000000000000000', value = '0', actionData = '0x') => {
        if (!isValid) throw new Error('Invalid DAO address')

        try {
            await writeContract({
                address: daoAddress,
                abi: ClubDAOABI.abi,
                functionName: 'createProposal',
                args: [
                    description,
                    target,
                    actionData,
                    BigInt(value),
                ],
            })
        } catch (error) {
            console.error('Error creating proposal:', error)
            throw error
        }
    }

    /**
     * Vote on a proposal
     * 
     * @param {number} proposalId - The proposal ID to vote on
     * @param {boolean} support - true for "yes", false for "no"
     */
    const vote = async (proposalId, support) => {
        if (!isValid) throw new Error('Invalid DAO address')

        try {
            await writeContract({
                address: daoAddress,
                abi: ClubDAOABI.abi,
                functionName: 'vote',
                args: [BigInt(proposalId), support],
            })
        } catch (error) {
            console.error('Error voting:', error)
            throw error
        }
    }

    /**
     * Execute a proposal
     * 
     * @param {number} proposalId - The proposal ID to execute
     */
    const executeProposal = async (proposalId) => {
        if (!isValid) throw new Error('Invalid DAO address')

        try {
            await writeContract({
                address: daoAddress,
                abi: ClubDAOABI.abi,
                functionName: 'executeProposal',
                args: [BigInt(proposalId)],
            })
        } catch (error) {
            console.error('Error executing proposal:', error)
            throw error
        }
    }

    return {
        // Read data
        proposalCount: proposalCount ? Number(proposalCount) : 0,
        votingPeriod: votingPeriod ? Number(votingPeriod) : 0,
        quorumThreshold: quorumThreshold ? Number(quorumThreshold) : 0,

        // Write functions
        createProposal,
        vote,
        executeProposal,

        // Transaction status
        isPending,
        isConfirming,
        isConfirmed,
        hash,
        error: writeError,
    }
}
