/* eslint-disable */

const Farm = artifacts.require("Farm");
const Harvest = artifacts.require("Harvest");

module.exports = function(deployer) {
  deployer.deploy(Farm);
  deployer.deploy(Harvest);
};
