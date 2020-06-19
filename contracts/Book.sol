// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

abstract contract Book {

    using SafeMath for uint256;

    event BookingHarvest(address indexed _booker, uint256 _amnt);
    event Deposited(address indexed _payee, uint256 _value);
    event Withdrawn(address indexed _payee, uint256 _value);

    // Booking data type
    struct Booking {
        address _booker;
        string _product;
        uint256 _volume;
    }

    // Mapping for bookers
    mapping(address => Booking) public _harvestBookers;

    // Mapping deposits to address
    mapping(address => uint256) private _bookerDeposits;

    function depositOf(address _owner) public view returns(uint256) {
        return _bookerDeposits[_owner];
    }

    /**
     * @dev Stores the sent amount as credit to be withdrawn
     * @param payee The destination address of the amount
     */
    function deposit(address payee) public payable {
        uint256 amount = msg.value;
        _bookerDeposits[msg.sender] = _bookerDeposits[msg.sender].add(amount);

        emit Deposited(payee, _bookerDeposits[payee]);
    }

    /**
     * @dev Withdraw accumulated balance for payee
     * @param payee The address whose funds will be withdrawn and transferred to
     */
    function withdraw(address payable payee) public {
        uint256 payment = _bookerDeposits[payee];

        _bookerDeposits[payee] = 0;

        payee.transfer(payment);

        emit Withdrawn(payee, payment);
    }

    /**
     * @dev BookHarvest
     * @param _amount, _crop, _tokenId
     */
    function bookHarvest(uint256 _amount, string memory _crop, uint256 _tokenId) public payable virtual returns (bool);
}
