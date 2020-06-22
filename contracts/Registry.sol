// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

abstract contract Registry is ERC721 {

  constructor() internal ERC721('Foo', 'FOO') {}

  // Events
  event RegisterFarm(
    string _size,
    string _lon,
    string _lat,
    string _fileHash,
    string _soilType,
    uint256 _tokenId,
    address indexed _owner
  );

  // Farm type
  struct Farm {
    string size;
    string longitude;
    string latitude;
    string fileHash;
    string soilType;
    address payable owner;
  }

  // Map token to farm(tokenize farm)
  mapping(uint256 => Farm) public registry;

  /**
   * @dev addFarm Tokenize farm and add to registry
   * @param _size, _lon, _lat, _fileHash, _soilType, _tokenId
   */
  function addFarm(
    string memory _size,
    string memory _lon,
    string memory _lat,
    string memory _fileHash,
    string memory _soilType,
    uint256 _tokenId
  ) public virtual returns (bool);
}
