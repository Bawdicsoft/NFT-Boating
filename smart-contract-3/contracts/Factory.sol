//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interfaces/MYIERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Contracts/Ownable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./library/BookingMap.sol";
import "./library/UserMapping.sol";
import "./library/DateTimeLibrary.sol";

import "./Boating.sol";

contract Factory is Ownable {

    using SafeMath for uint256;

    using Counters for Counters.Counter;
    using BookingMap for BookingMap.Map;
    using UserMapping for UserMapping.Map;

    // Counters.Counter private OwnershipToken;
    BookingMap.Map private booking;
    UserMapping.Map private User;

    // VARIABLES
    IERC20 private USDT;

    uint public bookingBefore =  0; // user can't book date Before (bookingBefore)date
    uint public bookingAfter  =  604800; // user can't book date After  (bookingAfter)date
    
    uint public offerBefore =  0; // user can't offer After (offerBefore)date
    uint public acceptOfferBefore =  0; // user can't acceptOffer After (acceptOfferBefore)date
    uint public offerPrice = 300 ether; // user have to pay USDT for offer

    


    constructor() Ownable(msg.sender) {

        USDT = IERC20(0x65C89088C691841D55263E74C7F5cD73Ae60186C);
    
    }

    event mint(uint token, address user);
    event booked(uint token, address user);
    event offered(uint token, address user);
    event offerAccepted(uint token, address user);

    function getUserIDs(address _contract, address user) public view returns (uint256[] memory) {
        return User.getTokens(_contract, user);
    }

    function getMapUserAllContractAddress(address _user) public view returns (address[] memory) {
        return User.getAllContractAddress(_user);
    }

    function getAllUser() public view returns (address[] memory) {
        return User.getUser();
    }

    function getUserData(address _Contract, uint _id) public view returns (
        bool _isInserted
        ) {
        _isInserted = booking.isInserted(_Contract, _id);
    }


    function getBookedDate(address _Contract, uint _id) public view returns (
        uint _blockTimestamp, uint _DateAndTime, uint _newYear ) {

        (_blockTimestamp, _DateAndTime, _newYear) = booking.getTime(_Contract, _id);
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


    /******************************************************
    *           Deploy New Smart Contract (loigc)
    *******************************************************/

    event deploy_(address _Contract);

    struct _contractDitals {
        string name;
        string symbol;
        uint tSupply;
        uint tOwnership;
        uint price;
        address ownerAddress;
        string baseURI;
    }

    address[] private allContractAddress;
    mapping (address => _contractDitals) private contractDitals;
    mapping (address => address[]) private userAllContractAddress;

    function getAllContractAddress() public view returns(address[] memory) {
        return allContractAddress;
    }

    function getUserAllContractAddress(address user_) public view returns(address[] memory) {
        return userAllContractAddress[user_];
    }

    function getContractInfo(address _Contract) public view returns (

        string memory name,
        string memory symbol,
        uint tSupply,
        uint tOwnership,
        uint price,
        address ownerAddress,
        string memory baseURI

        ) {

        name = contractDitals[_Contract].name;
        symbol = contractDitals[_Contract].symbol;
        tSupply = contractDitals[_Contract].tSupply;
        tOwnership = contractDitals[_Contract].tOwnership;
        price = contractDitals[_Contract].price;
        ownerAddress = contractDitals[_Contract].ownerAddress;
        baseURI = contractDitals[_Contract].baseURI;
        
    }

    function deploy(
        string memory name_, string memory symbol_, uint totalSupply_,
        uint price_, address ownerAddress_, string memory baseURI_
    ) public {
        
        address _Contract = address(new Boating{salt: keccak256(
            abi.encode(userAllContractAddress[ownerAddress_].length, ownerAddress_)
            )} (name_, symbol_, address(this), baseURI_));

        allContractAddress.push(_Contract);
        contractDitals[_Contract] = _contractDitals(
            name_, symbol_, totalSupply_, 0, price_, ownerAddress_, baseURI_
        );

        userAllContractAddress[ownerAddress_].push(_Contract);
        emit deploy_(_Contract);

    }


    



    /******************************************************
    *               Buy Ownership (loigc)
    *******************************************************/
    
    function buyOwnership (

        uint256 _tOwnership,
        uint256 _USDT,
        address contractAddress_

        ) public {

        require ( _tOwnership > 0, "!tOwnership");

        require ( 
            contractDitals[contractAddress_].tSupply >= 
                (contractDitals[contractAddress_].tOwnership.add(_tOwnership)), 
            "!Total Supply"
        );

        require ( 
            (contractDitals[contractAddress_].price.mul(_tOwnership)) == _USDT, 
            "!Not suffecient USDT"
        );
        

        USDT.transferFrom( msg.sender, owner(), _USDT );

        MYIERC721 IContract = MYIERC721(contractAddress_);

        for (uint256 i = 0; i < _tOwnership; i++) {

            contractDitals[contractAddress_].tOwnership++;
            uint _current = contractDitals[contractAddress_].tOwnership;

            User.set(contractAddress_, _msgSender(), _current);
            IContract.safeMint(msg.sender, _current);

            emit mint(_current, msg.sender);

        }

    }


    /******************************************************
    *   BookDate loigc (bookDate, cancelBooking)
    *******************************************************/

    


    uint public newYear;
    struct _bookDates {
        uint _year;
        uint _month;
        uint _day;
    }

    mapping(address => mapping(uint => uint)) indexOfBookedDates;
    mapping(address => mapping(uint => uint)) indexOf;
    mapping(address =>mapping(uint => _bookDates[])) public allBookedDates;
    mapping(address => mapping(uint => mapping ( uint => mapping ( uint => uint )))) public bookDateID;

    uint cancelBefore = 86400;
    event _cancelBooking(address _Contract, uint id, uint year, uint month, uint day);


    function   bookDate(

        uint year, uint month, uint day, address _Contract, uint _id

        ) public {

        MYIERC721 IContract = MYIERC721(_Contract);
        address __owner = IContract.ownerOf(_id);

        require(
            _msgSender() == __owner || IContract.isApprovedForAll(__owner, _msgSender()),
            "ERC721: approve caller is not owner nor approved for all"
        );

        require ( DateTimeLibrary.isValidDate(year, month, day), "inValid Date");
        uint _newDAte = DateTimeLibrary.timestampFromDate(year, month, day);

        (, uint _DateAndTime, uint _newYear) = booking.getTime(_Contract, _id);

        if (booking.isInserted(_Contract, _id)) {
            require ( _newDAte > _newYear, "Token Already Booked");
        }

        require(_DateAndTime != _newDAte, "Date Already Booked");
        
        uint _blockTimestamp = block.timestamp;
        console.log((_blockTimestamp + bookingBefore), "newDAte", _newDAte);
        require ( (_blockTimestamp + bookingBefore) < _newDAte, "!booking Before");
        require ( (_blockTimestamp + bookingAfter ) > _newDAte, "!booking After");

        uint __newYear = DateTimeLibrary.timestampFromDate(year.add(1), 12, 31);

        if (newYear != __newYear) newYear = __newYear;
        indexOfBookedDates[_Contract][_id] = allBookedDates[_Contract][newYear].length;
        allBookedDates[_Contract][newYear].push(_bookDates(year, month, day));
        bookDateID[_Contract][year][month][day] = _id;

        booking.set(_Contract, _id, _msgSender(), _blockTimestamp, _newDAte, __newYear);

        emit booked(_id, _msgSender());

    }


    function getAllBookedDates(address _Contract, uint _newYear) public view returns(_bookDates[] memory) {
        return allBookedDates[_Contract][_newYear];
    }

    function getBookDateID(address _Contract, uint year, uint month, uint day) public view returns(uint) {
        return bookDateID[_Contract][year][month][day];
    }

    
    function cancelBooking(address _Contract, uint _id) public {

        require (booking.isInserted(_Contract, _id), "!Booked");
        require (booking.getOwner(_Contract, _id) == _msgSender(), "!Owner");

        (, uint _DateAndTime ,) = booking.getTime(_Contract, _id);
        require (_DateAndTime > (block.timestamp.sub(cancelBefore)), "Cant Cancel Booking Now");

        (uint _year, uint _month, uint _day) = DateTimeLibrary.timestampToDate(_DateAndTime);

        booking.remove(_Contract, _id);
        delete bookDateID[_Contract][_year][_month][_day];

        uint index = indexOfBookedDates[_Contract][_id];
        uint lastIndex = allBookedDates[_Contract][newYear].length - 1;
        uint year = allBookedDates[_Contract][newYear][lastIndex]._year;
        uint month = allBookedDates[_Contract][newYear][lastIndex]._month;
        uint day = allBookedDates[_Contract][newYear][lastIndex]._day;

        delete indexOf[_Contract][_id];

        allBookedDates[_Contract][newYear][index] = _bookDates( year, month, day );
        allBookedDates[_Contract][newYear].pop();

        emit _cancelBooking(_Contract, _id, _year, _month, _day);

    }

    

    /*******************************************************
    *   offer logic (offer, cancelOffer, acceptOffer)
    *******************************************************/

    struct _offer {
        uint id;
        uint userID;
        uint Price;
        uint Time;
        uint offeredDate;
        address User;
        address Contract;
    }


    mapping(address => mapping(uint => _offer)) public offers;
    mapping(address => mapping(address => uint[])) public userAllOffers;
    
    mapping(address => mapping(uint => bool)) public offerdID;
    mapping(address => mapping(uint => bool)) public acceptedOffers;

    function offer(address _Contract, uint _id, uint _userID, uint256 _USDT ) public {

        require(!offerdID[_Contract][_id], "offerdID");

        address _msgSender = _msgSender();

        MYIERC721 IContract = MYIERC721(_Contract);

        require(IContract.balanceOf(_msgSender) > 0, "!Token");
        require(IContract.ownerOf(_userID) == _msgSender, "!Owner");

        require ( booking.isInserted(_Contract, _id), "!Booked");

        require ( offerPrice == _USDT, "!OfferPrice");

        (,uint _DateAndTime,) = booking.getTime(_Contract, _id);

        require ( (_DateAndTime.sub(offerBefore)) > block.timestamp, "!Time Out");

        USDT.transferFrom( _msgSender, address(this), _USDT);

        offers[_Contract][_id] = _offer (_id, _userID, _USDT, (_DateAndTime.sub(acceptOfferBefore)),  _DateAndTime, _msgSender, _Contract);
        indexOf[_Contract][_id] = userAllOffers[_Contract][_msgSender].length;
        userAllOffers[_Contract][_msgSender].push(_id);
        offerdID[_Contract][_id] = true;

        emit offered(_id, _msgSender);

    }

    function getUserAllOffers(address _Contract, address _user) public view returns(uint[] memory) {
        return userAllOffers[_Contract][_user];
    }

    function getOffer(address _Contract, uint _id) public view returns (

        uint id__,
        uint userID__,
        uint Price__,
        uint Time__,
        uint offeredDate__,
        address User__,
        address Contract__
        
        ) {

        id__  = offers[_Contract][_id].id;
        userID__  = offers[_Contract][_id].userID;
        Price__   = offers[_Contract][_id].Price;
        Time__    = offers[_Contract][_id].Time;
        offeredDate__  = offers[_Contract][_id].offeredDate;
        User__    = offers[_Contract][_id].User;
        Contract__    = offers[_Contract][_id].Contract;

    }


    



    function cancelOffer(address _Contract, uint _id) public {

        require(offerdID[_Contract][_id],"!offerd");

        address _msgSender = _msgSender();
        require(offers[_Contract][_id].User == _msgSender, "!User");

        USDT.transfer( _msgSender, offers[_Contract][_id].Price);

        uint index = indexOf[_Contract][_id];
        uint lastIndex = userAllOffers[_Contract][_msgSender].length - 1;
        uint lastKey = userAllOffers[_Contract][_msgSender][lastIndex];

        indexOf[_Contract][lastKey] = index;
        delete indexOf[_Contract][_id];

        userAllOffers[_Contract][_msgSender][index] = lastKey;
        userAllOffers[_Contract][_msgSender].pop();

        delete offers[_Contract][_id];
        delete offerdID[_Contract][_id];
    }




    function acceptOffer(address _Contract, uint _id) public {

        require ( offerdID[_Contract][_id], "!Offerd");
        require ( booking.getOwner(_Contract, _id) == _msgSender(), "!Owner");
        require ( offers[_Contract][_id].Time > block.timestamp, "!Time Out");

        (, uint _dateAndTime, uint _newYear) = booking.getTime(_Contract, _id);
        booking.remove(_Contract, _id);
        booking.set(
            _Contract, offers[_Contract][_id].userID, 
            offers[_Contract][_id].User, block.timestamp, _dateAndTime, _newYear);

        (uint year, uint month, uint day) = DateTimeLibrary.timestampToDate(_dateAndTime);
        bookDateID[_Contract][year][month][day] = offers[_Contract][_id].userID;

        acceptedOffers[_Contract][_id] = true;
        USDT.transfer(_msgSender(), offers[_Contract][_id].Price);

        delete offerdID[_Contract][_id];
        delete offers[_Contract][_id];

        emit offerAccepted(_id, _msgSender());

    }



    

}
