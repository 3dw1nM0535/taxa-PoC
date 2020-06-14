/* eslint-disable */

const Farm = artifacts.require("Farm");

let instance;

contract("Farm test", async accounts => {

  before(async() => {
    instance = await Farm.deployed();
  });

  it("should register a farm", async() => {
    const result = await instance.registerFarm(100, "farm_image_hash", "36.89384", "-1.29473", 884565);
    assert.equal(Number(result.logs[1].args._farmSize), 100, "farm size should be 100");
    assert.equal(parseFloat(result.logs[1].args._longitude), 36.89384, "farm longitude should 36.89384");
    assert.equal(parseFloat(result.logs[1].args._latitude), -1.29473, "farm latitude should be -1.29473");
    assert.equal(result.logs[1].args._from, accounts[0], "account should be the same");
  });
  it("should mint NFT(non-fungile token) and tokenize farm", async() => {
    const result = await instance.ownerOf(884565);
    assert.equal(result, accounts[0], "address should be equal");
  });
  it("should not duplicate token during minting", async() => {
    try {
      await instance.registerFarm(100, "farm_image_hash", "36.89384", "-1.29473", 884565);
    } catch(err) {
      assert.equal(err.reason, "ERC721: token already minted", "should fail with a reason");
    }
  });
  it("should not create farm with no farm size", async() => {
    try {
      await instance.registerFarm(0, "farm_image_hash", "36.89384", "-1.29473", 884565);
    } catch(err) {
      assert.equal(err.reason, "farm size cannot be 0", "should fail with reason");
    }
  });
  it("should not create farm without image hash", async() => {
    try {
      await instance.registerFarm(100, "", "36.89384", "-1.29473", 884565);
    } catch(err) {
      assert.equal(err.reason, "farm image cannot be unknown", "should fail with reason");
    }
  });
  it("farm longitude coordinate should be known", async() => {
    try {
      await instance.registerFarm(100, "farm_image_hash", "", "-1.29473", 884565);
    } catch(err) {
      assert.equal(err.reason, "farm longitude coords cannot be unknown", "should fail with reason");
    }
  });
  it("farm latitude coordinate should be known", async() => {
    try {
      await instance.registerFarm(100, "farm_image_hash", "36.89384", "", 884565);
    } catch(err) {
      assert.equal(err.reason, "farm latitude coords cannot be unknown", "should fail with reason");
    }
  });
});
