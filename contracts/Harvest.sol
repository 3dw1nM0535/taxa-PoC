// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import './Book.sol';
import './Registry.sol';
import './FarmSeason.sol';

contract Harvest is FarmSeason, Book, Registry {
  
  using SafeMath for uint256;

  function addFarm(
    string memory _size,
    string memory _lon,
    string memory _lat,
    string memory _fileHash,
    string memory _soilType,
    uint256 _tokenId
  ) public override virtual{}


  // Modifier
  modifier condition(bool _condition, string memory _msg) {
    require(_condition, _msg);
    _;
  }

  // Map harvest to farm
	mapping(uint256 => HarvestType) public _harvests;

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
    inSeason(_tokenId, Season.Harvesting)
    transitionSeason(_tokenId)
    condition(msg.sender == registry[_tokenId].owner, "RESTRICTED:only owner")
  {
    _harvests[_tokenId] = HarvestType(_supply, _price);
    emit Harvesting(
      _harvests[_tokenId].supply,
      _harvests[_tokenId].price,
      _tokenId
    );
  }

  /**
   * @dev bookHarvest This allows booking of farm harvests
   * @param _tokenId, _volume Amount to book
   */
  function bookHarvest(
    uint256 _tokenId,
    uint256 _volume
  )
    public
    condition(_volume != 0, "INVALID:0 amount")
    condition(_volume <= _harvests[_tokenId].supply, "RESTRICTED:amount not possible")
    condition(msg.sender != registry[_tokenId].owner, "RESTRICTED:owner cannot book")
    condition(msg.value == _harvests[_tokenId].price.mul(_volume), "INSUFFICIENT:booking fees")
    payable
    inSeason(_tokenId, Season.Booking)
    override
  {
    _bookers[msg.sender] = _bookers[msg.sender].add(_volume);
    _harvests[_tokenId].supply = _harvests[_tokenId].supply.sub(_volume);
    _deposits[msg.sender] = msg.value;
    emit Booking(_bookers[msg.sender], _tokenId, msg.sender, _deposits[msg.sender]);

  }

  /**
   * @dev cancelBook This allows booker to cancel bookings
   * @param _tokenId, _booker, _volume Amount to revert to supply
   */
  function cancelBook(
    uint256 _tokenId,
    address payable _booker,
    uint256 _volume
  )
    public
    condition(_bookers[_booker] > 0, "RESTRICTED:no booking")
    condition(_volume <= _bookers[_booker], "RESTRICTED:unreasonable booking")
    override
  {
    uint256 _bookerRefund = _harvests[_tokenId].price.mul(_volume);
    uint256 _bookerDeposit = _deposits[_booker].sub(_bookerRefund);
    _deposits[_booker] = _bookerDeposit;
    // Update bookings
    _bookers[_booker] = _bookers[_booker].sub(_volume);
    // Update harvest
    _harvests[_tokenId].supply = _harvests[_tokenId].supply.add(_volume);
    // Refund
    emit CancelBook(
      _harvests[_tokenId].supply,
      _booker,
      _bookerDeposit,
      _bookers[_booker]
    );
    _booker.transfer(_bookerRefund);
  }
}

