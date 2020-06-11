// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

/**
 * Register farm
 * This will register farms and their owners
 */

abstract contract Registry {
  // Register farm
  function registerFarm(
    uint256 _farmSize,
    string memory _farmOwner,
    string memory _farmImage,
    string memory _Longitude,
    string memory _latitude
  )
    public
    virtual
    returns (bool);
}
