/**
 * Frontend Configuration
 * 
 * This file contains all the important addresses and settings for the frontend.
 * 
 * IMPORTANT CONCEPTS:
 * 1. Contract Addresses: These are the deployed contract addresses on the blockchain
 * 2. Chain ID: Sepolia testnet = 11155111 (mainnet = 1)
 * 3. RPC URL: The endpoint to connect to the blockchain network
 */

export const CONFIG = {
  // The ClubDAOFactory contract address on Sepolia (v2-fixed - auto-adds creator as member)
  // This is the ONLY contract we deploy manually - all other contracts
  // (NFTs, DAOs) are created by calling createOrganization() on this factory
  CLUB_DAO_FACTORY_ADDRESS: "0x8AAe77bb135D008577a5567D2311c0335C855A93",
  
  // Sepolia testnet chain ID
  CHAIN_ID: 11155111,
  
  // Public RPC endpoint for Sepolia (free, no API key needed)
  RPC_URL: "https://ethereum-sepolia-rpc.publicnode.com"
}
