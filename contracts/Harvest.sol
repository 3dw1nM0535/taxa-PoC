// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import './Book.sol';

abstract contract Harvest is Book {

  using SafeMath for uint256;

	// Events
	event Harvesting(
		uint256 _date,
		uint256 _supply,
		uint256 _price,
		string _crop,
		uint256 _tokenId
	);
	event Resupply (uint256 _date, uint256 _supply, string _crop, uint256 _tokenId);
	
	// Harvest type
	struct HarvestType {
		uint256 date;
		uint256 supply;
		uint256 price;
		string crop;
	}

	// Map harvest to farm
	mapping(uint256 => HarvestType) public _harvests;

  // Modifiers
  modifier condition(bool _condition, string memory _msg) virtual {
    require(_condition, _msg);
    _;
  }

	/**
	 * @dev createHarvest Allow farm to create harvest
	 * @param _date, _supply, _price, _crop, _tokenId
	 */
	function createHarvest(
		uint256 _date,
		uint256 _supply,
		uint256 _price,
		string memory _crop,
		uint256 _tokenId
	) public virtual;

	/**
	 * @dev reSupply Add supply to existing and exhausted harvest supply
	 * @param _date, _supply, _price, _crop, _tokenId
	 */
	function reSupply(
		uint256 _date,
		uint256 _supply,
		string memory _crop,
		uint256 _tokenId
	) public virtual;

  /**
   * @dev bookHarvest Book farmer(s) harvest
   * @param _volume, _tokenId
   */
  function bookHarvest(
    uint256 _volume,
    uint256 _tokenId
  )
    public
    condition(_volume != 0, "INSUFFICIENT:booking amount")
    condition(_volume <= _harvests[_tokenId].supply, "INSUFFICIENT:supply")
    condition(_harvests[_tokenId].price.mul(_volume) == msg.value, "INSUFFICIENT:booking fees")
    payable
    override
  {
    // Register booking volume
    _bookers[msg.sender].volume = _bookers[msg.sender].volume.add(_volume);
    // Update supply
    _harvests[_tokenId].supply = _harvests[_tokenId].supply.sub(_volume);
    _deposits[msg.sender] = _deposits[msg.sender].add(msg.value);
    emit Booking(
      _bookers[msg.sender].volume,
      _tokenId,
      msg.sender,
      _deposits[msg.sender]
    );
  }
}
