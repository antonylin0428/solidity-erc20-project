// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GovernedToken is ERC20 {
    // Proposal struct to store proposal information
    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
    }

    // Mapping to store proposals by ID
    mapping(uint256 => Proposal) public proposalsById;
    
    // Counter to track the number of proposals
    uint256 public proposalCount;
    
    // Mapping to track if an address has voted on a proposal
    // proposalId => voter address => has voted
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    constructor() ERC20("GovernedToken", "GOV") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Function to create a new proposal
    function createProposal(string memory description) public returns (uint256) {
        proposalCount++;
        proposalsById[proposalCount] = Proposal({
            description: description,
            votesFor: 0,
            votesAgainst: 0,
            executed: false
        });
        return proposalCount;
    }

    // Function to vote on a proposal (weighted by token balance)
    function vote(uint256 proposalId, bool support) public {
        require(proposalId > 0 && proposalId <= proposalCount, "Proposal does not exist");
        require(!hasVoted[proposalId][msg.sender], "Already voted on this proposal");
        
        uint256 voterBalance = balanceOf(msg.sender);
        require(voterBalance > 0, "Must own tokens to vote");
        
        Proposal storage proposal = proposalsById[proposalId];
        
        if (support) {
            proposal.votesFor += voterBalance;
        } else {
            proposal.votesAgainst += voterBalance;
        }
        
        hasVoted[proposalId][msg.sender] = true;
    }
}

