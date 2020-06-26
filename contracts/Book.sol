// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

abstract contract Book {
  
  // Events
  event Booking(uint256 _volume, uint256 _tokenId, address _booker, uint256 _deposit);

  // Map book type to booker
  mapping(address => uint256) public _bookers;

  // Map booker fee to deposits
  mapping(address => uint256) public _deposits;

  /**
   * @dev bookHarvest This allows buyer to book farm harvest
   * @param _tokenId, _volume Amount to book
   */
  function bookHarvest(uint256 _tokenId, uint256 _volume) public payable virtual;
  }

