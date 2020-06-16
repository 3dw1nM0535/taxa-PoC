// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./StringUtils.sol";
import "./Registry.sol";
import "./Harvest.sol";

/**
 * Farm
 * This implements functionality in a farm
 */

contract Farm is Registry, ERC721, Harvest {

    using StringUtils for string;
    using SafeMath for uint256;

    // Enum
    enum FarmState {
        Created,
        CropSelection,
        Preparation,
        SeedSelection,
        SeedSowing,
        Irrigation,
        Growth,
        Fertilizing,
        Harvesting
    }
    // Contract state
    FarmState private state;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) public {}

    // Modifiers
    modifier inState(FarmState _state) {
        require(state == _state, "invalid farm state");
        _;
    }

    modifier condition(bool _condition, string memory _msg) {
        require(_condition, _msg);
        _;
    }

    /**
     * registerFarm
     * params: _farmSize, _farmImage, _longitude, _latitude
     */
    function registerFarm(
        uint256 _farmSize,
        string memory _farmImage,
        string memory _longitude,
        string memory _latitude,
        uint256 _tokenId
    )
        public
        condition(_tokenId != 0, "invalid token")
        override
        inState(FarmState.Created)
    {
        // validate inputs
        require(_farmSize != 0, "farm size cannot be 0");
        require(_farmImage.isEmpty() == false, "farm image cannot be unknown");
        require(_longitude.isEmpty() == false, "farm longitude coords cannot be unknown");
        require(_latitude.isEmpty() == false, "farm latitude coords cannot be unknown");
        _safeMint(msg.sender, _tokenId);
        farmRegistry[_tokenId] = FarmData(msg.sender, _farmSize, _farmImage, _longitude, _latitude);
        emit Register(msg.sender, _farmSize, _longitude, _latitude);
        state = FarmState.Created; // change contract state
    }

    /**
     * createHarvest
     * allow the owner of the farm to create harvest
     */
    function createHarvest
        (
            uint256 _harvestDate,
            uint256 _totalSupply,
            uint256 _price,
            string memory _cropType,
            uint256 _tokenId
        )
            public
            condition(_tokenId != 0, "invalid token")
            condition(_exists(_tokenId) == true, "invalid token")
            condition(msg.sender == farmRegistry[_tokenId].owner, "unknown farm owner")
            override
            returns (bool)
        {
            require(_harvestDate != 0, "invalid harvest date");
            require(_totalSupply != 0, "supply cannot be 0");
            require(_price != 0, "price cannot be 0");
            require(_cropType.isEmpty() == false, "crop type should be provided");
            if (_farmHarvest[_tokenId].harvestDate == 0) { // completely new & first harvest
                _farmHarvest[_tokenId] = HarvestData(_harvestDate, _totalSupply, _price, _cropType);
                emit Harvesting(_harvestDate, _totalSupply, _price, _cropType);
                return true;
            } else if (_harvestDate >= _farmHarvest[_tokenId].harvestDate) { // meaning its a future harvest
                // check if previous harvest supply is exhausted
                if (_farmHarvest[_tokenId].totalSupply != 0) {
                    // check if new harvest has the same crop type
                    if (_farmHarvest[_tokenId].cropType.equal(_cropType)) {
                        // check if new harvest price has changed
                        if (_farmHarvest[_tokenId].price != _price) {
                            // its a new price
                            _farmHarvest[_tokenId].price = _price;
                            emit Pricing(_farmHarvest[_tokenId].price);
                            return true;
                        }
                        _farmHarvest[_tokenId].totalSupply.add(_totalSupply);
                        emit Harvesting(_harvestDate, _totalSupply, _price, _cropType);
                        return true;
                    } else {
                        revert("previous harvest season supply not exhausted");
                    }
                } else if (_farmHarvest[_tokenId].totalSupply == 0) {
                    // its a new harvest
                    _farmHarvest[_tokenId] = HarvestData(_harvestDate, _totalSupply, _price, _cropType);
                    emit Harvesting(_harvestDate, _totalSupply, _price, _cropType);
                    return true;
                }
            } else {
                revert("invalid harvest input");
            }
        }

    /**
     * bookHarvest
     * params: _booker, _amount, _deposit(1/2(buying_price)), buying_price(amount*pricePerSupply)
     */

    function updateBookings
        (
            uint256 _amnt,
            uint256 _tokenId,
            uint256 _crypto
        )
            internal
            condition(_tokenId != 0, "invalid token")
            condition(_exists(_tokenId) == true, "invalid token")
            condition(_amnt != 0, "booking amount cannot be 0")
            condition(_amnt <= _farmHarvest[_tokenId].totalSupply, "no enough supply to cover your booking")
        {
            require(_crypto != 0, "fee cannot be 0");
            require(_crypto == _farmHarvest[_tokenId].price.mul(_amnt), "insufficient funds");
            _farmHarvest[_tokenId].totalSupply = _farmHarvest[_tokenId].totalSupply.sub(_amnt);
            _deposits[msg.sender] = uint256(1).div(uint256(2)).mul(_crypto);
            _harvestBookers[msg.sender] = _amnt;
            emit BookingHarvest(msg.sender, _amnt);
        }

    function bookHarvest
        (
            uint256 _amount,
            uint256 _tokenId
        )
            public
            payable
            condition(msg.sender != farmRegistry[_tokenId].owner, "cannot book from own farm")
            override
            returns (bool)
        {
            updateBookings(_amount, _tokenId, msg.value);
            return true;
        }
}
