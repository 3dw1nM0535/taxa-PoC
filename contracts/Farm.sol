// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./StringUtils.sol";
import "./Registry.sol";
import "./Harvest.sol";
import "./Book.sol";

/**
 * Farm
 * This implements functionality in a farm
 */

contract Farm is Registry, ERC721, Harvest, Book {

    using StringUtils for string;
    using SafeMath for uint256;

    // Events
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
            condition(_exists(_tokenId) == true, "ERC721:invalid token")
        {
            if (ownerOf(_tokenId) == address(msg.sender)) {
                _plantingSeason[_tokenId] = PlantingSeason(_cropSelection, _seedSelection);
                emit Planting(_cropSelection, _seedSelection);
                return;
            } else {
                revert("UNKNOWN:farm owner");
            }
         }

    /**
     * openHarvestingSeason
     * params: _cropName
     *
     */
    function openHarvestSeason(uint256 _tokenId, string memory _cropName)
        public
        condition(_plantingSeason[_tokenId].crop.equal(_cropName), "ERROR:reap what you sow")
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
            condition(_exists(_tokenId) == true, "ERC721:invalid token")
            condition(_plantingSeason[_tokenId].crop.equal(_cropType), "ERROR:reap what you sow")
            condition(msg.sender == farmRegistry[_tokenId].owner, "UKNOWN:farm owner")
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
                   revert("OVERSUPPLY:harvest");
                } else if (_farmHarvest[_tokenId].totalSupply == 0) {
                    _farmHarvest[_tokenId].harvestDate = _harvestDate;
                    _farmHarvest[_tokenId].totalSupply = _farmHarvest[_tokenId].totalSupply.add(_totalSupply);
                    _farmHarvest[_tokenId].price = _price;
                    _farmHarvest[_tokenId].cropType = _cropType;
                    emit Harvesting(
                        _farmHarvest[_tokenId].harvestDate,
                        _farmHarvest[_tokenId].totalSupply,
                        _farmHarvest[_tokenId].price,
                        _farmHarvest[_tokenId].cropType
                    );
                    return true;
                } else {
                    revert("SUPPLY:invalid");
                }
            } else {
                revert("INVALID:harvest");
            }
        }

    /**
     * @dev Book harvest
     * @param _amount to be booked, _crop, and tokenized farm _tokenId
     */
    function bookHarvest(uint256 _amount, string memory _crop, uint256 _tokenId)
        public
        payable
        override
        returns (bool)
    {
        if (msg.value == _farmHarvest[_tokenId].price.mul(_amount) && _amount <= _farmHarvest[_tokenId].totalSupply) {
            _harvestBookers[msg.sender]._booker = msg.sender;
            _harvestBookers[msg.sender]._product = _crop;
            _harvestBookers[msg.sender]._volume = _harvestBookers[msg.sender]._volume.add(_amount);
            _farmHarvest[_tokenId].totalSupply = _farmHarvest[_tokenId].totalSupply.sub(_amount);
            Book.deposit(msg.sender);
            emit BookingHarvest(_harvestBookers[msg.sender]._booker, _harvestBookers[msg.sender]._volume);
        } else if (msg.sender == farmRegistry[_tokenId].owner) {
            revert("ILLEGAL:booking your farm");
        } else {
            revert("INSUFFICIENT:funds or BOOK_AMOUNT:not possible");
        }
    }
}
