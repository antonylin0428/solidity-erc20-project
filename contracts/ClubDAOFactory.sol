// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./MembershipNFT.sol";
import "./ClubDAO.sol";

/**
 * @title ClubDAOFactory
 * @dev Factory contract to deploy new ClubDAO organizations
 * 
 * This contract makes it easy to create new clubs:
 * 1. User calls createOrganization()
 * 2. Factory deploys MembershipNFT contract
 * 3. Factory deploys ClubDAO contract
 * 4. Factory links them together
 * 5. Returns both contract addresses
 * 
 * This is what your frontend will call when someone clicks "Create Organization"
 */
contract ClubDAOFactory {
    // Struct to store organization information
    struct Organization {
        address nftContract;      // Address of the MembershipNFT contract
        address daoContract;       // Address of the ClubDAO contract
        address creator;           // Who created this organization
        string name;              // Organization name
        uint256 createdAt;        // Timestamp when created
    }
    
    // Mapping to store organizations by ID
    mapping(uint256 => Organization) public organizations;
    
    // Counter for organization IDs
    uint256 public organizationCount;
    
    // Event emitted when a new organization is created
    event OrganizationCreated(
        uint256 indexed orgId,
        address indexed creator,
        address nftContract,
        address daoContract,
        string name
    );
    
    /**
     * @dev Create a new club organization
     * @param name The name of the club (e.g., "Pizza Club")
     * @param symbol The symbol for the NFT (e.g., "PIZZA")
     * @param maxMembers Maximum number of members allowed
     * @return orgId The ID of the newly created organization
     * @return nftAddress Address of the deployed MembershipNFT contract
     * @return daoAddress Address of the deployed ClubDAO contract
     * 
     * This function:
     * 1. Deploys a new MembershipNFT contract
     * 2. Deploys a new ClubDAO contract
     * 3. Transfers ownership of NFT contract to DAO contract
     * 4. Stores organization info
     * 5. Returns the addresses
     * 
     * After this, the creator can start minting membership NFTs!
     */
    function createOrganization(
        string memory name,
        string memory symbol,
        uint256 maxMembers
    ) public returns (
        uint256 orgId,
        address nftAddress,
        address daoAddress
    ) {
        // Deploy the MembershipNFT contract
        // We pass address(this) as initialOwner, then transfer to DAO later
        MembershipNFT nft = new MembershipNFT(
            name,
            symbol,
            maxMembers,
            address(this) // Temporary owner
        );
        
        // Deploy the ClubDAO contract
        // Pass the NFT contract address so DAO knows which NFTs to check
        ClubDAO dao = new ClubDAO(address(nft));
        
        // Set the DAO as the minter (allows DAO to mint memberships)
        // We keep factory as owner so it can manage the contract if needed
        nft.setMinter(address(dao));
        
        // Mint the first membership NFT to the creator
        // This makes the creator automatically a member of their own organization
        nft.mint(msg.sender);
        
        // Increment organization counter
        organizationCount++;
        orgId = organizationCount;
        
        // Store organization information
        organizations[orgId] = Organization({
            nftContract: address(nft),
            daoContract: address(dao),
            creator: msg.sender,
            name: name,
            createdAt: block.timestamp
        });
        
        emit OrganizationCreated(
            orgId,
            msg.sender,
            address(nft),
            address(dao),
            name
        );
        
        return (orgId, address(nft), address(dao));
    }
    
    /**
     * @dev Get organization details
     * @param orgId The organization ID
     * @return Organization struct with all organization information
     */
    function getOrganization(uint256 orgId) public view returns (Organization memory) {
        return organizations[orgId];
    }
    
    /**
     * @dev Get all organizations created by an address
     * @param creator The address to check
     * @return uint256[] Array of organization IDs created by this address
     * 
     * Note: This is a simple implementation. For production, you might want
     * to use events and index them off-chain for better gas efficiency.
     */
    function getOrganizationsByCreator(address creator) public view returns (uint256[] memory) {
        uint256[] memory orgIds = new uint256[](organizationCount);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= organizationCount; i++) {
            if (organizations[i].creator == creator) {
                orgIds[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = orgIds[i];
        }
        
        return result;
    }
}

