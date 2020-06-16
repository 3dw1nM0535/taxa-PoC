// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./StringUtils.sol";

contract Delivery {

    using SafeMath for uint256;
    using StringUtils for string;

    // Events
    event Accept(
       address _rider,
       address _from,
       bool _accept,
       bool _reject
    );
    event Reject(
        address _rider,
        address _from,
        bool _accept,
        bool _reject,
        uint256 _refund
    );
    event Delivered(
        address _rider,
        string _product,
        uint256 _amount,
        uint256 _date,
        string _originLon,
        string _originLat,
        string _destLon,
        string _destLat
    );
    event MakeOffer(
        address _client,
        address _rider
    );
    event Register(
        address _delivery
    );

    // Offer data type
    struct Offer {
        address payable _from;
        string _product;
        uint256 _amount;
        uint256 _date;
        string _destLon;
        string _destLat;
        uint256 _fee;
        bool _accept;
        bool _reject;
    }

    // Delivery person data type
    struct DeliveryPerson {
        address payable _address;
        string _dataHash;
    }

    // Mapping registry for delivery co./person
    mapping(address => DeliveryPerson) public _deliveries;

    // Mapping delivery acceptance rate to rider
    mapping(address => uint256) public _acceptanceRate;

    // Mapping delivery rejection rate to rider
    mapping(address => uint256) public _rejectionRate;

    // Mapping offers to creators
    mapping(address => Offer) public _offers;

    // Mapping delivery co./person to total no. of jobs offers
    mapping(address => uint256) public _totalOffers;

    // Mapping deliver co./person to number of accepted offers
    mapping(address => uint256) public _acceptedOffers;

    // Mapping delivery co./person to number of rejected offers
    mapping(address => uint256) public _rejectedOffers;

    // Modifiers
    modifier condition(bool _condition, string memory _msg) {
        require(_condition, _msg);
        _;
    }

    /**
     * onboardDelivery
     * params: msg.sender, _dataHash
     */
    function onboardDelivery(string memory _dataHash)
        public
        condition(_dataHash.isEmpty() != true, "data hash cannot be empty")
        condition(msg.sender != address(0), "invalid address")
    {
        _deliveries[msg.sender] = DeliveryPerson(msg.sender, _dataHash);
        emit Register(msg.sender);
    }

    /**
     * Make delivery offer to delivery co./person
     * Delivery co./person should not make offer to his/her co./self
     * Update offers registry
     *
     * makeOffer
     * params: _date, _destLon, _destLat
     */
    function makeOffer(address _to, string memory _bookedCrop, uint256 _bookedVolume, uint256 _date, string memory _destLon, string memory _destLat)
        public
        payable
        condition(msg.value != 0, "fee cannot be 0")
        condition(msg.sender != _deliveries[msg.sender]._address, "cannot make offer to yourself")
    {
        _offers[msg.sender] = Offer(
            msg.sender,
            _bookedCrop,
            _bookedVolume,
            _date,
            _destLon,
            _destLat,
            msg.value,
            false,
            false
        );
        _totalOffers[_to] = _totalOffers[_to].add(1);
        emit MakeOffer(msg.sender, _to);
    }

    /**
     * Delivery co./person can accept offer; calculate job acceptance rate
     * Only delivery co.person can accept offers
     * Update offers registry
     *
     * acceptOffer
     * params: _from
     */
    function acceptanceRate(address _rider) internal view returns(uint256) {
        // calculate acceptance rate
        return _acceptedOffers[_rider].div(_totalOffers[_rider]).mul(100);
    }

    function acceptOffer(address _from)
        public
        condition(_from == _offers[_from]._from, "you don't have any offers")
        condition(msg.sender == _deliveries[msg.sender]._address, "only delivery can accept offers")
        {
            _offers[_from]._accept = true;
            _offers[_from]._reject = false;
            _acceptedOffers[msg.sender] = _acceptedOffers[msg.sender].add(1);
            _acceptanceRate[msg.sender] = acceptanceRate(msg.sender);
            emit Accept(msg.sender, _from, _offers[_from]._accept, _offers[_from]._reject);
         }

    /**
     * Delivery co./person can reject offer; calculate job rejection rate
     * Only delivery co./person can reject offers
     * Update offers registry
     *
     * rejectOffer
     * params: _from
     */
    function rejectionRate(address _rider) internal view returns(uint256) {
        // calculate rejection rate
        return _rejectedOffers[_rider].div(_totalOffers[_rider]).mul(100);
    }

    function rejectOffer(address _from)
        public
        condition(msg.sender == _deliveries[msg.sender]._address, "only delivery can reject offers")
        condition(_from == _offers[_from]._from, "you don't have any offers")
        {
            _offers[_from]._reject = true;
            _offers[_from]._accept = false;
            _rejectedOffers[msg.sender] = _rejectedOffers[msg.sender].add(1);
            _rejectionRate[msg.sender] = rejectionRate(msg.sender);
            uint256 _refund = _offers[_from]._fee;
            emit Reject(msg.sender, _from, _offers[_from]._accept, _offers[_from]._reject, _refund);
            _offers[_from]._fee = 0;
            _offers[_from]._from.transfer(_refund);
            _refund = 0;
        }

}
