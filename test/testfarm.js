/* eslint-disable */

const Farm = artifacts.require("Farm");

let instance;
const tokenId = 884565;

contract("Farm test", async accounts => {

    before(async() => {
        instance = await Farm.deployed();
    });

    it("farmer should register a farm", async() => {
        const result = await instance.registerFarm(100, "farm_image_hash", "36.89384", "-1.29473", tokenId);
        const log = result.logs[1].args;
        assert.equal(log._owner, accounts[0], "farm owner should be known");
        assert.equal(Number(log._farmSize), 100, "farm size should be 100");
        assert.equal(parseFloat(log._longitude), 36.89384, "farm longitude should 36.89384");
        assert.equal(parseFloat(log._latitude), -1.29473, "farm latitude should be -1.29473");
        assert.equal(log._owner, accounts[0], "account should be the same");
    });
    it("farmer should mint NFT(non-fungile token) and tokenize farm", async() => {
        const result = await instance.ownerOf(tokenId);
        assert.equal(result, accounts[0], "address should be equal");
    });
    it("farmer should not duplicate token during minting", async() => {
        try {
            await instance.registerFarm(100, "farm_image_hash", "36.89384", "-1.29473", tokenId);
        } catch(err) {
            assert.equal(err.reason, "ERC721: token already minted", "should fail with a reason");
        }
    });
    it("farmer should not create farm with no farm size", async() => {
        try {
            await instance.registerFarm(0, "farm_image_hash", "36.89384", "-1.29473", tokenId);
        } catch(err) {
            assert.equal(err.reason, "farm size cannot be 0", "should fail with reason");
        }
    });
    it("farmer should not create farm without image hash", async() => {
        try {
            await instance.registerFarm(100, "", "36.89384", "-1.29473", tokenId);
        } catch(err) {
            assert.equal(err.reason, "farm image cannot be unknown", "should fail with reason");
        }
    });
    it("farm longitude coordinate should be known", async() => {
        try {
            await instance.registerFarm(100, "farm_image_hash", "", "-1.29473", tokenId);
        } catch(err) {
            assert.equal(err.reason, "farm longitude coords cannot be unknown", "should fail with reason");
        }
    });
    it("farm latitude coordinate should be known", async() => {
        try {
            await instance.registerFarm(100, "farm_image_hash", "36.89384", "", tokenId);
        } catch(err) {
            assert.equal(err.reason, "farm latitude coords cannot be unknown", "should fail with reason");
        }
    });
    it("farmer should not register farm with 0 token number", async() => {
        try {
            await instance.registerFarm(100, "farm_image_hash", "36.89384", "-1.29473", 0);
        } catch(err) {
            assert.equal(err.reason, "invalid token", "should fail with reason");
        }
    });
    it("unknown farm owner cannot create harvest", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("1", "ether"));
        try {
            await instance.createHarvest(1600126318, 1, bigNumber, "Tomatoes", 38829);
        } catch(err) {
            assert.equal(err.reason, "invalid token", "should fail with reason");
        }
    });
    it("farm owner can create harvest contract", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("2", "ether"));
        const result = await instance.createHarvest(1600126318, 3, bigNumber, "Tomatoes", tokenId);
        const log = result.logs[0].args;
        assert.equal(Number(log._date), 1600126318, "harvest date should be 1600126318");
        assert.equal(Number(log._supply), 3, "total supply should be 3");
        assert.equal(Number(log._pricePerSupply), bigNumber, "price should be 2000000000000000000");
        assert.equal(String(log._cropName), "Tomatoes", "crop type should be Tomatoes");
    });
    it("farmer cannot  create over-surplus harvest", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("1", "ether"));
        try {
            await instance.createHarvest(1600126319, 2, bigNumber, "Potatoes", tokenId);
        } catch(err) {
            assert.equal(err.reason, "previous harvest season supply not exhausted", "should fail with reason");
        }
    });
    it("buyer should not book from farm with 0 token", async() => {
        try {
            await instance.bookHarvest(1, 0, { from: accounts[1] });
        } catch(err) {
            assert.equal(err.reason, "invalid token", "should fail with reason");
        }
    });
    it("buyer should not from farm with invalid token", async() => {
        try {
            await instance.bookHarvest(1, 9493, { from: accounts[1] });
        } catch(err) {
            assert.equal(err.reason, "invalid token", "should fail with reason");
        }
    });
    it("farmer cannot recreate harvest if previous harvest season supply is not exhausted&with diff crop type", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("2", "ether"));
        try {
            await instance.createHarvest(1600126359, 10, bigNumber, "Beans", tokenId);
        } catch(err) {
            assert.equal(err.reason, "previous harvest season supply not exhausted");
        }
    });
    it("buyer can book farm harvest", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("6", "ether"));
        const result = await instance.bookHarvest(3, tokenId, { from: accounts[1], value: bigNumber });
        const log = result.logs[0].args;
        assert.equal(log._booker, accounts[1], "booking account should be account 2");
        assert.equal(Number(log._amnt), 3, "booking amount should be 3");
    });
    it("farmer can create a new second wave of harvest", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("2", "ether"));
        const result = await instance.createHarvest(1600126359, 2, bigNumber, "Beans", tokenId);
        const log = result.logs[0].args;
        assert.equal(Number(log._date), 1600126359, "new harvest date should be 1600126359");
        assert.equal(Number(log._supply), 2, "total supply should be 100");
        assert.equal(Number(log._pricePerSupply), bigNumber, "price should be 2000000000000000000");
        assert.equal(String(log._cropName), "Beans", "crop type should be beans");
    });
    it("farmer can recreate harvest supply with same crop&add to previous harvest season supply", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("2", "ether"));
        const result = await instance.createHarvest(1600126359, 1000, bigNumber, "Beans", tokenId);
        const log = result.logs[0].args;
        assert.equal(Number(log._date), 1600126359, "harvest date should be 1600126359");
        assert.equal(Number(log._supply), 1000, "price should be 1000");
        assert.equal(Number(log._pricePerSupply), bigNumber, "price should be 2000000000000000000");
        assert.equal(String(log._cropName), "Beans", "crop type should be Tomatoes");
    });
    it("farmer should be able to update pricing only", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("3", "ether"));
        const result = await instance.createHarvest(1600126359, 1000, bigNumber, "Beans", tokenId);
        const log = result.logs[0].args;
        assert.equal(Number(log._newPrice), bigNumber, "new pricing should be 540");
    });
    it("farmer should not book from own farm", async() => {
        try {
            await instance.bookHarvest(100, tokenId);
        } catch(err) {
            assert.equal(err.reason, "cannot book from own farm", "should fail with reason");
        }
    });
    it("buyer cannot book more that available harvest supply", async() => {
        try {
            await instance.bookHarvest(101, tokenId, { from: accounts[1] });
        } catch(err) {
            assert.equal(err.reason, "no enough supply to cover your booking", "should fail with reason");
        }
    });
    it("buyer should book harvest with 0 amount request", async() => {
        try {
            await instance.bookHarvest(0, tokenId, { from: accounts[1] });
        } catch(err) {
            assert.equal(err.reason, "booking amount cannot be 0", "should fail with reason");
        }
    });
    it("farm owner should not create harvest contract with invalid harvest date", async() => {
        try {
            await instance.createHarvest(0, 100, 2000, "Tomatoes", tokenId);
        } catch(err) {
            assert.equal(err.reason, "invalid harvest date", "should fail with reason");
        }
    });
    it("farm owner should not create harvest contract with 0 supply", async() => {
        try {
            await instance.createHarvest(1600126318, 0, 2000, "Tomatoes", tokenId);
        } catch(err) {
            assert.equal(err.reason, "supply cannot be 0", "should fail with reason");
        }
    });
    it("farm owner should not create harvest contract with no pricing", async() => {
        try {
            await instance.createHarvest(1600126318, 100, 0, "Tomatoes", tokenId);
        } catch(err) {
            assert.equal(err.reason, "price cannot be 0", "should fail with reason");
        }
    });
    it("farm owner should not create harvest contract with no crop type", async() => {
        try {
            await instance.createHarvest(1600126318, 100, 2000, "", tokenId);
        } catch(err) {
            assert.equal(err.reason, "crop type should be provided", "should fail with reason");
        }
    });
    after(async() => {
        instance = null;
    });
});
