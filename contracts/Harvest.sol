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
  }

