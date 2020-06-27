/* eslint-disable */
const Farm = artifacts.require("Farm");
const Harvest = artifacts.require("Harvest");

let farmInstance;
let harvestInstance;
let tokenId = 88473;
let season;
const price = web3.utils.toBN(web3.utils.toWei("1", "ether"));
const bookingFee = web3.utils.toBN(web3.utils.toWei("5", "ether"));


// Hook
before(async() => {
  farmInstance = await Farm.deployed();
  harvestInstance = await Harvest.deployed();
});

contract("Farm", async accounts => {
  it("Should tokenize farm(register)", async() => {
    const result = await farmInstance.addFarm(
      "0.9ha",
      "36.89323",
      "-1.29748",
      "QmfEiJ2xZ7W8Ltj8XJzrcvH2xQkMcwySyWfp4ksMRwEbZf",
      "Loam soil",
      tokenId
    );
    season = await farmInstance.getTokenSeason(tokenId);
    const log = result.logs[1].args;
    assert.equal(log._size, "0.9ha", "farm size should be 0.9ha");
    assert.equal(log._lon, "36.89323", "farm longitude should be 39.89323");
    assert.equal(log._lat, "-1.29748", "farm latitude should be -1.29748");
    assert.equal(log._fileHash, "QmfEiJ2xZ7W8Ltj8XJzrcvH2xQkMcwySyWfp4ksMRwEbZf", "should be an IPFS file hash");
    assert.equal(log._soilType, "Loam soil", "farm soil type should be loam");
    assert.equal(log._owner, accounts[0], "farm owner should be accounts 1");
    assert.equal(season, "Dormant", "should transition successfully");
  });
  it("Only farm owner should open season", async() => {
    try {
      await farmInstance.openSeason(tokenId, { from: accounts[1] });
    } catch(err) {
      assert.equal(err.reason, "RESTRICTED:only owner", "should fail with reason");
    }
  });
  it("Farmer should be able to open season", async() => {
    const result = await farmInstance.openSeason(tokenId);
    season = await farmInstance.getTokenSeason(tokenId);
    const log = result.logs[0].args;
    assert.equal(log._sender, accounts[0], "account should be account 1")
    assert.equal(log._season, "Dormant", "season should be Dormant");
    assert.equal(season, "Preparation", "should transition successfully");
  });
  it("Only farm owner should prepare the farm", async() => {
    try {
      await farmInstance.finishPreparations(
        tokenId,
        "Tomatoes",
        "Jobe's Prganics 9026 Fertilizer",
        { from: accounts[1] }
      );
    } catch(err) {
      assert.equal(err.reason, "RESTRICTED:only owner", "should fail with reason");
    }
  });
  it("Farmer should account land preparations", async() => {
    const result = await farmInstance.finishPreparations(
      tokenId,
      "Tomatoes",
      "Jobe's Organics 9026 Fertilizer"
    );
    const log = result.logs[0].args;
    season = await farmInstance.getTokenSeason(tokenId);
    assert.equal(log._tokenId, tokenId, "token ID should be 88473");
    assert.equal(log._crop, "Tomatoes", "crop selection should be Tomatoes");
    assert.equal(log._fertilizer, "Jobe's Organics 9026 Fertilizer", "Jobe's Organics 9026 Fertilizer");
    assert.equal(season, "Planting", "Transition season should be Planting");
  });
  it("Only farm owner should account for plantings", async() => {
    try {
      await farmInstance.finishPlanting(
        tokenId,
        "Prostar F1",
        "180,000Kg/Acre",
        "Kenya Seed Company",
        { from: accounts[1] }
      );
    } catch(err) {
      assert.equal(err.reason, "RESTRICTED:only owner", "should fail with reason");
    }
  });
  it("Farmer should account plantings", async() => {
    const result = await farmInstance.finishPlanting(
      tokenId,
      "Prostar F1",
      "180,000Kg/Acre",
      "Kenya Seed Company"
    );
    const log = result.logs[0].args;
    season = await farmInstance.getTokenSeason(tokenId);
    assert.equal(log._tokenId, tokenId, "Token ID should be 88473");
    assert.equal(log._seedUsed, "Prostar F1", "seed used should be Prostar F1");
    assert.equal(log._expectedYield, "180,000Kg/Acre", "expected yield should be 180,000Kg/Acre");
    assert.equal(log._seedSupplier, "Kenya Seed Company", "seed supplier should be Kenya Seed Company");
    assert.equal(season, "Harvesting", "transition season should be Harvesting");
  });
});

