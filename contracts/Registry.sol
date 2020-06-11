// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

/**
 * Register farm
 * This will register farms and their owners
 */

abstract contract Registry {

  // Farm data type
  struct FarmData {
    uint256 farmSize;
    string farmOwner;
    string farmImage;
    string lon;
    string lat;
  }

  event Register(
    address _from,
    uint256 _farmSize,
    string _farmOwner,
    string _longitude,
    string _latitude
  );

  // Map tokenId to farm data
  mapping(uint256 => FarmData) public farmRegistry;

  // Register farm
  function registerFarm(
    uint256 _farmSize,
    string memory _farmOwner,
    string memory _farmImage,
    string memory _longitude,
    string memory _latitude,
    uint256 tokenId
  ) public virtual;
}
