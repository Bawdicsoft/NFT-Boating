//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./library/BookingMap.sol";
import "./library/UserMapping.sol";
import "./library/DateTimeLibrary.sol";

contract NFTYacht is ERC721, Ownable {

    using SafeMath for uint256;
    using Strings for uint256;


    using Counters for Counters.Counter;
    using BookingMap for BookingMap.Map;
    using UserMapping for UserMapping.Map;

    Counters.Counter private OwnershipToken;
    BookingMap.Map private booking;
    UserMapping.Map private User;

    // VARIABLES
    IERC20 private USDT;
    uint256 private rate;

    uint256 totalSupply = 365;
    
    uint public bookingBefore =  0; // user can't book date Before (bookingBefore)date
    uint public bookingAfter  =  604800; // user can't book date After  (bookingAfter)date
    
    uint public offerBefore =  0; // user can't offer After (offerBefore)date
    uint public acceptOfferBefore =  0; // user can't acceptOffer After (acceptOfferBefore)date
    uint public offerPrice = 300 ether; // user have to pay USDT for offer

    struct _offer {
        address User;
        uint Price;
        uint Time;
        uint userID;
    }

    mapping ( uint => _offer) public offers;
    
    mapping(uint => bool) public offerdID;
    mapping(uint => bool) public acceptedOffers;

    // mapping(uint => string) private tURI;
    string public tURI;

    constructor(address _USDT) ERC721("Yacht", "Y") {
        rate = 1 ether;
        USDT = IERC20(_USDT);
    }

    event mint(uint token, address user);
    event booked(uint token, address user);
    event offered(uint token, address user);
    event offerAccepted(uint token, address user);


    function setRate(uint256 _rate) public onlyOwner {
        rate = _rate;
    }

    function getRate() public view returns(uint256) {
        return rate;
    }

    function getUserIDs(address user) public view returns (uint256[] memory) {
        return User.getTokens(user);
    }

    function getAllUser() public view returns (address[] memory) {
        return User.getUser();
    }

    function getUserData(uint _id) public view returns (
        bool _isInserted
        ) {
        _isInserted = booking.isInserted(_id);
    }

    function getOffer(uint _id) public view returns (

        address _user, uint _price, uint _time, uint _userID

        ) {

        _user    = offers[_id].User;
        _price   = offers[_id].Price;
        _time    = offers[_id].Time;
        _userID  = offers[_id].userID;

    }



    function updateBookingBefore(uint _number) public onlyOwner() {
        bookingBefore = _number;
    }
    function updateBookingAfter(uint _number) public onlyOwner() {
        bookingAfter = _number;
    }
    function updateOfferBefore(uint _number) public onlyOwner() {
        offerBefore = _number;
    }
    function updateAcceptOfferBefore(uint _number) public onlyOwner() {
        acceptOfferBefore = _number;
    }
    function updateOfferPrice(uint _number) public onlyOwner() {
        offerPrice = _number;
    }


    
    function buyOwnership (

        uint256 _tOwnership,
        // string[] memory _tokenURI,
        uint256 _USDT

        ) public {

        require ( totalSupply >= (OwnershipToken.current().add(_tOwnership)), "!Total Supply");
        require ( (rate.mul(_tOwnership)) == _USDT, "!Not suffecient USDT");
        require ( _tOwnership > 0, "!tOwnership");
        // require ( _tokenURI.length == _tOwnership, "!tURI");

        USDT.transferFrom( msg.sender, owner(), _USDT );

        for (uint256 i = 0; i < _tOwnership; i++) {

            OwnershipToken.increment();
            uint _current = OwnershipToken.current();

            User.set(_msgSender(), _current);
            _safeMint(msg.sender, _current);
            // tURI[_current] = _tokenURI[i];

            emit mint(_current, msg.sender);

        }

    }



    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");
        return tURI;
    }

    // function tokenURI(uint256 tokenId) public view override returns (string memory) {
    //     require(_exists(tokenId), "Query for nonexistent token");

    //     string memory baseURI = _baseURI();
    //     return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    // }

    // function _baseURI() internal view override returns (string memory) {
    //     return tURI;
    // }

    function updateTokenURI(string memory _tokenURI) public onlyOwner {
        tURI = _tokenURI;
    }


    function bookDate (

        uint year, uint month, uint day, uint _id

        ) public {

        require ( DateTimeLibrary.isValidDate(year, month, day), "inValid Date");
        uint newDAte = DateTimeLibrary.timestampFromDate(year, month, day);

        (, uint _DateAndTime, uint _newYear) = booking.getTime(_id);

        if (booking.isInserted(_id)) {
            require ( newDAte > _newYear, "Token Already Booked");
        }

        require(_DateAndTime != newDAte, "Date Already Booked");
        
        uint _blockTimestamp = block.timestamp;
        console.log((_blockTimestamp + bookingBefore), "newDAte", newDAte);
        require ( (_blockTimestamp + bookingBefore) < newDAte, "!booking Before");
        require ( (_blockTimestamp + bookingAfter ) > newDAte, "!booking After");

        uint newYear = DateTimeLibrary.timestampFromDate(year.add(1), 12, 31);
        booking.set(_id, _msgSender(), _blockTimestamp, newDAte, newYear);

        emit booked(_id, _msgSender());

    }




    function offer( uint _id, uint _userID, uint256 _USDT ) public {

        require(!offerdID[_id], "offerdID");

        address _msgSender = _msgSender();
        require(balanceOf(_msgSender) > 0, "!Token");
        require(ownerOf(_userID) == _msgSender, "!Owner");

        require ( booking.isInserted(_id), "!Booked");

        // require ( booking.isInserted(_id), "!Booked");
        // have to use Auto _userID add loop

        require ( offerPrice == _USDT, "!OfferPrice");

        (,uint _DateAndTime,) = booking.getTime(_id);

        require ( (_DateAndTime.sub(offerBefore)) > block.timestamp, "!Time Out");

        USDT.transferFrom( _msgSender, address(this), _USDT);

        offers[_id] = _offer (_msgSender, _USDT, (_DateAndTime.sub(acceptOfferBefore)), _userID);
        offerdID[_id] = true;

        emit offered(_id, _msgSender);

    }



    function acceptOffer( uint _id ) public {

        require ( offerdID[_id], "!Offerd");
        require ( booking.getOwner(_id) == _msgSender(), "!Owner");
        require ( offers[_id].Time > block.timestamp, "!Time Out");

        (, uint _dateAndTime, uint _newYear) = booking.getTime(_id);
        booking.remove(_id);
        booking.set(offers[_id].userID, offers[_id].User, block.timestamp, _dateAndTime, _newYear);

        acceptedOffers[_id] = true;
        USDT.transfer(_msgSender(), offers[_id].Price);

        delete offerdID[_id];
        delete offers[_id];

        emit offerAccepted(_id, _msgSender());

    }



}
