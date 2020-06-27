// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract Registry is ERC721 {

  constructor() public ERC721('Foo', 'FOO') {}

  // Events
  event RegisterFarm(
    string _size,
    string _lon,
    string _lat,
    string _fileHash,
    string _soilType,
    uint256 _tokenId,
    address _owner
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
  ) 
    public
  {
    // Mint token and map tokenized farm
    _safeMint(msg.sender, _tokenId);
    registry[_tokenId] = Farm(_size, _lon, _lat, _fileHash, _soilType, msg.sender);
    emit RegisterFarm(
      registry[_tokenId].size,
      registry[_tokenId].longitude,
      registry[_tokenId].latitude,
      registry[_tokenId].fileHash,
      registry[_tokenId].soilType,
      _tokenId,
      registry[_tokenId].owner
    );
  }

  /**
   * @dev whoOwns This return owner of the tokenized farm
   * @param _tokenId This is the tokenized farm
   */
  function whoOwns(uint256 _tokenId) public view returns (address) {
    return registry[_tokenId].owner;
  }
}
