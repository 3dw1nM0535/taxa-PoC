// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

abstract contract Book {
  
  // Events
  event Booking(uint256 _volume, uint256 _tokenId, address indexed _booker, uint256 _deposit);

  // Book type
  struct BookType {
    uint256 volume;
  }

  // Map book type to booker
  mapping(address => BookType) public _bookers;

  // Map booker fee to deposits
  mapping(address => uint256) public _deposits;

  /**
   * @dev bookHarvest Book farmer(s) harvest
   * @param _volume, _tokenId
   */
  function bookHarvest(
    uint256 _volume,
    uint256 _tokenId
  ) public payable virtual;
}

