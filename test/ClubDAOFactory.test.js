const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("ClubDAOFactory", function () {
    async function deployFactoryFixture() {
        const [owner, creator, member1, member2] = await ethers.getSigners();

        const ClubDAOFactory = await ethers.getContractFactory("ClubDAOFactory");
        const factory = await ClubDAOFactory.deploy();

        return { factory, owner, creator, member1, member2 };
    }

    describe("Deployment", function () {
        it("Should deploy successfully", async function () {
            const { factory } = await loadFixture(deployFactoryFixture);
            expect(factory.target).to.be.properAddress;
        });

        it("Should start with zero organizations", async function () {
            const { factory } = await loadFixture(deployFactoryFixture);
            expect(await factory.organizationCount()).to.equal(0);
        });
    });

    describe("createOrganization", function () {
        it("Should create a new organization", async function () {
            const { factory, creator } = await loadFixture(deployFactoryFixture);

            const tx = await factory.connect(creator).createOrganization(
                "Pizza Club",
                "PIZZA",
                30
            );

            const receipt = await tx.wait();
            expect(await factory.organizationCount()).to.equal(1);
        });

    it("Should emit OrganizationCreated event", async function () {
      const { factory, creator } = await loadFixture(deployFactoryFixture);

      await expect(
        factory.connect(creator).createOrganization("Pizza Club", "PIZZA", 30)
      )
        .to.emit(factory, "OrganizationCreated")
        .withArgs(1, creator.address, anyValue, anyValue, "Pizza Club");
    });

        it("Should return correct organization details", async function () {
            const { factory, creator } = await loadFixture(deployFactoryFixture);

            const [orgId, nftAddress, daoAddress] = await factory
                .connect(creator)
                .createOrganization.staticCall("Pizza Club", "PIZZA", 30);

            expect(orgId).to.equal(1);
            expect(nftAddress).to.be.properAddress;
            expect(daoAddress).to.be.properAddress;
        });

        it("Should store organization information correctly", async function () {
            const { factory, creator } = await loadFixture(deployFactoryFixture);

            await factory.connect(creator).createOrganization("Pizza Club", "PIZZA", 30);

            const org = await factory.getOrganization(1);
            expect(org.name).to.equal("Pizza Club");
            expect(org.creator).to.equal(creator.address);
            expect(org.nftContract).to.be.properAddress;
            expect(org.daoContract).to.be.properAddress;
            expect(org.createdAt).to.be.greaterThan(0);
        });

        it("Should deploy linked NFT and DAO contracts", async function () {
            const { factory, creator } = await loadFixture(deployFactoryFixture);

            const tx = await factory.connect(creator).createOrganization("Pizza Club", "PIZZA", 30);
            const receipt = await tx.wait();

            const org = await factory.getOrganization(1);

            // Check NFT contract
            const MembershipNFT = await ethers.getContractFactory("MembershipNFT");
            const nft = MembershipNFT.attach(org.nftContract);
            expect(await nft.name()).to.equal("Pizza Club");
            expect(await nft.symbol()).to.equal("PIZZA");
            expect(await nft.maxSupply()).to.equal(30);

            // Check DAO contract
            const ClubDAO = await ethers.getContractFactory("ClubDAO");
            const dao = ClubDAO.attach(org.daoContract);
            expect(await dao.membershipNFT()).to.equal(org.nftContract);
        });

        it("Should set DAO as minter for NFT", async function () {
            const { factory, creator } = await loadFixture(deployFactoryFixture);

            await factory.connect(creator).createOrganization("Pizza Club", "PIZZA", 30);
            const org = await factory.getOrganization(1);

            const MembershipNFT = await ethers.getContractFactory("MembershipNFT");
            const nft = MembershipNFT.attach(org.nftContract);
            expect(await nft.minter()).to.equal(org.daoContract);
        });

        it("Should allow multiple organizations", async function () {
            const { factory, creator } = await loadFixture(deployFactoryFixture);

            await factory.connect(creator).createOrganization("Pizza Club", "PIZZA", 30);
            await factory.connect(creator).createOrganization("Book Club", "BOOK", 50);

            expect(await factory.organizationCount()).to.equal(2);

            const org1 = await factory.getOrganization(1);
            const org2 = await factory.getOrganization(2);

            expect(org1.name).to.equal("Pizza Club");
            expect(org2.name).to.equal("Book Club");
            expect(org1.nftContract).to.not.equal(org2.nftContract);
        });
    });

    describe("getOrganization", function () {
        it("Should return organization details", async function () {
            const { factory, creator } = await loadFixture(deployFactoryFixture);

            await factory.connect(creator).createOrganization("Pizza Club", "PIZZA", 30);
            const org = await factory.getOrganization(1);

            expect(org.name).to.equal("Pizza Club");
            expect(org.creator).to.equal(creator.address);
        });
    });

    describe("getOrganizationsByCreator", function () {
        it("Should return organizations created by a specific address", async function () {
            const { factory, creator, member1 } = await loadFixture(deployFactoryFixture);

            await factory.connect(creator).createOrganization("Pizza Club", "PIZZA", 30);
            await factory.connect(creator).createOrganization("Book Club", "BOOK", 50);
            await factory.connect(member1).createOrganization("Art Club", "ART", 20);

            const creatorOrgs = await factory.getOrganizationsByCreator(creator.address);
            const member1Orgs = await factory.getOrganizationsByCreator(member1.address);

            expect(creatorOrgs.length).to.equal(2);
            expect(creatorOrgs[0]).to.equal(1);
            expect(creatorOrgs[1]).to.equal(2);

            expect(member1Orgs.length).to.equal(1);
            expect(member1Orgs[0]).to.equal(3);
        });

        it("Should return empty array for address with no organizations", async function () {
            const { factory, member1 } = await loadFixture(deployFactoryFixture);

            const orgs = await factory.getOrganizationsByCreator(member1.address);
            expect(orgs.length).to.equal(0);
        });
    });
});
