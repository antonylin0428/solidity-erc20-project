/**
 * Custom Hook: useMembershipNFT
 * 
 * PURPOSE:
 * - Interact with the MembershipNFT contract
 * - Read membership information (who's a member, total supply, etc.)
 * - This hook is READ-ONLY for the NFT contract
 * - Write operations (adding members) go through the DAO contract
 * 
 * WHY A SEPARATE HOOK?
 * - MembershipNFT is a separate contract from ClubDAO
 * - We need to read NFT data (total supply, membership status, etc.)
 * - Keeps NFT logic separate from DAO logic
 * 
 * HOW IT CONNECTS:
 * - ClubDAO holds a reference to MembershipNFT
 * - DAO calls nft.mint() when adding members
 * - Frontend reads NFT data to display members
 */

import { useReadContract } from 'wagmi'
import MembershipNFTABI from '../contracts/MembershipNFT.json'

export function useMembershipNFT(nftAddress) {
  // Safety check - only query if we have a valid address
  const isValid = nftAddress && nftAddress !== '0x'

  /**
   * Read total number of minted memberships
   * 
   * CONTRACT FUNCTION:
   * function totalSupply() public view returns (uint256)
   * 
   * RETURNS: Number of NFTs minted so far
   * COST: Free (view function)
   */
  const { data: totalSupply, isLoading: loadingSupply } = useReadContract({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    functionName: 'totalSupply',
    query: {
      enabled: isValid,
    },
  })

  /**
   * Read maximum allowed memberships
   * 
   * CONTRACT FUNCTION:
   * uint256 public maxSupply;
   * 
   * RETURNS: Maximum number of members allowed
   * COST: Free (public variable)
   */
  const { data: maxSupply, isLoading: loadingMaxSupply } = useReadContract({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    functionName: 'maxSupply',
    query: {
      enabled: isValid,
    },
  })

  /**
   * Read NFT collection name
   * 
   * CONTRACT FUNCTION:
   * function name() public view returns (string)
   * 
   * RETURNS: NFT collection name (e.g., "Pizza Club")
   * COST: Free
   */
  const { data: name } = useReadContract({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    functionName: 'name',
    query: {
      enabled: isValid,
    },
  })

  /**
   * Read NFT collection symbol
   * 
   * CONTRACT FUNCTION:
   * function symbol() public view returns (string)
   * 
   * RETURNS: NFT symbol (e.g., "PIZZA")
   * COST: Free
   */
  const { data: symbol } = useReadContract({
    address: nftAddress,
    abi: MembershipNFTABI.abi,
    functionName: 'symbol',
    query: {
      enabled: isValid,
    },
  })

  /**
   * Check if a specific address is a member
   * 
   * This is a helper function that can be called with any address
   * We don't use it in the hook directly, but components can use it
   */
  const checkIsMember = (address) => {
    return useReadContract({
      address: nftAddress,
      abi: MembershipNFTABI.abi,
      functionName: 'isMember',
      args: [address],
      query: {
        enabled: isValid && !!address,
      },
    })
  }

  return {
    // NFT collection info
    name,
    symbol,
    
    // Supply information
    totalSupply: totalSupply ? Number(totalSupply) : 0,
    maxSupply: maxSupply ? Number(maxSupply) : 0,
    
    // Loading states
    isLoading: loadingSupply || loadingMaxSupply,
    
    // Helper function
    checkIsMember,
  }
}
