// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./MembershipNFT.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ClubDAO
 * @dev Governance contract for club DAOs with delegation and executable proposals
 * 
 * This contract handles:
 * - Creating proposals
 * - Voting on proposals (with delegation support)
 * - Executing proposals when they pass
 * - Delegation system (members can delegate their voting power)
 * 
 * Key concepts:
 * - Each membership NFT = 1 vote
 * - Members can delegate to another member
 * - Delegated votes count for both the delegator and delegatee
 * - Proposals can include executable actions (send ETH, call functions, etc.)
 */
contract ClubDAO is ReentrancyGuard {
    // Reference to the membership NFT contract
    MembershipNFT public membershipNFT;
    
    // Proposal struct - stores all information about a proposal
    struct Proposal {
        string description;           // What the proposal is about
        address proposer;            // Who created it
        uint256 votesFor;             // Total votes in favor
        uint256 votesAgainst;         // Total votes against
        uint256 deadline;             // When voting ends (timestamp)
        bool executed;                // Whether the proposal has been executed
        bytes actionData;             // The action to execute if proposal passes
        address target;               // The contract/address to call when executing
        uint256 value;                // ETH value to send with execution
    }
    
    // Mapping to store proposals by ID
    mapping(uint256 => Proposal) public proposalsById;
    
    // Counter for proposal IDs
    uint256 public proposalCount;
    
    // Voting period in seconds (default: 7 days)
    uint256 public votingPeriod = 7 days;
    
    // Quorum threshold - minimum votes needed for proposal to pass (as percentage)
    // e.g., 50 means 50% of members must vote
    uint256 public quorumThreshold = 50;
    
    // Mapping to track if someone has voted on a proposal
    // proposalId => voter address => has voted
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // Mapping to track how someone voted
    // proposalId => voter address => true for "for", false for "against"
    mapping(uint256 => mapping(address => bool)) public voteDirection;
    
    // DELEGATION SYSTEM
    // Mapping to track delegations: delegator => delegatee
    // If Alice delegates to Bob, delegation[Alice] = Bob
    mapping(address => address) public delegation;
    
    // Mapping to track reverse delegations: delegatee => array of delegators
    // This helps us find all people who delegated to someone
    mapping(address => address[]) public delegators;
    
    // Mapping to check if someone has delegated
    mapping(address => bool) public hasDelegated;
    
    // Events for tracking important actions
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 votes);
    event DelegationSet(address indexed delegator, address indexed delegatee);
    event DelegationRevoked(address indexed delegator);
    event ProposalExecuted(uint256 indexed proposalId);
    
    /**
     * @dev Constructor sets up the DAO
     * @param _membershipNFT Address of the MembershipNFT contract
     * 
     * When a club creates their DAO, this contract is deployed and linked to their NFT contract
     */
    constructor(address _membershipNFT) {
        membershipNFT = MembershipNFT(_membershipNFT);
    }
    
    /**
     * @dev Modifier to check if caller is a member
     * 
     * This ensures only members can perform certain actions
     */
    modifier onlyMember() {
        require(membershipNFT.isMember(msg.sender), "ClubDAO: Not a member");
        _;
    }
    
    /**
     * @dev Mint a new membership NFT to an address
     * @param to The address that will receive the membership NFT
     * 
     * This function allows members to add new members to the club.
     * In a production system, you might want to restrict this further
     * (e.g., require a proposal to add members, or limit who can add members).
     * 
     * Since the DAO contract owns the NFT contract, it can call mint().
     */
    function addMember(address to) public onlyMember {
        // The DAO contract owns the NFT contract, so it can mint
        // We need to call through the NFT contract
        membershipNFT.mint(to);
    }
    
    /**
     * @dev Create a new proposal
     * @param description What the proposal is about
     * @param target The contract address to call when executing (can be address(0) for no action)
     * @param actionData The function call data to execute
     * @param value Amount of ETH to send with the execution
     * @return proposalId The ID of the newly created proposal
     * 
     * Anyone can create a proposal, but only members can vote.
     * 
     * Example: Create a proposal to send 0.1 ETH to a pizza vendor
     * - description: "Approve $50 pizza budget"
     * - target: pizzaVendorAddress
     * - actionData: "" (empty, just sending ETH)
     * - value: 0.1 ether
     */
    function createProposal(
        string memory description,
        address target,
        bytes memory actionData,
        uint256 value
    ) public returns (uint256) {
        proposalCount++;
        
        proposalsById[proposalCount] = Proposal({
            description: description,
            proposer: msg.sender,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + votingPeriod,
            executed: false,
            actionData: actionData,
            target: target,
            value: value
        });
        
        emit ProposalCreated(proposalCount, msg.sender, description);
        return proposalCount;
    }
    
    /**
     * @dev Vote on a proposal
     * @param proposalId The ID of the proposal to vote on
     * @param support True for "yes", false for "no"
     * 
     * Voting power calculation:
     * - Base: 1 vote (your own membership NFT)
     * - If you have delegations: +1 vote for each person who delegated to you
     * - Total votes = 1 + number of delegators
     * 
     * Example:
     * - Alice has 1 NFT = 1 vote
     * - Bob delegated to Alice = Alice now has 2 votes (1 + 1 delegation)
     * - Charlie delegated to Alice = Alice now has 3 votes (1 + 2 delegations)
     */
    function vote(uint256 proposalId, bool support) public onlyMember {
        Proposal storage proposal = proposalsById[proposalId];
        
        require(proposalId > 0 && proposalId <= proposalCount, "ClubDAO: Proposal does not exist");
        require(block.timestamp <= proposal.deadline, "ClubDAO: Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "ClubDAO: Already voted");
        
        // Calculate voting power
        // Base vote: 1 (your own membership)
        uint256 votingPower = 1;
        
        // Add votes from people who delegated to you
        address[] memory myDelegators = delegators[msg.sender];
        votingPower += myDelegators.length;
        
        // Record the vote
        hasVoted[proposalId][msg.sender] = true;
        voteDirection[proposalId][msg.sender] = support;
        
        // Add votes to the proposal
        if (support) {
            proposal.votesFor += votingPower;
        } else {
            proposal.votesAgainst += votingPower;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votingPower);
    }
    
    /**
     * @dev Delegate your voting power to another member
     * @param delegatee The member you want to delegate your votes to
     * 
     * When you delegate:
     * - You can't vote yourself anymore (until you revoke)
     * - The delegatee gets +1 voting power
     * - The delegatee votes on your behalf
     * 
     * Example:
     * - Alice delegates to Bob
     * - Bob now has 2 votes (his own + Alice's)
     * - When Bob votes, it counts as 2 votes
     */
    function delegate(address delegatee) public onlyMember {
        require(membershipNFT.isMember(delegatee), "ClubDAO: Can only delegate to members");
        require(delegatee != msg.sender, "ClubDAO: Cannot delegate to yourself");
        require(!hasDelegated[msg.sender], "ClubDAO: Already delegated");
        
        // Set up the delegation
        delegation[msg.sender] = delegatee;
        hasDelegated[msg.sender] = true;
        delegators[delegatee].push(msg.sender);
        
        emit DelegationSet(msg.sender, delegatee);
    }
    
    /**
     * @dev Revoke your delegation
     * 
     * After revoking, you can vote yourself again
     */
    function revokeDelegation() public onlyMember {
        require(hasDelegated[msg.sender], "ClubDAO: No active delegation");
        
        address delegatee = delegation[msg.sender];
        
        // Remove from delegators array
        address[] storage delegateeDelegators = delegators[delegatee];
        for (uint256 i = 0; i < delegateeDelegators.length; i++) {
            if (delegateeDelegators[i] == msg.sender) {
                delegateeDelegators[i] = delegateeDelegators[delegateeDelegators.length - 1];
                delegateeDelegators.pop();
                break;
            }
        }
        
        // Clear the delegation
        delete delegation[msg.sender];
        hasDelegated[msg.sender] = false;
        
        emit DelegationRevoked(msg.sender);
    }
    
    /**
     * @dev Get the total voting power of an address (including delegations)
     * @param voter The address to check
     * @return uint256 Total voting power
     */
    function getVotingPower(address voter) public view returns (uint256) {
        if (!membershipNFT.isMember(voter)) {
            return 0;
        }
        
        // Base vote: 1
        uint256 power = 1;
        
        // Add delegations
        power += delegators[voter].length;
        
        return power;
    }
    
    /**
     * @dev Check if a proposal has passed
     * @param proposalId The proposal ID to check
     * @return bool True if the proposal passed
     * 
     * A proposal passes if:
     * - More votes "for" than "against"
     * - Quorum threshold is met (enough members voted)
     */
    function proposalPassed(uint256 proposalId) public view returns (bool) {
        Proposal memory proposal = proposalsById[proposalId];
        
        if (proposal.votesFor <= proposal.votesAgainst) {
            return false; // Didn't get majority
        }
        
        // Check quorum
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 totalMembers = membershipNFT.totalSupply();
        uint256 quorum = (totalMembers * quorumThreshold) / 100;
        
        return totalVotes >= quorum;
    }
    
    /**
     * @dev Execute a proposal that has passed
     * @param proposalId The proposal ID to execute
     * 
     * This function:
     * 1. Checks that the proposal passed
     * 2. Checks that it hasn't been executed yet
     * 3. Executes the action (calls target with calldata and value)
     * 4. Marks the proposal as executed
     * 
     * Anyone can call this function once a proposal passes.
     * 
     * Example execution:
     * - Proposal: "Send 0.1 ETH to pizza vendor"
     * - This function calls: pizzaVendorAddress with 0.1 ETH
     */
    function executeProposal(uint256 proposalId) public nonReentrant {
        Proposal storage proposal = proposalsById[proposalId];
        
        require(proposalId > 0 && proposalId <= proposalCount, "ClubDAO: Proposal does not exist");
        require(!proposal.executed, "ClubDAO: Proposal already executed");
        require(block.timestamp > proposal.deadline, "ClubDAO: Voting still active");
        require(proposalPassed(proposalId), "ClubDAO: Proposal did not pass");
        
        // Mark as executed BEFORE calling external contract (prevents reentrancy)
        proposal.executed = true;
        
        // Execute the action if there's a target
        if (proposal.target != address(0)) {
            (bool success, ) = proposal.target.call{value: proposal.value}(proposal.actionData);
            require(success, "ClubDAO: Execution failed");
        }
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Get proposal details
     * @param proposalId The proposal ID
     * @return Proposal struct with all proposal information
     */
    function getProposal(uint256 proposalId) public view returns (Proposal memory) {
        return proposalsById[proposalId];
    }
    
    /**
     * @dev Get all delegators for an address
     * @param delegatee The address to check
     * @return address[] Array of addresses who delegated to this address
     */
    function getDelegators(address delegatee) public view returns (address[] memory) {
        return delegators[delegatee];
    }
    
    /**
     * @dev Update voting period (only for future proposals)
     * @param newPeriod New voting period in seconds
     * 
     * This could be restricted to only admins or require a proposal itself
     */
    function setVotingPeriod(uint256 newPeriod) public onlyMember {
        // In a real DAO, this might require a proposal itself
        votingPeriod = newPeriod;
    }
    
    /**
     * @dev Update quorum threshold
     * @param newThreshold New threshold as percentage (0-100)
     */
    function setQuorumThreshold(uint256 newThreshold) public onlyMember {
        require(newThreshold <= 100, "ClubDAO: Threshold must be <= 100");
        quorumThreshold = newThreshold;
    }
    
    // Allow the contract to receive ETH (needed for proposals that send ETH)
    receive() external payable {}
}

