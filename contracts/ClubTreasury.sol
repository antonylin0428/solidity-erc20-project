// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ClubTreasury
 * @dev Simple treasury contract that can hold and send ETH
 * 
 * This is an example contract that can be used as a target for proposals.
 * When a proposal passes, it can call functions on this contract to:
 * - Send ETH to vendors (pizza, events, etc.)
 * - Track spending
 * - Manage club funds
 * 
 * In a real system, you might want more features like:
 * - Multi-signature requirements
 * - Spending limits
 * - Transaction history
 */
contract ClubTreasury {
    // Mapping to track how much ETH has been sent to each address
    mapping(address => uint256) public payments;
    
    // Total amount of ETH ever sent from this treasury
    uint256 public totalSpent;
    
    // Event emitted when ETH is sent
    event PaymentSent(address indexed recipient, uint256 amount, string description);
    
    /**
     * @dev Send ETH to an address
     * @param recipient The address to send ETH to
     * @param description Optional description of what the payment is for
     * 
     * This function can be called by anyone, but in practice it should
     * only be called by the DAO contract when executing proposals.
     * 
     * Example: Send 0.1 ETH to pizza vendor
     * sendPayment(pizzaVendorAddress, "Pizza for meeting")
     */
    function sendPayment(address recipient, string memory description) public payable {
        require(recipient != address(0), "ClubTreasury: Invalid recipient");
        require(msg.value > 0, "ClubTreasury: Must send ETH");
        
        // Track the payment
        payments[recipient] += msg.value;
        totalSpent += msg.value;
        
        // Send the ETH
        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "ClubTreasury: Transfer failed");
        
        emit PaymentSent(recipient, msg.value, description);
    }
    
    /**
     * @dev Get the balance of this treasury
     * @return uint256 The ETH balance of this contract
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Receive ETH (allows contract to accept ETH deposits)
     */
    receive() external payable {}
    
    /**
     * @dev Fallback function to receive ETH
     */
    fallback() external payable {}
}

