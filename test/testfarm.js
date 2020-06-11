const Farm = artifacts.require("Farm");

let instance;

contract("Farm test", async accounts => {

  beforeEach(async() => {
    instance = await Farm.deployed();
  });

  it("should register a farm", async() => {
    await instance.registerFarm(100, "John Doe", "farm_image_hash", "36.89384", "-1.29473");
    const owner = await instance.farms(accounts[0]);
    assert.equal(Number(owner.farmSize), 100, "farm size should be 100");
    assert.equal(String(owner.farmOwner), "John Doe", "farm owner should be John Doe");
    assert.equal(parseFloat(owner.lon), 36.89384, "farm longitude should 36.89384");
    assert.equal(parseFloat(owner.lat), -1.29473, "farm latitude should be -1.29473");
  });
  it("should not create farm with no farm size", async() => {
    try {
      await instance.registerFarm(0, "John Doe", "farm_image_hash", "36.89384", "-1.29473");
    } catch(err) {
      assert.equal(err.reason, "farm size cannot be 0", "should fail with reason");
    }
  });
  it("should not create farm with not owner", async() => {
    try {
      await instance.registerFarm(100, "", "farm_image_hash", "36.89384", "-1.29473");
    } catch(err) {
      assert.equal(err.reason, "farm owner cannot be unknown", "should fail with reason");
    }
  });
  it("should not create farm without image hash", async() => {
    try {
      await instance.registerFarm(100, "John Doe", "", "36.89384", "-1.29473");
    } catch(err) {
      assert.equal(err.reason, "farm image cannot be unknown", "should fail with reason");
    }
  });
  it("farm longitude coordinate should be known", async() => {
    try {
      await instance.registerFarm(100, "John Doe", "farm_image_hash", "", "-1.29473");
    } catch(err) {
      assert.equal(err.reason, "farm longitude coords cannot be unknown", "should fail with reason");
    }
  });
  it("farm latitude coordinate should be known", async() => {
    try {
      await instance.registerFarm(100, "John Doe", "farm_image_hash", "36.89384", "");
    } catch(err) {
      assert.equal(err.reason, "farm latitude coords cannot be unknown", "should fail with reason");
    }
  });
});
