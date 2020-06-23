/* eslint-disable */
const Farm = artifacts.require("Farm");

let instance;
const tokenId = 88473;
const price = web3.utils.toBN(web3.utils.toWei("1", "ether"));
const bookingFee = web3.utils.toBN(web3.utils.toWei("2", "ether"));
   

// Hook
before(async() => {
  instance = await Farm.deployed();
});

contract("Farm", async accounts => {
  it("Should tokenize farm(register)", async() => {
    const result = await instance.addFarm(
      "0.9ha",
      "36.89323",
      "-1.29748",
      "QmfEiJ2xZ7W8Ltj8XJzrcvH2xQkMcwySyWfp4ksMRwEbZf",
      "Loam soil",
      tokenId
    );
    const log = result.logs[1].args;
    assert.equal(log._size, "0.9ha", "farm size should be 0.9ha");
    assert.equal(log._lon, "36.89323", "farm longitude should be 39.89323");
    assert.equal(log._lat, "-1.29748", "farm latitude should be -1.29748");
    assert.equal(log._fileHash, "QmfEiJ2xZ7W8Ltj8XJzrcvH2xQkMcwySyWfp4ksMRwEbZf", "should be an IPFS file hash");
    assert.equal(log._soilType, "Loam soil", "farm soil type should be loam");
    assert.equal(log._owner, accounts[0], "farm owner should be accounts 1");
  });
  it("Should create harvest for tokenized farm", async() => {
    const result = await instance.createHarvest(
      1603459604,
      2,
      price,
      "Tomatoes",
      tokenId
    ); 
    const log = result.logs[0].args;
    assert.equal(log._date, 1603459604, "harvest date should be 1603459604");
    assert.equal(log._supply, 2, "supply should be 2");
    assert.equal(log._price.toString(), price.toString(), "price should be 1 ether")
    assert.equal(log._crop, "Tomatoes", "harvest crop should be Tomatoes");
    assert.equal(log._tokenId, tokenId, "tokenized farm id should be 88473"); 
  });
  it("Should restrict harvest to farm owner", async() => {
    try {
      await instance.createHarvest(
        1603459604,
        2,
        price,
        "Tomatoes",
        tokenId,
        { from: accounts[2] }
      );
    } catch(err) {
      assert.equal(err.reason, "RESTRICTED:only owner can harvest", "should fail with reason");
    }
  });
  it("Should not create second harvest rather resupply", async() => {
    try {
      await instance.createHarvest(
        1603459604,
        2,
        price,
        "Tomatoes",
        tokenId
      );
    } catch(err) {
      assert.equal(err.reason, "INVALID:harvest", "should fail with reason");
    }
  });
  it("Should not resupply during oversupply", async() => {
    try {
      await instance.reSupply(
        1603459604,
        2,
        "Tomatoes",
        tokenId
      );
    } catch(err) {
      assert.equal(err.reason, "OVERSUPPLY:previous harvest not exhausted", "should fail with reason");
    }
  });
  it("Should book with sufficient booking fees", async() => {
    const fee = web3.utils.toBN(web3.utils.toWei("0", "ether"));
    try {
      await instance.bookHarvest(2, tokenId, { from: accounts[1], value: fee });
    } catch(err) {
      assert.equal(err.reason, "INSUFFICIENT:booking fees", "should fail with reason");
    }
  });
  it("Should book normal amounts", async() => {
    try {
      await instance.bookHarvest(3, tokenId, { from: accounts[1], value: bookingFee });
    } catch(err) {
      assert.equal(err.reason, "INSUFFICIENT:supply", "should fail with reason");
    }
  });
  it("Should not book with 0 amount", async() => {
    try {
      await instance.bookHarvest(0, tokenId, { from: accounts[1], value: bookingFee });
    } catch(err) {
      assert.equal(err.reason, "INSUFFICIENT:booking amount", "should fail with reason");
    }
  });
  it("Should not book own farm", async() => {
    try {
      await instance.bookHarvest(2, tokenId, { from: accounts[0], value: bookingFee });
    } catch(err) {
      assert.equal(err.reason, "RESTRICTED:owner cannot book harvest", "should fail with reason");
    }
  });
  it("Should book harvest", async() => {
    const result = await instance.bookHarvest(2, tokenId, { from: accounts[1], value: bookingFee });
    const log = result.logs[0].args;
    assert.equal(log._volume, 2, "booking amount should be 1");
    assert.equal(log._tokenId, tokenId, "booked tokenized farm harvest should be 88473");
    assert.equal(log._booker, accounts[1], "booker should be account 2");
    assert.equal(log._deposit.toString(), bookingFee.toString(), "booker deposit should be 2 ether");
  });
  it("Should always resupply for the future", async() => {
    try {
      await instance.reSupply(
        1603459604,
        2,
        "Tomatoes",
        tokenId
      );
    } catch(err) {
      assert.equal(err.reason, "INVALID:harvest for the future", "should fail with reason");
    }
  });
  it("Should restrict resupply to owner", async() => {
    try {
      await instance.reSupply(
        1603459734,
        2,
        "Tomatoes",
        tokenId,
        { from: accounts[2] }
      );
    } catch(err) {
      assert.equal(err.reason, "RESTRICTED:only owner can resupply", "should fail with reason");
    }
  });
  it("Should resupply harvest for exhausted supply", async() => {
    const result = await instance.reSupply(
      1603459734,
      2,
      "Tomatoes",
      tokenId
    );
    const log = result.logs[0].args;
    assert.equal(log._date, 1603459734, "resupply harvest data should be 1603459734");
    assert.equal(log._supply, 2, "resupply amount should be 2")
    assert.equal(log._crop, "Tomatoes", "resupply crop should be Tomatoes");
    assert.equal(log._tokenId, tokenId, "resupply tokenized farm should be 88473");
  });
});

after(async() => {
  instance = null;
});
