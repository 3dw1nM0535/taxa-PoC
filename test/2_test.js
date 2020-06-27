/* eslint-disable */

const Farm = artifacts.require("Farm");

let instance;
let tokenId = 88473;
let season;
const price = web3.utils.toBN(web3.utils.toWei("1", "ether"));
const bookingFee = web3.utils.toBN(web3.utils.toWei("5", "ether"));

// Hook
before(async() => {
  instance = await Farm.deployed();
});

contract("Farm", async accounts => {
  it("Farmer can open season", async() => {
    await instance.openSeason(tokenId);
    season = await instance.getTokenSeason(tokenId);
    assert.equal(season, "Preparation", "Season should be Preparation");
  });
  it("Farm accounts for season preparations(crop selection etc)", async() => {
    const result = await instance.finishPreparations(
      tokenId,
      "Tomatoes",
      "Jobe's Organics 9026 Fertilizer"
    );
    season = await instance.getTokenSeason(tokenId);
    const log = result.logs[0].args;
    assert.equal(log._tokenId, tokenId, "Token id should be 88473")
    assert.equal(log._crop, "Tomatoes", "Crop selection should be Tomatoes");
    assert.equal(log._fertilizer, "Jobe's Organics 9026 Fertilizer");
    assert.equal(season, "Planting", "Seaon transition should be Planting");
  });
  it("Farm accounts for plantings(seeds, supplier etc)", async() => {
    const result = await instance.finishPlanting(
      tokenId,
      "Prostar F1",
      "180,000Kg/Acre",
      "Kenya Seed Company"
    );
    const log = result.logs[0].args;
    season = await instance.getTokenSeason(tokenId);
    assert.equal(log._tokenId, tokenId, "Token id should be 88473");
    assert.equal(log._seedUsed, "Prostar F1", "seed should be Prostar F1");
    assert.equal(log._expectedYield, "180,000Kg/Acre", "expected yield should be 180,000Kg/Acre");
    assert.equal(log._seedSupplier, "Kenya Seed Company", "seed supplier should be Kenya Seed Company");
    assert.equal(season, "Harvesting", "Transition season should be Harvesting");
  });
  it("Farmer can reap what he/she sow", async() => {
    const result = await instance.createHarvest(
      5,
      price,
      tokenId
    );
    const log = result.logs[0].args;
    season = await instance.getTokenSeason(tokenId);
    assert.equal(log._supply, 5, "harvest supply should be 5");
    assert.equal(log._price.toString(), price.toString(), "harvest price should be 1 ether");
    assert.equal(log._tokenId, tokenId, "Token id should be 88473");
    assert.equal(season, "Booking", "Transition season should be Booking");
  });
  it("Booker cannot book with 0 volume", async() => {
    try {
      await instance.bookHarvest(
        tokenId,
        0,
        { from: accounts[1], value: bookingFee }
      );
      
    } catch(err) {
      assert.equal(err.reason, "INVALID:0 amount", "should fail with reason");
    }
  });
  it("Booker volume should be reasonable", async() => {
    try {
      await instance.bookHarvest(
        tokenId,
        6,
        { from: accounts[1], value: bookingFee }
      );
    } catch(err) {
      assert.equal(err.reason, "RESTRICTED:amount not possible", "should fail with reason");
    }
  });
  it("Booker should not book with 0 fee", async() => {
    const price = web3.utils.toBN(web3.utils.toWei("0", "ether"));
    try {
      await instance.bookHarvest(
        tokenId,
        5,
        { from: accounts[1], value: price }
      );
    } catch(err) {
      assert.equal(err.reason, "INSUFFICIENT:booking fees", "should fail with reason");
    }
  });
  it("Booker should not book with excess fees", async() => {
    const price = web3.utils.toBN(web3.utils.toWei("6", "ether"));
    try {
      await instance.bookHarvest(
        tokenId,
        5,
        { from: accounts[1], value: price }
      );
    } catch(err) {
      assert.equal(err.reason, "INSUFFICIENT:booking fees", "should fail with reason");
    }
  });
  it("Booker should book with correct parameters", async() => {
    const result = await instance.bookHarvest(
      tokenId,
      5,
      { from: accounts[1], value: bookingFee }
    );
    const log = result.logs[0].args;
    season = await instance.getTokenSeason(tokenId);
    assert.equal(log._volume, 5, "volume should be 5");
    assert.equal(log._tokenId, tokenId, "Token id should be 88473");
    assert.equal(log._booker, accounts[1], "booker should be account 2");
    assert.equal(log._deposit.toString(), bookingFee.toString(), "booker deposit should be 5 ether");
  });
  it("Booker should not cancel booking of 0 amount", async() => {
    try {
      await instance.cancelBook(
        tokenId,
        accounts[1],
        0
      );
    } catch(err) {
      assert.equal(err.reason, "INVALID:volume");
    }
  });
  it("Booker cancelling volume should be reasonable", async() => {
    try {
      await instance.cancelBook(
        tokenId,
        accounts[1],
        6
      );
    } catch(err) {
      assert.equal(err.reason, "RESTRICTED:unreasonable volume");
    }
  });
  it("Booker should have bookings to cancel", async() => {
    try {
      await instance.cancelBook(
        tokenId,
        accounts[2],
        5
      );
    } catch(err) {
      assert.equal(err.reason, "RESTRICTED:unreasonable volume", "should fail with reason");
    }
  });
  it("Booker cancels any volume in holdings", async() => {
    const result = await instance.cancelBook(
    tokenId,
      accounts[1],
      3
    );
    const log = result.logs[0].args;
    const newDeposit = web3.utils.toBN(web3.utils.toWei("2", "ether"));
    assert.equal(log._supply, 3, "Reverted supply should amount to 3");
    assert.equal(log._booker, accounts[1], "Requestor should be account 1");
    assert.equal(log._deposit.toString(), newDeposit.toString(), "New booker deposit should be 2 ether");
    assert.equal(log._volume, 2, "New booker volume should be 2");
  });
  it("Booker cancels his/her bookings", async() => {
    const result = await instance.cancelBook(
      tokenId,
      accounts[1],
      2
    );
    const log = result.logs[0].args;
    const newDeposit = web3.utils.toBN(web3.utils.toWei("0", "ether"));
    assert.equal(log._supply, 5, "Reverted supply should amount to 5");
    assert.equal(log._booker, accounts[1], "Requestor should be account 1");
    assert.equal(log._deposit.toString(), newDeposit.toString(), "New booker deposit should be 0 ether");
    assert.equal(log._volume, 0, "New booker volume should be 0");
  });
});

