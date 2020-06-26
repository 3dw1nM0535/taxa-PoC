// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import './Registry.sol';
import './IESeason.sol';
import './Book.sol';

contract Farm is Registry, IESeason, Book {

  using SafeMath for uint256;

  // Map token to its season
  mapping(uint256 => TokenSeason) private tokenSeason;

  // Map tokenized farm to preparations data
  mapping(uint256 => LandPreparations) private preparations;

  // Map tokenized farm to planting data
  mapping(uint256 => PlantingType) private plantings;
  
  // Map harvest to farm
	mapping(uint256 => HarvestType) public _harvests;

  // Modifiers
  modifier condition(bool _condition, string memory _msg) {
    require(_condition, _msg);
    _;
  }

  modifier inSeason(uint256 _tokenId, Season _season) {
    require(_season == tokenSeason[_tokenId].season, "INVALID:season to do this");
    _;
  }

  // Proceed to the next season
  function nextSeason(uint256 _tokenId) internal {
    tokenSeason[_tokenId].season = Season(uint256(tokenSeason[_tokenId].season) + 1);
  }

  modifier transitionSeason(uint256 _tokenId) {
    _;
    nextSeason(_tokenId);
  }

  /**
   * @dev getSeasonKeyByValue This returns season enum value as a string
   * @param _season Season value
   */
  function getSeasonKeyByValue(Season _season) internal pure returns (string memory) {
    require(uint256(_season) <= 5, "INVALID:season");

    // Loop
    if (Season.Created == _season) return "Created";
    if (Season.Dormant == _season) return "Dormant";
    if (Season.Preparation == _season) return "Preparation";
    if (Season.Planting == _season) return "Planting";
    if (Season.Harvesting == _season) return "Harvesting";
    if (Season.Booking == _season) return "Booking";
  }

  /**
   * @dev getTokenSeason This returns the toke state
   * @param _tokenId The tokenized farm token id
   */
  function getTokenSeason(uint256 _tokenId) public view returns (string memory) {
    Season _s = tokenSeason[_tokenId].season;
    return getSeasonKeyByValue(_s);
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
    inSeason(_tokenId, Season.Created)
    transitionSeason(_tokenId)
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
  }

  /**
   * @dev openSeason This changes the state of the farm-land
   * from dormant to preparation for planting
   * @param _tokenId Tokenized farm token id
   */
  function openSeason(uint256 _tokenId)
    public
    condition(msg.sender == registry[_tokenId].owner, "RESTRICTED:only owner")
    inSeason(_tokenId, Season.Dormant)
    transitionSeason(_tokenId)
  {
    emit SeasonOpening(
      msg.sender,
      getSeasonKeyByValue(tokenSeason[_tokenId].season)
    );
  }

  /**
   * @dev finishPreparations This takes account what the
   * farmer has achieved preparing for planting season
   * @param _tokenId _crop, _fertilizer Farmer should answer this params
   */
  function finishPreparations(uint256 _tokenId, string memory _crop, string memory _fertilizer)
    public
    condition(msg.sender == registry[_tokenId].owner, "RESTRICTED:only owner")
    inSeason(_tokenId, Season.Preparation)
    transitionSeason(_tokenId)
  {
    preparations[_tokenId].crop = _crop;
    preparations[_tokenId].fertilizer = _fertilizer;
    emit Preparations(_tokenId, preparations[_tokenId].crop, preparations[_tokenId].fertilizer);
  }

  /**
   * @dev finishPlanting This takes account what the farmer
   * achieved during planting season and crop growth
   * @param _tokenId, _seedUsed, _expectedYield, _maturityDays,
   * _idealClimate, _seedSupplier 
   */
  function finishPlanting(
    uint256 _tokenId,
    string memory _seedUsed,
    string memory _expectedYield,
    string memory _maturityDays,
    string memory _idealClimate,
    string memory _seedSupplier
  )
    public
    condition(msg.sender == registry[_tokenId].owner, "RESTRICTED:only owner")
    inSeason(_tokenId, Season.Planting)
    transitionSeason(_tokenId)
  {
    PlantingType memory p;
    p = PlantingType(
      _seedUsed,
      _expectedYield,
      _maturityDays,
      _idealClimate,
      _seedSupplier
    );
    plantings[_tokenId] = p;
    emit Planting( 
      _tokenId,
      p.seedUsed,
      p.expectedYield,
      p.maturityDays,
      p.idealClimate,
      p.seedSupplier
    );

  }

  /**
   * @dev createHarvest Farm creates harvest
   * @param _supply, _price, _tokenId
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
   * @dev bookHarvest This allows booking for farm(s) harvest
   * @param _tokenId, _volume Amount to be booked
   */
  function bookHarvest(uint256 _tokenId, uint256 _volume) 
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
   * @dev cancelBook This cancels booking
   * @param _tokenId, _booker
   */
  function cancelBook(uint256 _tokenId, address payable _booker)
    public
    condition(msg.sender != registry[_tokenId].owner, "RESTRICTED:owner cannot cancel")
    condition()
    override
  {}  
}
