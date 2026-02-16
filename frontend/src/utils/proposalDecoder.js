/**
 * Proposal Action Decoder
 * 
 * PURPOSE:
 * - Decode proposal actionData into human-readable descriptions
 * - Parse encoded function calls
 * - Display what a proposal will actually do
 * 
 * KEY CONCEPTS:
 * 
 * Ethereum encodes function calls as:
 * [4 bytes function selector] + [32 bytes per parameter]
 * 
 * Example:
 * setVotingPeriod(uint256 newPeriod)
 * 
 * 1. Function selector = first 4 bytes of keccak256("setVotingPeriod(uint256)")
 *    = 0x3f4ba83a
 * 
 * 2. Parameter (432000 seconds) encoded as 32 bytes:
 *    = 0x0000000000000000000000000000000000000000000000000000000000069780
 * 
 * 3. Full actionData:
 *    = 0x3f4ba83a0000000000000000000000000000000000000000000000000000000000069780
 */

import { decodeFunctionData, formatEther } from 'viem'
import ClubDAOABI from '../contracts/ClubDAO.json'

/**
 * Function selectors (first 4 bytes of function signature hash)
 * 
 * These are computed from keccak256(functionSignature)
 * We pre-compute them for the functions we support
 */
const FUNCTION_SELECTORS = {
  // setVotingPeriod(uint256)
  SET_VOTING_PERIOD: '0x3f4ba83a',
  
  // setQuorumThreshold(uint256)
  SET_QUORUM_THRESHOLD: '0xc5d1e7d2',
  
  // addMember(address)
  ADD_MEMBER: '0xca6d56dc',
}

/**
 * Decode a proposal's action into human-readable format
 * 
 * @param {Object} proposal - The proposal object from the contract
 * @returns {Object} Decoded action information
 * 
 * PARAMETERS EXPLAINED:
 * - proposal.target: Address the action will call
 * - proposal.actionData: Encoded function call (hex string)
 * - proposal.value: ETH amount to send (in wei)
 * 
 * RETURNS:
 * {
 *   type: 'payment' | 'setVotingPeriod' | 'setQuorum' | 'addMember' | 'unknown',
 *   description: Human-readable description,
 *   details: Additional information,
 *   icon: Emoji icon for UI,
 * }
 */
export function decodeProposalAction(proposal) {
  const { target, actionData, value } = proposal

  // Case 1: No action (text-only proposal)
  if (!target || target === '0x0000000000000000000000000000000000000000') {
    return {
      type: 'none',
      description: 'No on-chain action',
      details: 'This is a text-only proposal that does not execute any action',
      icon: '📝',
    }
  }

  // Case 2: Simple ETH transfer (no function call)
  if ((!actionData || actionData === '0x') && value && BigInt(value) > 0n) {
    return {
      type: 'payment',
      description: `Send ${formatEther(BigInt(value))} ETH`,
      details: `Transfer ${formatEther(BigInt(value))} ETH to ${target}`,
      icon: '💸',
      targetAddress: target,
      amount: formatEther(BigInt(value)),
    }
  }

  // Case 3: Function call (decode the actionData)
  if (actionData && actionData !== '0x') {
    try {
      // Extract function selector (first 4 bytes)
      const selector = actionData.slice(0, 10).toLowerCase()

      // Decode based on known function selectors
      switch (selector) {
        case FUNCTION_SELECTORS.SET_VOTING_PERIOD.toLowerCase(): {
          // Decode the function call using Viem
          const decoded = decodeFunctionData({
            abi: ClubDAOABI.abi,
            data: actionData,
          })
          
          // Convert seconds to days for readability
          const seconds = Number(decoded.args[0])
          const days = seconds / (24 * 60 * 60)
          
          return {
            type: 'setVotingPeriod',
            description: `Change voting period to ${days} days`,
            details: `This will set the voting period for all future proposals to ${seconds} seconds (${days} days)`,
            icon: '⏱️',
            newValue: days,
            unit: 'days',
          }
        }

        case FUNCTION_SELECTORS.SET_QUORUM_THRESHOLD.toLowerCase(): {
          const decoded = decodeFunctionData({
            abi: ClubDAOABI.abi,
            data: actionData,
          })
          
          const threshold = Number(decoded.args[0])
          
          return {
            type: 'setQuorum',
            description: `Change quorum threshold to ${threshold}%`,
            details: `This will require ${threshold}% of members to vote for future proposals to pass`,
            icon: '📊',
            newValue: threshold,
            unit: '%',
          }
        }

        case FUNCTION_SELECTORS.ADD_MEMBER.toLowerCase(): {
          const decoded = decodeFunctionData({
            abi: ClubDAOABI.abi,
            data: actionData,
          })
          
          const memberAddress = decoded.args[0]
          
          return {
            type: 'addMember',
            description: `Add new member`,
            details: `This will mint a membership NFT to ${memberAddress}`,
            icon: '👤',
            targetAddress: memberAddress,
          }
        }

        default: {
          // Unknown function - show raw data
          return {
            type: 'unknown',
            description: 'Custom smart contract call',
            details: `Call function on ${target} with ${actionData.length / 2 - 1} bytes of data`,
            icon: '⚙️',
            targetAddress: target,
            rawData: actionData,
          }
        }
      }
    } catch (error) {
      console.error('Error decoding action:', error)
      return {
        type: 'error',
        description: 'Unable to decode action',
        details: 'This proposal contains a complex action that cannot be automatically decoded',
        icon: '❓',
      }
    }
  }

  // Case 4: Target specified but no action or value
  return {
    type: 'interaction',
    description: 'Interact with contract',
    details: `Interact with contract at ${target}`,
    icon: '🔧',
    targetAddress: target,
  }
}

/**
 * Get a color for the action type (for UI styling)
 * 
 * @param {string} type - Action type from decodeProposalAction
 * @returns {string} Color code
 */
export function getActionColor(type) {
  const colors = {
    none: '#6c757d',           // Gray
    payment: '#28a745',        // Green
    setVotingPeriod: '#667eea', // Purple
    setQuorum: '#667eea',       // Purple
    addMember: '#17a2b8',      // Cyan
    unknown: '#ffc107',        // Yellow
    error: '#dc3545',          // Red
    interaction: '#17a2b8',    // Cyan
  }
  
  return colors[type] || '#6c757d'
}

/**
 * Format a proposal action for display in a list
 * 
 * @param {Object} proposal - The proposal object
 * @returns {string} Short one-line description
 */
export function formatActionSummary(proposal) {
  const decoded = decodeProposalAction(proposal)
  return `${decoded.icon} ${decoded.description}`
}
