// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

abstract contract FarmSeason {

  // Events
  event Preparations(uint256 _tokenId, string _crop, string _fertilizer);
  event Planting(
    uint256 _tokenId,
    string _seedUsed,
    string _expectedYield,
    string _seedSupplier
  );
  event Harvesting(
		uint256 _supply,
		uint256 _price,
		uint256 _tokenId
	);


 
  // Seasons
  enum Season {
    Dormant,
    Preparation,
    Planting,
    Harvesting,
    Booking
  }

  // Tokennized farm season
  struct TokenSeason {
    Season season;
  }

  // Map tokenized farm to its season
  mapping(uint256 => TokenSeason) public tokenSeason;

  // Land preparations data
  struct LandPreparations {
    string crop;
    string fertilizer;
  }

  // Planting data
  struct PlantingType {
    string seedUsed;
    string expectedYield;
    string seedSupplier;
  }
  
  // Harvest type
	struct HarvestType {
		uint256 supply;
		uint256 price;
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
}

