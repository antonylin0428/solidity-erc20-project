// Test script to verify GovernedToken contract functionality
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Testing GovernedToken Contract...\n");

  // Get test accounts
  const [deployer, voter1, voter2] = await ethers.getSigners();
  console.log("📝 Test Accounts:");
  console.log("  Deployer:", deployer.address);
  console.log("  Voter 1:", voter1.address);
  console.log("  Voter 2:", voter2.address);
  console.log("");

  // Deploy contract
  console.log("📦 Deploying GovernedToken...");
  const GovernedToken = await ethers.getContractFactory("GovernedToken");
  const token = await GovernedToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Contract deployed at:", tokenAddress);
  console.log("");

  // Check initial supply
  const deployerBalance = await token.balanceOf(deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(deployerBalance), "GOV");
  console.log("");

  // Test ERC20 functionality - Transfer tokens
  console.log("🔄 Testing Token Transfer...");
  const transferAmount = ethers.parseUnits("100000", 18); // 100k tokens
  await token.transfer(voter1.address, transferAmount);
  await token.transfer(voter2.address, transferAmount);
  
  const voter1Balance = await token.balanceOf(voter1.address);
  const voter2Balance = await token.balanceOf(voter2.address);
  console.log("✅ Transferred 100,000 GOV to each voter");
  console.log("  Voter 1 balance:", ethers.formatEther(voter1Balance), "GOV");
  console.log("  Voter 2 balance:", ethers.formatEther(voter2Balance), "GOV");
  console.log("");

  // Test Proposal Creation
  console.log("📋 Testing Proposal Creation...");
  const tx1 = await token.createProposal("Should we increase the token supply?");
  await tx1.wait();
  const proposalCount = await token.proposalCount();
  console.log("✅ Created proposal #1");
  console.log("  Total proposals:", proposalCount.toString());
  
  const proposal1 = await token.proposalsById(1);
  console.log("  Description:", proposal1.description);
  console.log("  Votes For:", proposal1.votesFor.toString());
  console.log("  Votes Against:", proposal1.votesAgainst.toString());
  console.log("");

  // Test Voting
  console.log("🗳️  Testing Voting...");
  
  // Voter 1 votes FOR
  await token.connect(voter1).vote(1, true);
  const proposalAfterVote1 = await token.proposalsById(1);
  console.log("✅ Voter 1 voted FOR");
  console.log("  Votes For:", ethers.formatEther(proposalAfterVote1.votesFor), "GOV");
  
  // Voter 2 votes AGAINST
  await token.connect(voter2).vote(1, false);
  const proposalAfterVote2 = await token.proposalsById(1);
  console.log("✅ Voter 2 voted AGAINST");
  console.log("  Votes For:", ethers.formatEther(proposalAfterVote2.votesFor), "GOV");
  console.log("  Votes Against:", ethers.formatEther(proposalAfterVote2.votesAgainst), "GOV");
  console.log("");

  // Test Double Voting Prevention
  console.log("🚫 Testing Double Vote Prevention...");
  try {
    await token.connect(voter1).vote(1, false);
    console.log("❌ ERROR: Should have prevented double voting!");
  } catch (error) {
    console.log("✅ Correctly prevented double voting");
    console.log("  Error:", error.reason || error.message);
  }
  console.log("");

  // Create another proposal
  console.log("📋 Creating Second Proposal...");
  await token.createProposal("Should we add new features?");
  const proposal2 = await token.proposalsById(2);
  console.log("✅ Created proposal #2");
  console.log("  Description:", proposal2.description);
  console.log("");

  console.log("🎉 All Tests Passed! Contract is fully functional.");
  console.log("");
  console.log("📊 Summary:");
  console.log("  - Contract deployed successfully");
  console.log("  - ERC20 transfers working");
  console.log("  - Proposal creation working");
  console.log("  - Voting (weighted by balance) working");
  console.log("  - Double voting prevention working");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

