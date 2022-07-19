//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Contracts/Ownable.sol";

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

    uint256 public totalSupply;
    string public baseExtension = ".json";
    
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
        uint offeredDate;
    }

    mapping ( uint => _offer) public offers;
    mapping ( address => uint[]) public userAllOffers;
    
    mapping(uint => bool) public offerdID;
    mapping(uint => bool) public acceptedOffers;

    // mapping(uint => string) private tURI;
    string public baseURI;

    constructor(

        string memory name_, string memory symbol_, uint totalSupply_,
        uint price_, address ownerAddress_, string memory baseURI_
        
        ) ERC721(name_, symbol_) Ownable(ownerAddress_) {

        totalSupply = totalSupply_;
        rate = price_ * 10 ** 18;
        baseURI = baseURI_;

        USDT = IERC20(0x6711DF95D1Dcd92f7e0E84E199dE7c51088d037B);
    
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

    function currentID() public view returns(uint) {
        return OwnershipToken.current();
    }

    function getBookedDate(uint _id) public view returns (
        uint _blockTimestamp, uint _DateAndTime, uint _newYear ) {

        (_blockTimestamp, _DateAndTime, _newYear) = booking.getTime(_id);
    }

    function getOffer(uint _id) public view returns (

        address _user, uint _price, uint _time, uint _userID, uint _offeredDate

        ) {

        _user    = offers[_id].User;
        _price   = offers[_id].Price;
        _time    = offers[_id].Time;
        _userID  = offers[_id].userID;
        _offeredDate  = offers[_id].offeredDate;

    }

    

    function getUserAllOffers(address _user) public view returns(uint[] memory) {
        return userAllOffers[_user];
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



    // function tokenURI(uint256 tokenId) public view override returns (string memory) {
    //     require(_exists(tokenId), "Query for nonexistent token");
    //     return tURI;
    // }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");

        return bytes(baseURI).length > 0 ? string(abi.encodePacked(_baseURI(), tokenId.toString(), baseExtension)) : "";
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }


    function bookDate (

        uint year, uint month, uint day, uint _id

        ) public {

        require(_exists(_id), "Query for nonexistent token");

        require(
            _msgSender() == ownerOf(_id) || isApprovedForAll(ownerOf(_id), _msgSender()),
            "ERC721: approve caller is not owner nor approved for all"
        );

        require ( DateTimeLibrary.isValidDate(year, month, day), "inValid Date");
        uint _newDAte = DateTimeLibrary.timestampFromDate(year, month, day);

        (, uint _DateAndTime, uint _newYear) = booking.getTime(_id);

        if (booking.isInserted(_id)) {
            require ( _newDAte > _newYear, "Token Already Booked");
        }

        require(_DateAndTime != _newDAte, "Date Already Booked");
        
        uint _blockTimestamp = block.timestamp;
        console.log((_blockTimestamp + bookingBefore), "newDAte", _newDAte);
        require ( (_blockTimestamp + bookingBefore) < _newDAte, "!booking Before");
        require ( (_blockTimestamp + bookingAfter ) > _newDAte, "!booking After");

        uint __newYear = DateTimeLibrary.timestampFromDate(year.add(1), 12, 31);

        if (newYear != __newYear) newYear = __newYear;
        indexOfBookedDates[_id] = allBookedDates[newYear].length;
        allBookedDates[newYear].push(_bookDates(year, month, day));
        bookDateID[year][month][day] = _id;

        booking.set(_id, _msgSender(), _blockTimestamp, _newDAte, __newYear);

        emit booked(_id, _msgSender());

    }

    mapping ( uint => uint ) indexOfBookedDates;


    uint public newYear;
    struct _bookDates {
        uint _year;
        uint _month;
        uint _day;
    }
    mapping ( uint => _bookDates[] ) public allBookedDates;
    mapping ( uint => mapping ( uint => mapping ( uint => uint ) ) ) public bookDateID;

    function getAllBookedDates(uint _newYear) public view returns(_bookDates[] memory) {
        return allBookedDates[_newYear];
    }

    function getBookDateID(uint year, uint month, uint day) public view returns(uint) {
        return bookDateID[year][month][day];
    }

    uint cancelBefore = 86400;
    event _cancelBooking(uint id, uint year, uint month, uint day);

    function cancelBooking(uint _id) public {

        require (booking.isInserted(_id), "!Booked");
        require (booking.getOwner(_id) == _msgSender(), "!Owner");

        (, uint _DateAndTime ,) = booking.getTime(_id);
        require (_DateAndTime > (block.timestamp.sub(cancelBefore)), "Cant Cancel Booking Now");

        (uint _year, uint _month, uint _day) = DateTimeLibrary.timestampToDate(_DateAndTime);

        booking.remove(_id);
        delete bookDateID[_year][_month][_day];

        uint index = indexOfBookedDates[_id];
        uint lastIndex = allBookedDates[newYear].length - 1;
        uint year = allBookedDates[newYear][lastIndex]._year;
        uint month = allBookedDates[newYear][lastIndex]._month;
        uint day = allBookedDates[newYear][lastIndex]._day;

        delete indexOf[_id];

        allBookedDates[newYear][index] = _bookDates( year, month, day );
        allBookedDates[newYear].pop();

        emit _cancelBooking(_id, _year, _month, _day);

    }




    function offer( uint _id, uint _userID, uint256 _USDT ) public {

        require(!offerdID[_id], "offerdID");

        address _msgSender = _msgSender();
        require(balanceOf(_msgSender) > 0, "!Token");
        require(ownerOf(_userID) == _msgSender, "!Owner");

        require ( booking.isInserted(_id), "!Booked");

        require ( offerPrice == _USDT, "!OfferPrice");

        (,uint _DateAndTime,) = booking.getTime(_id);

        require ( (_DateAndTime.sub(offerBefore)) > block.timestamp, "!Time Out");

        USDT.transferFrom( _msgSender, address(this), _USDT);

        offers[_id] = _offer (_msgSender, _USDT, (_DateAndTime.sub(acceptOfferBefore)), _userID, _DateAndTime);
        indexOf[_id] = userAllOffers[_msgSender].length;
        userAllOffers[_msgSender].push(_id);
        offerdID[_id] = true;

        emit offered(_id, _msgSender);

    }


    


    mapping ( uint => uint ) indexOf;

    function cancelOffer(uint _id) public {

        require(offerdID[_id],"!offerd");

        address _msgSender = _msgSender();
        require(offers[_id].User == _msgSender, "!User");

        USDT.transfer( _msgSender, offers[_id].Price);

        uint index = indexOf[_id];
        uint lastIndex = userAllOffers[_msgSender].length - 1;
        uint lastKey = userAllOffers[_msgSender][lastIndex];

        indexOf[lastKey] = index;
        delete indexOf[_id];

        userAllOffers[_msgSender][index] = lastKey;
        userAllOffers[_msgSender].pop();

        delete offers[_id];
        delete offerdID[_id];
    }



    function acceptOffer( uint _id ) public {

        require ( offerdID[_id], "!Offerd");
        require ( booking.getOwner(_id) == _msgSender(), "!Owner");
        require ( offers[_id].Time > block.timestamp, "!Time Out");

        (, uint _dateAndTime, uint _newYear) = booking.getTime(_id);
        booking.remove(_id);
        booking.set(offers[_id].userID, offers[_id].User, block.timestamp, _dateAndTime, _newYear);

        (uint year, uint month, uint day) = DateTimeLibrary.timestampToDate(_dateAndTime);
        bookDateID[year][month][day] = offers[_id].userID;

        acceptedOffers[_id] = true;
        USDT.transfer(_msgSender(), offers[_id].Price);

        delete offerdID[_id];
        delete offers[_id];

        emit offerAccepted(_id, _msgSender());

    }



}
