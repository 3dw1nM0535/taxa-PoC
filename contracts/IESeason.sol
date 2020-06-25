// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

interface IESeason {

  // Events
  event SeasonOpening(address _sender, string _season);
  event Preparations(uint256 _tokenId, string _crop, string _fertilizer);
  event Planting(
    uint256 _tokenId,
    string _seedUsed,
    string _expectedYield,
    string _maturityDays,
    string _idealClimate,
    string _seedSupplier
  );
  event Harvesting(
		uint256 _supply,
		uint256 _price,
		uint256 _tokenId
	);


 
  // Seasons
  enum Season {
    Created,
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

  // Land preparations data
  struct LandPreparations {
    string crop;
    string fertilizer;
  }

  // Planting data
  struct PlantingType {
    string seedUsed;
    string expectedYield;
    string maturityDays;
    string idealClimate;
    string seedSupplier;
  }
  
  // Harvest type
	struct HarvestType {
		uint256 supply;
		uint256 price;
	}
}

