/**
 * Custom Hook: useClubDAOFactory
 * 
 * WHAT IS A HOOK?
 * - A hook is a React function that lets you "hook into" React features
 * - Custom hooks let us reuse stateful logic between components
 * - This hook provides functions to interact with the ClubDAOFactory contract
 * 
 * WHAT DOES THIS HOOK DO?
 * - Provides a way to read from and write to the ClubDAOFactory contract
 * - Uses Wagmi's useReadContract and useWriteContract hooks under the hood
 * - Makes it easy to call contract functions from React components
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONFIG } from '../config'

// Import ABI - path is relative to frontend/src, so we go up two levels to root
// IMPORTANT: This assumes artifacts are in the root directory
// If this doesn't work, you may need to copy the ABI to frontend/src/abis/
import ClubDAOFactoryABI from '../contracts/ClubDAOFactory.json'

/**
 * Hook to read data from the ClubDAOFactory contract
 */
export function useClubDAOFactory() {
  // Wagmi's useReadContract hook - reads data from blockchain (no transaction needed)
  const { data: organizationCount } = useReadContract({
    address: CONFIG.CLUB_DAO_FACTORY_ADDRESS,
    abi: ClubDAOFactoryABI.abi,
    functionName: 'organizationCount',
  })

  // Wagmi's useWriteContract hook - prepares write transactions
  const { 
    writeContract, 
    data: hash, 
    isPending, 
    error: writeError 
  } = useWriteContract()

  // Wagmi's useWaitForTransactionReceipt - waits for transaction to be mined
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  /**
   * Function to create a new organization
   * 
   * HOW IT WORKS:
   * 1. User calls createOrganization with name, symbol, maxMembers
   * 2. writeContract sends a transaction to the blockchain
   * 3. Transaction is broadcast to the network
   * 4. Miners include it in a block
   * 5. Once mined, the transaction is confirmed
   * 
   * WHAT HAPPENS ON THE BLOCKCHAIN:
   * - Factory deploys a new MembershipNFT contract
   * - Factory deploys a new ClubDAO contract
   * - Factory links them together
   * - Factory stores organization info
   * - Factory emits OrganizationCreated event
   */
  const createOrganization = async (name, symbol, maxMembers) => {
    try {
      await writeContract({
        address: CONFIG.CLUB_DAO_FACTORY_ADDRESS,
        abi: ClubDAOFactoryABI.abi,
        functionName: 'createOrganization',
        args: [name, symbol, maxMembers],
      })
    } catch (error) {
      console.error('Error creating organization:', error)
      throw error
    }
  }

  /**
   * Function to get organization details
   * 
   * NOTE: This is a read operation (no transaction, no gas cost)
   */
  const getOrganization = async (orgId) => {
    // This would typically use useReadContract, but for dynamic calls
    // we might need to use a different approach
    // For now, components can use useReadContract directly
  }

  return {
    // Read data
    organizationCount,
    
    // Write functions
    createOrganization,
    
    // Transaction status
    isPending,        // Transaction is being prepared/sent
    isConfirming,     // Transaction is waiting to be mined
    isConfirmed,      // Transaction was successfully mined
    hash,             // Transaction hash (can view on Etherscan)
    error: writeError,
  }
}
