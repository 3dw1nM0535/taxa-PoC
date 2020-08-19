// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

abstract contract Book {
  
  // Events
  event Booking(
	  uint256 _volume,
    uint256 _supply,
    uint256 _tokenId,
    address _booker,
    uint256 _deposit,
    bool _delivered
  );
  event Received(
    uint256 _volume,
    uint256 _deposit,
    bool _delivered
  );
  event CancelBook(
    uint256 _supply,
    address _booker,
    uint256 _deposit
  );

  struct BookStatus {
    bool delivered;
  }

  // Map book type to booker
  mapping(address => uint256) public _bookers;

  // Map book status to booker;
  mapping(address => BookStatus) public _bookStatus;

  // Map booker fee to deposits
  mapping(address => uint256) public _deposits;

  /**
   * @dev bookHarvest This allows buyer to book farm harvest
   * @param _tokenId, _volume Amount to book
   */
  function bookHarvest(uint256 _tokenId, uint256 _volume) public payable virtual;

  /**
   * @dev cancelBook This allows booker to cancel bookings
   * @param _tokenId, _payee, _booker, _payee(farme), _volume Charge _booker 3% and reward _payee(farm owner/harvest creator)
   */
  function cancelBook(uint256 _tokenId, address payable _booker, address payable _payee, uint256 _volume) public virtual;

  /**
   * @dev confirmReceived This confirms the booker received his/her bookings
   * @param _tokenId, _volume, _payee This is the tokenized farm harvest and the
   * booking volume to confirm received
   */
  function confirmReceived(uint256 _tokenId, uint256 _volume, address payable _payee) public virtual;
}

