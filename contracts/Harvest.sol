// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import './Book.sol';
import './FarmSeason.sol';

abstract contract Harvest is FarmSeason, Book {
  
  using SafeMath for uint256;

  // Modifier
  modifier condition(bool _condition, string memory _msg) {
    require(_condition, _msg);
    _;
  }

  
  /**
   * @dev createHarvest This allow farmer to broadcast harvest
   * @param _supply, _price, _tokenId Supply ejected from the farm
   */
  function createHarvest(
    uint256 _supply,
    uint256 _price,
    uint256 _tokenId
  )
    public
    virtual;

  /**
   * @dev bookHarvest This allows booking of farm harvests
   * @param _tokenId, _volume Amount to book
   */
  //function bookHarvest(
    //uint256 _tokenId,
    //uint256 _volume
  //)
    //public
    //payable
    //virtual;

  /**
   * @dev cancelBook This allows booker to cancel bookings
   * @param _tokenId, _booker, _volume Amount to revert to supply
   */
  //function cancelBook(
    //uint256 _tokenId,
    //address payable _booker,
    //uint256 _volume
  //)
    //public
    //condition(_bookers[_booker] > 0, "RESTRICTED:no booking")
    //condition(_volume <= _bookers[_booker], "RESTRICTED:unreasonable booking")
    //override
  //{
    //uint256 _bookerRefund = _harvests[_tokenId].price.mul(_volume);
    //uint256 _bookerDeposit = _deposits[_booker].sub(_bookerRefund);
    //_deposits[_booker] = _bookerDeposit;
    //// Update bookings
    //_bookers[_booker] = _bookers[_booker].sub(_volume);
    //// Update harvest
    //_harvests[_tokenId].supply = _harvests[_tokenId].supply.add(_volume);
    //// Refund
    //emit CancelBook(
      //_harvests[_tokenId].supply,
      //_booker,
      //_bookerDeposit,
      //_bookers[_booker]
    //);
    //_booker.transfer(_bookerRefund);
  //}
}

