const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("ClubTreasury", function () {
  async function deployTreasuryFixture() {
    const [owner, sender, recipient1, recipient2] = await ethers.getSigners();

    const ClubTreasury = await ethers.getContractFactory("ClubTreasury");
    const treasury = await ClubTreasury.deploy();

    return { treasury, owner, sender, recipient1, recipient2 };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { treasury } = await loadFixture(deployTreasuryFixture);
      expect(treasury.target).to.be.properAddress;
    });

    it("Should start with zero balance", async function () {
      const { treasury } = await loadFixture(deployTreasuryFixture);
      expect(await treasury.getBalance()).to.equal(0);
    });

    it("Should start with zero total spent", async function () {
      const { treasury } = await loadFixture(deployTreasuryFixture);
      expect(await treasury.totalSpent()).to.equal(0);
    });
  });

  describe("receive", function () {
    it("Should accept ETH deposits", async function () {
      const { treasury, sender } = await loadFixture(deployTreasuryFixture);
      const amount = ethers.parseEther("1.0");
      
      await sender.sendTransaction({
        to: treasury.target,
        value: amount
      });

      expect(await treasury.getBalance()).to.equal(amount);
    });
  });

  describe("sendPayment", function () {
    it("Should send ETH to recipient", async function () {
      const { treasury, sender, recipient1 } = await loadFixture(deployTreasuryFixture);
      const depositAmount = ethers.parseEther("1.0");
      const sendAmount = ethers.parseEther("0.5");

      // Deposit ETH first
      await sender.sendTransaction({
        to: treasury.target,
        value: depositAmount
      });

      const initialBalance = await ethers.provider.getBalance(recipient1.address);
      
      await treasury.connect(sender).sendPayment(recipient1.address, "Test payment", {
        value: sendAmount
      });

      const finalBalance = await ethers.provider.getBalance(recipient1.address);
      expect(finalBalance - initialBalance).to.equal(sendAmount);
    });

    it("Should emit PaymentSent event", async function () {
      const { treasury, sender, recipient1 } = await loadFixture(deployTreasuryFixture);
      const amount = ethers.parseEther("0.1");

      await sender.sendTransaction({
        to: treasury.target,
        value: amount
      });

      await expect(
        treasury.connect(sender).sendPayment(recipient1.address, "Test payment", {
          value: amount
        })
      )
        .to.emit(treasury, "PaymentSent")
        .withArgs(recipient1.address, amount, "Test payment");
    });

    it("Should track payments to recipient", async function () {
      const { treasury, sender, recipient1 } = await loadFixture(deployTreasuryFixture);
      const amount1 = ethers.parseEther("0.1");
      const amount2 = ethers.parseEther("0.2");

      await sender.sendTransaction({
        to: treasury.target,
        value: amount1 + amount2
      });

      await treasury.connect(sender).sendPayment(recipient1.address, "First payment", {
        value: amount1
      });

      await treasury.connect(sender).sendPayment(recipient1.address, "Second payment", {
        value: amount2
      });

      expect(await treasury.payments(recipient1.address)).to.equal(amount1 + amount2);
    });

    it("Should update totalSpent", async function () {
      const { treasury, sender, recipient1, recipient2 } = await loadFixture(deployTreasuryFixture);
      const amount1 = ethers.parseEther("0.1");
      const amount2 = ethers.parseEther("0.2");

      await sender.sendTransaction({
        to: treasury.target,
        value: amount1 + amount2
      });

      await treasury.connect(sender).sendPayment(recipient1.address, "Payment 1", {
        value: amount1
      });

      expect(await treasury.totalSpent()).to.equal(amount1);

      await treasury.connect(sender).sendPayment(recipient2.address, "Payment 2", {
        value: amount2
      });

      expect(await treasury.totalSpent()).to.equal(amount1 + amount2);
    });

    it("Should revert if recipient is zero address", async function () {
      const { treasury, sender } = await loadFixture(deployTreasuryFixture);
      const amount = ethers.parseEther("0.1");

      await sender.sendTransaction({
        to: treasury.target,
        value: amount
      });

      await expect(
        treasury.connect(sender).sendPayment(ethers.ZeroAddress, "Test", {
          value: amount
        })
      ).to.be.revertedWith("ClubTreasury: Invalid recipient");
    });

    it("Should revert if value is zero", async function () {
      const { treasury, sender, recipient1 } = await loadFixture(deployTreasuryFixture);

      await expect(
        treasury.connect(sender).sendPayment(recipient1.address, "Test", {
          value: 0
        })
      ).to.be.revertedWith("ClubTreasury: Must send ETH");
    });

    it("Should allow multiple payments to different recipients", async function () {
      const { treasury, sender, recipient1, recipient2 } = await loadFixture(deployTreasuryFixture);
      const amount1 = ethers.parseEther("0.1");
      const amount2 = ethers.parseEther("0.2");

      await sender.sendTransaction({
        to: treasury.target,
        value: amount1 + amount2
      });

      await treasury.connect(sender).sendPayment(recipient1.address, "Payment 1", {
        value: amount1
      });

      await treasury.connect(sender).sendPayment(recipient2.address, "Payment 2", {
        value: amount2
      });

      expect(await treasury.payments(recipient1.address)).to.equal(amount1);
      expect(await treasury.payments(recipient2.address)).to.equal(amount2);
    });
  });

  describe("getBalance", function () {
    it("Should return correct balance after deposit", async function () {
      const { treasury, sender } = await loadFixture(deployTreasuryFixture);
      const amount = ethers.parseEther("1.5");

      await sender.sendTransaction({
        to: treasury.target,
        value: amount
      });

      expect(await treasury.getBalance()).to.equal(amount);
    });

    it("Should return correct balance after payment", async function () {
      const { treasury, sender, recipient1 } = await loadFixture(deployTreasuryFixture);
      const depositAmount = ethers.parseEther("1.0");
      const sendAmount = ethers.parseEther("0.3");

      await sender.sendTransaction({
        to: treasury.target,
        value: depositAmount
      });

      // sendPayment forwards msg.value from the caller, not from treasury balance
      // So the treasury balance remains unchanged (still has the depositAmount)
      await treasury.connect(sender).sendPayment(recipient1.address, "Test", {
        value: sendAmount
      });

      // Treasury balance should still be depositAmount because sendPayment forwards msg.value
      // (which comes from sender's balance, not treasury's balance)
      expect(await treasury.getBalance()).to.equal(depositAmount);
    });
  });
});
