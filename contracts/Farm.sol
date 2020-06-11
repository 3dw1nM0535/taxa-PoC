// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import "./Registry.sol";

/**
 * Farm
 * This implements functionality in a farm
 */

contract Farm is Registry {
  // Farm data type
  struct FarmData {
    uint256 farmSize;
    string farmOwner;
    string farmImage;
    string lon;
    string lat;
  }

  // Farms registry
  mapping(address => FarmData) public farms;
  address[] private farmOwners;

  // check if string is null
  function stringIsEmpty(string memory _value) internal pure returns (bool) {
    bytes memory tempEmptyString = bytes(_value);
    if (tempEmptyString.length == 0) {
        return true;
    } else {
        return false;
    }
  }

  /**
   * registerFarm
   * params: _farmSize, _farmOwner, _farmImage, _longitude, _latitude
   */
  function registerFarm(
    uint256 _farmSize,
    string memory _farmOwner,
    string memory _farmImage,
    string memory _longitude,
    string memory _latitude
  )
    public
    override
    returns (bool result) {
      require(_farmSize != 0, "farm size cannot be 0");
      require(stringIsEmpty(_farmOwner) == false, "farm owner cannot be unknown");
      require(stringIsEmpty(_farmImage) == false, "farm image cannot be unknown");
      require(stringIsEmpty(_longitude) == false, "farm longitude coords cannot be unknown");
      require(stringIsEmpty(_latitude) == false, "farm latitude coords cannot be unknown");
      farms[msg.sender] = FarmData(_farmSize, _farmOwner, _farmImage, _longitude, _latitude);
      farmOwners.push(msg.sender);
      return true;
  }
}
