/* eslint-disable */

const Delivery = artifacts.require("Delivery");

let instance;
const dataHash = "QmXV7pL1CB7A8Tzk7jP2XE9kRyk8HZd145KDptdxzmNLfu";

contract("Delivery", async accounts => {
    before(async() => {
        instance = await Delivery.deployed();
    });

    it("delivery should be able to onboard", async() => {
        const result = await instance.onboardDelivery(dataHash);
        const log = result.logs[0].args;
        assert.equal(log._delivery, accounts[0], "msg.sender should be account 1");
    });
    it("should not onboard delivery with no data", async() => {
        try {
            await instance.onboardDelivery("");
        } catch(err) {
            assert.equal(err.reason, "data hash cannot be empty", "should fail with reason");
        }
    });
    it("should make offer to delivery", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("4", "ether"));
        const result = await instance.makeOffer(accounts[0], "Corn", 20, 1600038493, "36.89483", "-1.29738", { from: accounts[1], value: bigNumber });
        const log = result.logs[0].args;
        assert.equal(log._client, accounts[1], "client should be account 2");
        assert.equal(log._rider, accounts[0], "rider should be account 1");
    });
    it("should not make offer to myself", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("3", "ether"));
        try {
            await instance.makeOffer(accounts[0], "Corn", 20, 1600038493, "36.89483", "-1.29738", { from: accounts[0], value: bigNumber });
        } catch(err) {
            assert.equal(err.reason, "cannot make offer to yourself", "should fail with reason");
        }
    });
    it("should not make offer with 0 fees", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("0", "ether"));
        try {
            await instance.makeOffer(accounts[0], "Corn", 20, 1600038493, "36.89483", "-1.29738", { from: accounts[1], value: bigNumber });
        } catch(err) {
            assert.equal(err.reason, "fee cannot be 0", "should fail with reason");
        }
    });
    it("should be able to accept offers", async() => {
        const result = await instance.acceptOffer(accounts[1]);
        const log = result.logs[0].args;
        assert.equal(log._rider, accounts[0], "rider should be account 1");
        assert.equal(log._from, accounts[1], "client should be account 2");
        assert.equal(log._accept, true, "acceptance status should be true");
        assert.equal(log._reject, false, "rejection status should be false");
    });
    it("should not accept invalid offers", async() => {
        try {
            await instance.acceptOffer(accounts[2]);
        } catch(err) {
            assert.equal(err.reason, "you don't have any offers", "should fail with reason");
        }
    });
    it("only delivery/rider can accept offers", async() => {
        try {
            await instance.acceptOffer(accounts[1], { from: accounts[1] });
        } catch(err) {
            assert.equal(err.reason, "only delivery can accept offers", "should fail with reason");
        }
    });
    it("should be able to reject offers", async() => {
        const bigNumber = web3.utils.toBN(web3.utils.toWei("4", "ether"));
        const result = await instance.rejectOffer(accounts[1]);
        const log = result.logs[0].args;
        assert.equal(log._rider, accounts[0], "rider should be account 1");
        assert.equal(log._from, accounts[1], "client should be account 2");
        assert.equal(log._accept, false, "acceptance status should be false");
        assert.equal(log._reject, true, "rejection status should be true");
        assert.equal(Number(log._refund), bigNumber, "refund fee should be 4 Eth");
    });
    it("should not reject invalid offers", async() => {
        try {
            await instance.rejectOffer(accounts[2]);
        } catch(err) {
            assert.equal(err.reason, "you don't have any offers", "should fail with reason");
        }
    });
    it("only delivery/rider can reject offers", async() => {
        try {
            await instance.rejectOffer(accounts[1], { from: accounts[1] });
        } catch(err) {
            assert.equal(err.reason, "only delivery can reject offers", "should fail with reason");
        }
    });
});
