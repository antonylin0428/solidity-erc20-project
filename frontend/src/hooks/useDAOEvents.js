/**
 * useDAOEvents Hook
 * 
 * Monitors real-time blockchain events from the DAO contracts:
 * - ProposalCreated
 * - VoteCast
 * - ProposalExecuted
 * - MemberAdded
 * 
 * Automatically triggers callbacks when events are detected
 */

import { useWatchContractEvent } from 'wagmi'
import { useEffect } from 'react'
import ClubDAOABI from '../contracts/ClubDAO.json'
import MembershipNFTABI from '../contracts/MembershipNFT.json'
import { useToast } from './useToast'

export function useDAOEvents(daoAddress, nftAddress, options = {}) {
  const toast = useToast()
  const {
    onProposalCreated,
    onVoteCast,
    onProposalExecuted,
    onMemberAdded,
    showNotifications = true,
  } = options

  // Watch for ProposalCreated events
  useWatchContractEvent({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    eventName: 'ProposalCreated',
    onLogs(logs) {
      logs.forEach((log) => {
        const { proposalId, proposer, description } = log.args
        
        if (showNotifications) {
          toast.success(`📋 New Proposal #${proposalId?.toString()}`, { duration: 5000 })
        }
        
        // Trigger callback if provided
        onProposalCreated?.(proposalId, proposer, description)
      })
    },
    enabled: !!daoAddress,
  })

  // Watch for VoteCast events
  useWatchContractEvent({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    eventName: 'VoteCast',
    onLogs(logs) {
      logs.forEach((log) => {
        const { voter, proposalId, support } = log.args
        
        if (showNotifications) {
          const voteType = support ? 'FOR' : 'AGAINST'
          toast.info(`🗳️ Vote cast ${voteType} on Proposal #${proposalId?.toString()}`, { duration: 4000 })
        }
        
        // Trigger callback if provided
        onVoteCast?.(voter, proposalId, support)
      })
    },
    enabled: !!daoAddress,
  })

  // Watch for ProposalExecuted events
  useWatchContractEvent({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    eventName: 'ProposalExecuted',
    onLogs(logs) {
      logs.forEach((log) => {
        const { proposalId } = log.args
        
        if (showNotifications) {
          toast.success(`⚡ Proposal #${proposalId?.toString()} executed!`, { duration: 5000 })
        }
        
        // Trigger callback if provided
        onProposalExecuted?.(proposalId)
      })
    },
    enabled: !!daoAddress,
  })

  // Watch for Transfer events (new members)
  useWatchContractEvent({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    eventName: 'Transfer',
    onLogs(logs) {
      logs.forEach((log) => {
        const { from, to, tokenId } = log.args
        
        // Only notify for mints (from address 0x0)
        if (from === '0x0000000000000000000000000000000000000000' && showNotifications) {
          toast.info(`👥 New member joined! Token #${tokenId?.toString()}`, { duration: 4000 })
        }
        
        // Trigger callback if provided
        onMemberAdded?.(to, tokenId)
      })
    },
    enabled: !!nftAddress,
  })

  return {
    // Hook provides no return value, but callbacks are triggered automatically
    isMonitoring: true,
  }
}
