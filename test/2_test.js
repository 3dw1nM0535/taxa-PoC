/* eslint-disable */

const Farm = artifacts.require("Farm");

let instance;
let tokenId = 88473;
let season;
const price = web3.utils.toBN(web3.utils.toWei("1", "ether"));
const bookingFee = web3.utils.toBN(web3.utils.toWei("10", "ether"));

// Hook
before(async() => {
  instance = await Farm.deployed();
});

contract("Farm", async accounts => {
  it("Farmer can open season", async() => {
    const result = await instance.openSeason(tokenId);
    const log = result.logs[0].args;
    const currentSeasonNumber = await instance.currentSeason(tokenId);
    season = await instance.getTokenSeason(tokenId);
    assert.equal(log._seasonNumber.toString(), '1', 'Season number should be 1');
    assert.equal(season, "Preparation", "Season should be Preparation");
    assert.equal(currentSeasonNumber, 1, "Current season should be 1");
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
    assert.equal(season, "Crop Growth", "Transition season should be Harvesting");
  });
  it("Farmer can reap what he/she sow", async() => {
    const result = await instance.createHarvest(
      10,
      price,
      tokenId
    );
    const log = result.logs[0].args;
    season = await instance.getTokenSeason(tokenId);
    assert.equal(log._supply, 10, "harvest supply should be 10");
    assert.equal(log._price.toString(), price.toString(), "harvest price should be 1 ether");
    assert.equal(log._tokenId, tokenId, "Token id should be 88473");
    assert.equal(season, "Harvesting", "Transition season should be Booking");
  });
  it("Booker should not book with 0 volume", async() => {
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
        11,
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
  it("Booker should book harvest", async() => {
    const result = await instance.bookHarvest(
      tokenId,
      10,
      { from: accounts[1], value: bookingFee }
    );
    const log = result.logs[0].args;
    season = await instance.getTokenSeason(tokenId);
    assert.equal(log._volume, 10, "volume should be 10");
    assert.equal(log._supply, 0, "supply after book should be 0");
    assert.equal(log._tokenId, tokenId, "Token id should be 88473");
    assert.equal(log._booker, accounts[1], "booker should be account 2");
    assert.equal(log._deposit.toString(), bookingFee.toString(), "booker deposit should be 5 ether");
  });
  it("Booker should not confirm booking with 0 volume", async() => {
    try {
      await instance.confirmReceived(
        tokenId,
        0,
        accounts[0],
        { from: accounts[1] }
      );
    } catch(err) {
      assert.equal(err.reason, "INVALID:booking volume", "should fail with reason");
    }
  });
  it("Booker should not confirm booking even w/o bookings", async() => {
    try {
      await instance.confirmReceived(
        tokenId,
        5,
        accounts[0],
        { from: accounts[2] }
      );
    } catch(err) {
      assert.equal(err.reason, "INVALID:bookings", "should fail with reason");
    }
  });
  it("Booker should not confirm booking with unreasonable volumes", async() => {
    try {
      await instance.confirmReceived(
        tokenId,
        11,
        accounts[0],
        { from: accounts[1] }
      );
    } catch(err) {
      assert.equal(err.reason, "INVALID:bookings", "should fail with reason");
    }
  });
  it("Booker should confirm any amount of his/her bookings", async() => {
    const result = await instance.confirmReceived(
      tokenId,
      5,
      accounts[0],
      { from: accounts[1] }
    );
    const log = result.logs[0].args;
    const newDeposit = web3.utils.toBN(web3.utils.toWei("5", "ether"));
    assert.equal(log._volume, 5, "new booker volume should be 5");
    assert.equal(log._deposit.toString(), newDeposit.toString(), "new booker deposit should be 5 ether");
  });
  it("Booker should not cancel booking of 0 amount", async() => {
    try {
      await instance.cancelBook(
        tokenId,
        accounts[1],
        accounts[0],
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
        accounts[0],
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
        accounts[0],
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
      accounts[0],
      3
    );
    const log = result.logs[0].args;
    const newDeposit = web3.utils.toBN(web3.utils.toWei("2", "ether"));
    assert.equal(log._supply, 3, "Reverted supply should amount to 3");
    assert.equal(log._booker, accounts[1], "Requestor should be account 1");
    assert.equal(log._deposit.toString(), newDeposit.toString(), "New booker deposit should be 2 ether");
  });
  it("Booker cancels his/her bookings", async() => {
    const result = await instance.cancelBook(
      tokenId,
      accounts[1],
      accounts[0],
      2
    );
    const log = result.logs[0].args;
    const newDeposit = web3.utils.toBN(web3.utils.toWei("0", "ether"));
    assert.equal(log._supply, 5, "Reverted supply should amount to 5");
    assert.equal(log._booker, accounts[1], "Requestor should be account 1");
    assert.equal(log._deposit.toString(), newDeposit.toString(), "New booker deposit should be 0 ether");
  });
  it('Farmer should be able to close season', async() => {
    const result = await instance.closeSeason(tokenId);
    const log = result.logs[0].args;
    const completeSeason = await instance.completedSeasons(tokenId)
    assert.equal(log._tokenState, "Dormant", "Should reset to Dormant");
    assert.equal(completeSeason, 1, "Completed seasons should be 1");
  });
});

