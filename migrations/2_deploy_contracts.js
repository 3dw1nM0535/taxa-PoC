/* eslint-disable */

const Farm = artifacts.require("Farm");
const StringUtils = artifacts.require("StringUtils");

const name = "John Doe Farm";
const symbol = "JDF";

module.exports = function(deployer) {
    deployer.deploy(StringUtils);
    deployer.link(StringUtils, Farm);
    deployer.deploy(Farm, name, symbol);
};
