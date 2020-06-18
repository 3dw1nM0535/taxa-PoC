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

    // Events
    event StateChange(uint256 _tokenId, string _stateChanged);
    event Planting(string _crop, string _seed);

    // Crop selection
    struct PlantingSeason {
        string crop;
        string seed;
    }

    // Mapping farm to crop selection
    mapping(uint256 => PlantingSeason) public _plantingSeason;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) public {}

    // Modifiers
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
        override
    {
        // validate inputs
        _safeMint(msg.sender, _tokenId);
        farmRegistry[_tokenId] = FarmData(msg.sender, _farmSize, _farmImage, _longitude, _latitude);
        emit Register(msg.sender, _farmSize, _longitude, _latitude);
    }

    /**
     * openPlantingSeason
     * params: _cropSelection
     */
    function openPlantingSeason(string memory _cropSelection, string memory _seedSelection, uint256 _tokenId)
            public
            condition(_exists(_tokenId) == true, "ERC721: invalid token")
        {
            if (ownerOf(_tokenId) == address(msg.sender)) {
                _plantingSeason[_tokenId] = PlantingSeason(_cropSelection, _seedSelection);
                emit Planting(_cropSelection, _seedSelection);
                return;
            } else {
                revert("unknown farm owner");
            }
         }

    /**
     * openHarvestingSeason
     * params: _cropName
     *
     */
    function openHarvestSeason(uint256 _tokenId, string memory _cropName)
        public
        condition(_plantingSeason[_tokenId].crop.equal(_cropName), "cannot reap what you never sow")
        override
        returns (bool)
    {
        _harvestSeason[_tokenId] = HarvestCrop(true, _cropName);
        emit OpenHarvest(_harvestSeason[_tokenId].status, _harvestSeason[_tokenId].cropType);
        return true;
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
            condition(_exists(_tokenId) == true, "invalid token")
            condition(_plantingSeason[_tokenId].crop.equal(_cropType), "cannot reap what you never sow")
            condition(msg.sender == farmRegistry[_tokenId].owner, "unknown farm owner")
            override
            returns (bool)
        {
            if (_farmHarvest[_tokenId].harvestDate == 0) { // completely new & first harvest
                _farmHarvest[_tokenId] = HarvestData(_harvestDate, _totalSupply, _price, _cropType);
                emit Harvesting(
                    _farmHarvest[_tokenId].harvestDate,
                    _farmHarvest[_tokenId].totalSupply,
                    _farmHarvest[_tokenId].price,
                    _farmHarvest[_tokenId].cropType
                );
                return true;
            } else if (_harvestDate >= _farmHarvest[_tokenId].harvestDate) { // meaning its a future harvest
                if (_farmHarvest[_tokenId].totalSupply != 0) {
                   revert("previous harvest season still in supply");
                } else {
                     _farmHarvest[_tokenId] = HarvestData(_harvestDate, _totalSupply, _price, _cropType);
                    emit Harvesting(
                        _farmHarvest[_tokenId].harvestDate,
                        _farmHarvest[_tokenId].totalSupply,
                        _farmHarvest[_tokenId].price,
                        _farmHarvest[_tokenId].cropType
                    );
                }
            } else {
                revert("invalid harvest");
            }
        }

    /**
     * bookHarvest
     * params: _booker, _amount, _deposit(1/2(buying_price)), buying_price(amount*pricePerSupply)
     */

    function updateBookings(uint256 _amnt, uint256 _tokenId, uint256 _crypto)
            internal
            condition(_exists(_tokenId) == true, "invalid token")
            condition(_amnt <= _farmHarvest[_tokenId].totalSupply, "no enough supply to cover your booking")
        {
            require(_crypto == _farmHarvest[_tokenId].price.mul(_amnt), "insufficient funds");
            _farmHarvest[_tokenId].totalSupply = _farmHarvest[_tokenId].totalSupply.sub(_amnt);
            _deposits[msg.sender] = _crypto;
            _harvestBookers[msg.sender] = Booking(msg.sender, _farmHarvest[_tokenId].cropType, _amnt);
            emit BookingHarvest(msg.sender, _amnt);
        }

    function bookHarvest(uint256 _amount, uint256 _tokenId)
            public
            payable
            condition(msg.sender != farmRegistry[_tokenId].owner, "cannot book from own farm")
            override
            returns (bool)
        {
            require(msg.value != 0, "fee cannot be 0");
            updateBookings(_amount, _tokenId, msg.value);
            return true;
        }
}
