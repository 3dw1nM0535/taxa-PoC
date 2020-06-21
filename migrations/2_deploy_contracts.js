/* eslint-disable */

const Book = artifacts.require("Registry");

module.exports = function(deployer) {
    deployer.deploy(Registry);
};
