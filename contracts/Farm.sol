// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import './Registry.sol';
import './Harvest.sol';
import './StringUtils.sol';

contract Farm is Registry, Harvest {

  using StringUtils for string;
  using SafeMath for uint256;

  // Modifiers
  modifier condition(bool _condition, string memory _msg) {
    require(_condition, _msg);
    _;
  }
  
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
    override
    returns (bool)
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
    return true;
  }

  /**
   * @dev createHarvest Farm creates harvest
   * @param _date, _supply, _price, _crop, _tokenId
   */
  function createHarvest(
    uint256 _date,
    uint256 _supply,
    uint256 _price,
    string memory _crop,
    uint256 _tokenId
  )
    public
    condition(msg.sender == registry[_tokenId].owner, "RESTRICTED:only owner can harvest")
    override
  {
    if (_harvests[_tokenId].date == 0) {
      // Its a new harvest
      _harvests[_tokenId] = HarvestType(_date, _supply, _price, _crop);
      emit Harvesting(
        _harvests[_tokenId].date,
        _harvests[_tokenId].supply,
        _harvests[_tokenId].price,
        _harvests[_tokenId].crop,
        _tokenId
      );
    } else {
      revert('INVALID:harvest');
    }
  }

  /**
   * @dev bookHarvest This allow booking harvest
   * @param _volume, _tokenId
   */
  function bookHarvest(uint256 _volume, uint256 _tokenId)
    public
    condition(msg.sender != registry[_tokenId].owner, "RESTRICTED:owner cannot book harvest")
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

  /**
   * @dev reSupply Resupply farm harvest
   * @param _date, _supply, _price, _crop, _tokenId
   */
  function reSupply(
    uint256 _date,
    uint256 _supply,
    string memory _crop,
    uint256 _tokenId
  )
    public
    condition(msg.sender == registry[_tokenId].owner, "RESTRICTED:only owner can resupply")
    condition(_harvests[_tokenId].supply == 0, 'OVERSUPPLY:previous harvest not exhausted')
    override
  {
    if (_date > _harvests[_tokenId].date) { 
      // Its a future harvest
      _harvests[_tokenId].date = _date;
      _harvests[_tokenId].supply = _harvests[_tokenId].supply.add(_supply);
      _harvests[_tokenId].crop = _crop;
      emit Resupply(
	_harvests[_tokenId].date,
	_harvests[_tokenId].supply,
	_harvests[_tokenId].crop,
	_tokenId
      );
    } else {
      revert('INVALID:harvest for the future');
    }
  }
}
