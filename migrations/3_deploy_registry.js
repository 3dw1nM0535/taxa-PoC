/* eslint-disable */

const FarmRegistry = artifacts.require("FarmRegistry");

module.exports = function(deployer) {
  deployer.deploy(FarmRegistry);
}
