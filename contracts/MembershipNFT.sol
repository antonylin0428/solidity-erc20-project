// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MembershipNFT
 * @dev ERC721 token representing membership in a club DAO
 * 
 * This contract represents membership NFTs for a club. Each NFT is:
 * - A unique membership ID
 * - Proof of membership
 * - Voting power (1 NFT = 1 vote)
 * - Access key to the DAO
 * 
 * Key features:
 * - Only the owner (DAO contract) can mint new memberships
 * - Fixed supply set at deployment
 * - Each member gets exactly one NFT
 */
contract MembershipNFT is ERC721, Ownable, ReentrancyGuard {
    // Counter for token IDs (starts at 1)
    uint256 private _tokenIdCounter;
    
    // Maximum supply of membership NFTs
    uint256 public maxSupply;
    
    // Base URI for token metadata (for OpenSea, etc.)
    string private _baseTokenURI;
    
    // Mapping to track if an address already has a membership NFT
    // This ensures one person = one membership
    mapping(address => bool) public hasMembership;
    
    // Mapping to track which token ID belongs to which address
    // This helps us find someone's membership NFT quickly
    mapping(address => uint256) public memberTokenId;
    
    // Address that can mint NFTs (usually the DAO contract)
    address public minter;
    
    /**
     * @dev Constructor sets up the NFT contract
     * @param name The name of the NFT collection (e.g., "ClubDAO Membership")
     * @param symbol The symbol (e.g., "CLUB")
     * @param _maxSupply Maximum number of memberships allowed
     * @param initialOwner The address that will own this contract (usually the DAO contract)
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        maxSupply = _maxSupply;
        _tokenIdCounter = 1; // Start token IDs at 1
        minter = address(0); // Will be set by owner
    }
    
    /**
     * @dev Set the minter address (can only be called by owner)
     * @param _minter The address that will be allowed to mint NFTs
     */
    function setMinter(address _minter) public onlyOwner {
        minter = _minter;
    }
    
    /**
     * @dev Mint a new membership NFT to an address
     * @param to The address that will receive the membership NFT
     * 
     * Requirements:
     * - Only the owner or minter can call this
     * - Must not exceed maxSupply
     * - Address must not already have a membership
     * 
     * This is called when adding new members to the club
     */
    function mint(address to) public nonReentrant {
        require(msg.sender == owner() || msg.sender == minter, "MembershipNFT: Not authorized to mint");
        require(_tokenIdCounter <= maxSupply, "MembershipNFT: Max supply reached");
        require(!hasMembership[to], "MembershipNFT: Address already has membership");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Mark that this address now has membership
        hasMembership[to] = true;
        memberTokenId[to] = tokenId;
        
        // Mint the NFT
        _safeMint(to, tokenId);
    }
    
    /**
     * @dev Check if an address owns a membership NFT
     * @param account The address to check
     * @return bool True if the address owns at least one membership NFT
     * 
     * This is used by the DAO to verify membership before allowing actions
     */
    function isMember(address account) public view returns (bool) {
        return hasMembership[account] && balanceOf(account) > 0;
    }
    
    /**
     * @dev Get the total number of minted memberships
     * @return uint256 Current number of memberships minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    /**
     * @dev Set the base URI for token metadata
     * @param baseURI The base URI string
     * 
     * This allows you to set where the NFT images/metadata are stored
     * (e.g., IPFS, Arweave, or your own server)
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Override the tokenURI function to use our base URI
     * @param tokenId The token ID to get the URI for
     * @return string The full token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "MembershipNFT: Token does not exist");
        
        string memory baseURI = _baseTokenURI;
        return bytes(baseURI).length > 0 
            ? string(abi.encodePacked(baseURI, Strings.toString(tokenId)))
            : "";
    }
    
    // Note: Transfer restrictions can be added later using OpenZeppelin's hooks
    // For now, memberships are transferable. To make them non-transferable,
    // you would need to override the appropriate transfer functions based on
    // your OpenZeppelin version.
}

