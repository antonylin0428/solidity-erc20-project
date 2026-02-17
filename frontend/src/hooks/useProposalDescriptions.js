/**
 * Custom Hook: useProposalDescriptions
 * 
 * WHAT DOES THIS HOOK DO?
 * - Fetches proposal descriptions from ProposalCreated event logs
 * - Builds a map of proposalId => description
 * - This is a GAS OPTIMIZATION: descriptions are NOT stored on-chain,
 *   only emitted in events (much cheaper!)
 * 
 * HOW IT WORKS:
 * - Queries ProposalCreated events from the blockchain
 * - Extracts description from each event
 * - Returns a map for quick lookups: { proposalId: "description" }
 */

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { parseAbiItem } from 'viem'
import ClubDAOABI from '../contracts/ClubDAO.json'

export function useProposalDescriptions(daoAddress) {
  const [descriptions, setDescriptions] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

  useEffect(() => {
    if (!daoAddress || !publicClient) return

    const fetchDescriptions = async () => {
      try {
        setIsLoading(true)

        // Query ProposalCreated events
        // Event signature: ProposalCreated(uint256 indexed proposalId, address indexed proposer, bytes32 indexed descriptionHash, string description)
        const logs = await publicClient.getLogs({
          address: daoAddress,
          event: parseAbiItem('event ProposalCreated(uint256 indexed proposalId, address indexed proposer, bytes32 indexed descriptionHash, string description)'),
          fromBlock: 0n,
          toBlock: 'latest'
        })

        // Build map: proposalId => description
        const descMap = {}
        logs.forEach(log => {
          const { proposalId, description } = log.args
          descMap[Number(proposalId)] = description
        })

        setDescriptions(descMap)
      } catch (error) {
        console.error('Error fetching proposal descriptions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDescriptions()
  }, [daoAddress, publicClient])

  /**
   * Get description for a specific proposal ID
   * @param {number} proposalId - The proposal ID
   * @returns {string} The description or a fallback message
   */
  const getDescription = (proposalId) => {
    return descriptions[proposalId] || `Proposal #${proposalId}`
  }

  return {
    descriptions,
    getDescription,
    isLoading
  }
}
