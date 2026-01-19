const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("MembershipNFT", function () {
  async function deployNFTFixture() {
    const [owner, minter, member1, member2, nonMember] = await ethers.getSigners();

    const MembershipNFT = await ethers.getContractFactory("MembershipNFT");
    const nft = await MembershipNFT.deploy(
      "Test Club",
      "TEST",
      10,
      owner.address
    );

    return { nft, owner, minter, member1, member2, nonMember };
  }

  describe("Deployment", function () {
    it("Should deploy with correct name and symbol", async function () {
      const { nft } = await loadFixture(deployNFTFixture);
      expect(await nft.name()).to.equal("Test Club");
      expect(await nft.symbol()).to.equal("TEST");
    });

    it("Should set max supply correctly", async function () {
      const { nft } = await loadFixture(deployNFTFixture);
      expect(await nft.maxSupply()).to.equal(10);
    });

    it("Should set owner correctly", async function () {
      const { nft, owner } = await loadFixture(deployNFTFixture);
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should start with zero total supply", async function () {
      const { nft } = await loadFixture(deployNFTFixture);
      expect(await nft.totalSupply()).to.equal(0);
    });
  });

  describe("setMinter", function () {
    it("Should allow owner to set minter", async function () {
      const { nft, owner, minter } = await loadFixture(deployNFTFixture);
      await nft.connect(owner).setMinter(minter.address);
      expect(await nft.minter()).to.equal(minter.address);
    });

    it("Should not allow non-owner to set minter", async function () {
      const { nft, minter, member1 } = await loadFixture(deployNFTFixture);
      await expect(
        nft.connect(member1).setMinter(minter.address)
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });
  });

  describe("mint", function () {
    it("Should allow owner to mint", async function () {
      const { nft, owner, member1 } = await loadFixture(deployNFTFixture);
      await nft.connect(owner).mint(member1.address);
      expect(await nft.balanceOf(member1.address)).to.equal(1);
      expect(await nft.isMember(member1.address)).to.be.true;
    });

    it("Should allow minter to mint after being set", async function () {
      const { nft, owner, minter, member1 } = await loadFixture(deployNFTFixture);
      await nft.connect(owner).setMinter(minter.address);
      await nft.connect(minter).mint(member1.address);
      expect(await nft.balanceOf(member1.address)).to.equal(1);
    });

    it("Should not allow unauthorized address to mint", async function () {
      const { nft, member1, member2 } = await loadFixture(deployNFTFixture);
      await expect(
        nft.connect(member1).mint(member2.address)
      ).to.be.revertedWith("MembershipNFT: Not authorized to mint");
    });

    it("Should increment token ID correctly", async function () {
      const { nft, owner, member1, member2 } = await loadFixture(deployNFTFixture);
      await nft.connect(owner).mint(member1.address);
      await nft.connect(owner).mint(member2.address);
      
      expect(await nft.memberTokenId(member1.address)).to.equal(1);
      expect(await nft.memberTokenId(member2.address)).to.equal(2);
    });

    it("Should update total supply", async function () {
      const { nft, owner, member1, member2 } = await loadFixture(deployNFTFixture);
      await nft.connect(owner).mint(member1.address);
      expect(await nft.totalSupply()).to.equal(1);
      
      await nft.connect(owner).mint(member2.address);
      expect(await nft.totalSupply()).to.equal(2);
    });

    it("Should prevent minting to address that already has membership", async function () {
      const { nft, owner, member1 } = await loadFixture(deployNFTFixture);
      await nft.connect(owner).mint(member1.address);
      
      await expect(
        nft.connect(owner).mint(member1.address)
      ).to.be.revertedWith("MembershipNFT: Address already has membership");
    });

    it("Should prevent minting beyond max supply", async function () {
      const { nft, owner } = await loadFixture(deployNFTFixture);
      const [member1, member2, member3, member4, member5, member6, member7, member8, member9, member10, member11] = await ethers.getSigners();
      
      // Mint up to max supply
      for (let i = 0; i < 10; i++) {
        const member = [member1, member2, member3, member4, member5, member6, member7, member8, member9, member10][i];
        await nft.connect(owner).mint(member.address);
      }
      
      // Try to mint one more
      await expect(
        nft.connect(owner).mint(member11.address)
      ).to.be.revertedWith("MembershipNFT: Max supply reached");
    });

    it("Should set hasMembership correctly", async function () {
      const { nft, owner, member1 } = await loadFixture(deployNFTFixture);
      expect(await nft.hasMembership(member1.address)).to.be.false;
      
      await nft.connect(owner).mint(member1.address);
      expect(await nft.hasMembership(member1.address)).to.be.true;
    });
  });

  describe("isMember", function () {
    it("Should return true for address with membership", async function () {
      const { nft, owner, member1 } = await loadFixture(deployNFTFixture);
      await nft.connect(owner).mint(member1.address);
      expect(await nft.isMember(member1.address)).to.be.true;
    });

    it("Should return false for address without membership", async function () {
      const { nft, nonMember } = await loadFixture(deployNFTFixture);
      expect(await nft.isMember(nonMember.address)).to.be.false;
    });
  });

  describe("tokenURI", function () {
    it("Should return empty string when base URI not set", async function () {
      const { nft, owner, member1 } = await loadFixture(deployNFTFixture);
      await nft.connect(owner).mint(member1.address);
      expect(await nft.tokenURI(1)).to.equal("");
    });

    it("Should return correct URI when base URI is set", async function () {
      const { nft, owner, member1 } = await loadFixture(deployNFTFixture);
      await nft.connect(owner).mint(member1.address);
      await nft.connect(owner).setBaseURI("https://example.com/metadata/");
      expect(await nft.tokenURI(1)).to.equal("https://example.com/metadata/1");
    });

    it("Should revert for non-existent token", async function () {
      const { nft } = await loadFixture(deployNFTFixture);
      await expect(nft.tokenURI(1)).to.be.revertedWith("MembershipNFT: Token does not exist");
    });
  });
});
