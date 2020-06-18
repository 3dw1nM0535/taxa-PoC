// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

abstract contract Harvest {

    // Events
    event Harvesting(uint256 _date, uint256 _supply, uint256 _pricePerSupply, string _cropName);
    event BookingHarvest(address _booker, uint256 _amnt);
    event OpenHarvest(bool _status, string _cropName);


    // Harvest data type
    struct HarvestData {
        uint256 harvestDate;
        uint256 totalSupply;
        uint256 price;
        string cropType;
    }

    // Booking data type
    struct Booking {
        address _booker;
        string _product;
        uint256 _volume;
    }

    // Harvest
    struct HarvestCrop {
        bool status;
        string cropType;
    }

    // Mapping for harvest
    mapping(uint256 => HarvestData) public _farmHarvest;

    // Mapping for bookers
    mapping(address => Booking) public _harvestBookers;

    // Mapping harvest season to farm
    mapping(uint256 => HarvestCrop) public _harvestSeason;

    // Mapping for deposits
    mapping(address => uint256) public _deposits;

    /**
     *createHarvest
     * params: _harvestDate, _totalSupply, _price, _cropType
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
            virtual
            returns (bool);

    /**
     * bookHarvest
     * params: _booker, _amount
     */
    function bookHarvest(uint256 _amount, uint256 _tokenId) public payable virtual returns (bool);

    /**
     * openHarvestSeason
     * params: _cropName
     *
     */
    function openHarvestSeason(uint256 _tokenId, string memory _cropName) public virtual returns (bool);
}
