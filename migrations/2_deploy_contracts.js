/* eslint-disable */

const Farm = artifacts.require("Farm");

const name = "John Doe Farm";
const symbol = "JDF";

module.exports = function(deployer) {
  deployer.deploy(Farm, name, symbol);
};
