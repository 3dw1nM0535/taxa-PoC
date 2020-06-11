// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Registry.sol";

library String {

    // check if string is null
    function isEmpty(string memory _value) internal pure returns (bool) {
        bytes memory tempEmptyString = bytes(_value);
        if (tempEmptyString.length == 0) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * Farm
 * This implements functionality in a farm
 */

contract Farm is Registry, ERC721 {
    using String for string;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) public {}

  /**
   * registerFarm
   * params: _farmSize, _farmOwner, _farmImage, _longitude, _latitude
   */
    function registerFarm(
        uint256 _farmSize,
        string memory _farmOwner,
        string memory _farmImage,
        string memory _longitude,
        string memory _latitude,
        uint256 _tokenId
    )
        public
        override
    {
        // validate inputs
        require(_farmSize != 0, "farm size cannot be 0");
        require(_farmOwner.isEmpty() == false, "farm owner cannot be unknown");
        require(_farmImage.isEmpty() == false, "farm image cannot be unknown");
        require(_longitude.isEmpty() == false, "farm longitude coords cannot be unknown");
        require(_latitude.isEmpty() == false, "farm latitude coords cannot be unknown");
        require(_tokenId != 0, "secred id should not compute to 0");
        _safeMint(msg.sender, _tokenId);
        farmRegistry[884565] = FarmData(_farmSize, _farmOwner, _farmImage, _longitude, _latitude);
        emit Register(msg.sender, _farmSize, _farmOwner, _longitude, _latitude);
    }
}
