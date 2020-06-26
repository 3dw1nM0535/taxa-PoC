// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

abstract contract Book {
  
  // Events
  event Booking(
	  uint256 _volume,
    uint256 _tokenId,
    address _booker,
    uint256 _deposit
  );
  event CancelBook(
    uint256 _supply,
    address _booker,
    uint256 _deposit,
    uint256 _volume
  );

  // Map book type to booker
  mapping(address => uint256) public _bookers;

  // Map booker fee to deposits
  mapping(address => uint256) public _deposits;

  /**
   * @dev bookHarvest This allows buyer to book farm harvest
   * @param _tokenId, _volume Amount to book
   */
  function bookHarvest(uint256 _tokenId, uint256 _volume) public payable virtual;

  /**
   * @dev cancelBook This allows booker to cancel bookings
   * @param _tokenId, _booker, _volume
   */
  function cancelBook(uint256 _tokenId, address payable _booker, uint256 _volume) public virtual;
  }