contract("Harvest", async accounts => {
  it("Only farm owner should reap what he/she sow", async() => {
   console.log(await farmInstance.ownerOf(tokenId)); 
  });
  it("Farmer should reap what he/she sow", async() => {
    const result = await harvestInstance.createHarvest(
      5,
      price,
      tokenId
    );
    const log = result.logs[0].args;
    season = await harvestInstance.getTokenSeason(tokenId);
    assert.equal(log._supply, 5, "harvest supply should be 5");
    assert.equal(log._price.toString(), price.toString(), "price per supply should be 1 ether");
    assert.equal(log._tokenId, tokenId, "token id should be 88473");
    assert.equal(season, "Booking", "Season should not transition");
  });
  it("Farm owner should not book his/her harvest", async() => {
    try {
      await harvestInstance.bookHarvest(tokenId, 5, { from: accounts[0], value: bookingFee });
    } catch(err) {
      assert.equal(err.reason, "RESTRICTED:owner cannot book", "should fail with error");
    }
  });
  it("Booker should not book with excess fees", async() => {
    try {
      const excessFees = web3.utils.toBN(web3.utils.toWei("6", "ether"));
      await harvestInstance.bookHarvest(tokenId, 5, { from: accounts[1], value: excessFees });
    } catch(err) {
      assert.equal(err.reason, "INSUFFICIENT:booking fees", "should fail with reason");
    }
  });
  it("Booker should not book with 0 fees", async() => {
    try {
      const zeroFee = web3.utils.toBN(web3.utils.toWei("0", "ether"));
      await harvestInstance.bookHarvest(tokenId, 5, { from: accounts[1], value: zeroFee });
    } catch(err) {
      assert.equal(err.reason, "INSUFFICIENT:booking fees", "should fail with reason");
    }
  });
  it("Booker should not book with insufficient fees", async() => {
    try {
      const lessFee = web3.utils.toBN(web3.utils.toWei("4", "ether"));
      await harvestInstance.bookHarvest(tokenId, 5, { from: accounts[1], value: lessFee });
    } catch(err) {
      assert.equal(err.reason, "INSUFFICIENT:booking fees", "should fail with reason");
    }
  });
  it("Booker should not book with 0(volume/amount)", async() => {
    try {
      await harvestInstance.bookHarvest(tokenId, 0, { from: accounts[1], value: bookingFee });
    } catch(err) {
      assert.equal(err.reason, "INVALID:0 amount", "should fail with reason");
    }
  });
  it("Booker should book reasonable amount/volume", async() => {
    try {
      await harvestInstance.bookHarvest(tokenId, 6, { from: accounts[1], value: bookingFee });
    } catch(err) {
      assert.equal(err.reason, "RESTRICTED:amount not possible", "should fail with reason");
    }
  });
  it("Booker should book harvest", async() => {
    const result = await harvestInstance.bookHarvest(tokenId, 5, { from: accounts[1], value: bookingFee });
    const log = result.logs[0].args;
    assert.equal(log._volume, 5, "booking volume should be 5");
    assert.equal(log._tokenId, tokenId, "token ID should be 88473");
    assert.equal(log._booker, accounts[1], "booker should be account 2 rather than account 1");
    assert.equal(log._deposit.toString(), bookingFee.toString(), "booker deposit should be 5 ether");
  });
});

