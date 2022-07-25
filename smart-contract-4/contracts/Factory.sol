//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interfaces/MYIERC721.sol";
import "./interfaces/IERC20.sol";

import "./Contracts/Ownable.sol";
import "./Contracts/Whitelist.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./library/BookingMap.sol";
import "./library/UserMapping.sol";
import "./library/DateTimeLibrary.sol";

import "./Boating.sol";

contract Factory is Ownable, Whitelist {

    using SafeMath for uint256;

    using Counters for Counters.Counter;
    using BookingMap for BookingMap.Map;
    using UserMapping for UserMapping.Map;

    // Counters.Counter private contractsCounter;
    BookingMap.Map private booking;
    UserMapping.Map private User;


    /***********************************************
    *   variables
    ***********************************************/

    IERC20 private USDT;

    
    

    
    /***********************************************
    *   constructor
    ***********************************************/

    constructor(address _USDT) Ownable(msg.sender) {
        USDT = IERC20(_USDT);
    }



    
    /******************************************************
    *           Deploy New Smart Contract (loigc)
    *******************************************************/

    event deploy_(address _Contract, uint id);

    struct contractDitals_ {
        uint id;
        string name;
        string symbol;
        uint tSupply;
        uint tOwnership;
        uint price;
        address ownerAddress;
        string baseURI;
    }

    uint private _contractCounter;
    address[] private _allContractAddress;
    mapping (address => contractDitals_) private _contractDitals;
    mapping (address => address[]) private _userAllContractAddress;

    // view functions

    function contractCounter() public view returns(uint) {
        return _contractCounter;
    }

    function allContractAddress() public view returns(address[] memory) {
        return _allContractAddress;
    }

    function userAllContractAddress(address user_) public view returns(address[] memory) {
        return _userAllContractAddress[user_];
    }

    function contractDitals(address _Contract) public view returns (

        string memory name, string memory symbol, uint tSupply,
        uint tOwnership, uint price, address ownerAddress, string memory baseURI

        ) {

        name = _contractDitals[_Contract].name;
        symbol = _contractDitals[_Contract].symbol;
        tSupply = _contractDitals[_Contract].tSupply;
        tOwnership = _contractDitals[_Contract].tOwnership;
        price = _contractDitals[_Contract].price;
        ownerAddress = _contractDitals[_Contract].ownerAddress;
        baseURI = _contractDitals[_Contract].baseURI;
        
    }

    function deploy(

        string memory name_, string memory symbol_, uint totalSupply_,
        uint price_, address ownerAddress_, string memory baseURI_

        ) public onlyWhitelisted {
        
        _contractCounter++;

        address _Contract = address(new Boating{salt: keccak256(
            abi.encode(_userAllContractAddress[ownerAddress_].length, _contractCounter, ownerAddress_)
            )} (name_, symbol_, address(this), baseURI_));


        uint decimals = USDT.decimals();
        _contractDitals[_Contract] = contractDitals_(
            _contractCounter, name_, symbol_, totalSupply_, 0,
            (price_ * 10 ** decimals), ownerAddress_, baseURI_
        );

        _allContractAddress.push(_Contract);
        _userAllContractAddress[ownerAddress_].push(_Contract);
        emit deploy_(_Contract, _contractCounter);

    }





    /******************************************************
    *               Buy Ownership (loigc)
    *******************************************************/

    event mint(uint token, address user);

    function buyOwnership (

        uint256 tOwnership_,
        uint256 USDT_,
        address contract_

        ) public {

        require ( tOwnership_ > 0, "!tOwnership");

        require ( 
            _contractDitals[contract_].tSupply >= 
                (_contractDitals[contract_].tOwnership.add(tOwnership_)), 
            "!Total Supply"
        );

        require ( 
            (_contractDitals[contract_].price.mul(tOwnership_)) == USDT_, 
            "!Not suffecient USDT"
        );
        

        USDT.transferFrom( msg.sender, _contractDitals[contract_].ownerAddress, USDT_ );
        MYIERC721 IContract = MYIERC721(contract_);

        for (uint256 i = 0; i < tOwnership_; i++) {

            _contractDitals[contract_].tOwnership++;
            uint _current = _contractDitals[contract_].tOwnership;

            User.set(contract_, _msgSender(), _current);
            IContract.safeMint(msg.sender, _current);

            emit mint(_current, msg.sender);

        }

    }





    /******************************************************
    *   BookDate loigc (bookDate, cancelBooking)
    *******************************************************/

    uint private _newYear;
    uint private _bookingBefore = 0; // user can't book date Before (bookingBefore)date
    uint private _bookingAfter  = 604800; // user can't book date After  (bookingAfter)date
    uint private _cancelBefore  = 86400;

    struct _bookDates {
        uint _year;
        uint _month;
        uint _day;
    }

    mapping(address => mapping(uint => uint)) private _indexOfBookedDates;
    mapping(address => mapping(uint => _bookDates[])) private _allBookedDates;
    mapping(address => mapping(uint => mapping ( uint => mapping ( uint => uint )))) private _bookDateID;

    event booked(uint token, address user);
    event _cancelBooking(address _Contract, uint id, uint year, uint month, uint day);


    // update function
    function updateBookingBefore(uint time_) public {
        _bookingBefore = time_;
    }
    function updateBookingAfter(uint time_) public {
        _bookingAfter = time_;
    }
    function updateCancelBefore(uint time_) public {
        _cancelBefore = time_;
    }


    // view function
    function bookingBefore() public view returns(uint) {
        return _bookingBefore;
    }
    function bookingAfter() public view returns(uint) {
        return _bookingAfter;
    }
    function cancelBefore() public view returns(uint) {
        return _cancelBefore;
    }
    function allBookedDates(address contract_, uint newYear_) public view returns(_bookDates[] memory) {
        return _allBookedDates[contract_][newYear_];
    }
    function bookDateID(address contract_, uint year_, uint month_, uint day_) public view returns(uint) {
        return _bookDateID[contract_][year_][month_][day_];
    }


    // public function
    function bookDate(

        uint year_, uint month_, uint day_, address contract_, uint id_

        ) public {

        MYIERC721 IContract = MYIERC721(contract_);
        address __owner = IContract.ownerOf(id_);

        require(
            _msgSender() == __owner || IContract.isApprovedForAll(__owner, _msgSender()),
            "ERC721: approve caller is not owner nor approved for all"
        );

        require ( DateTimeLibrary.isValidDate(year_, month_, day_), "inValid Date");
        uint lnewDAte_ = DateTimeLibrary.timestampFromDate(year_, month_, day_);

        (, uint bookedTime_, uint newYear_) = booking.getTime(contract_, id_);

        if (booking.isInserted(contract_, id_)) {
            require ( lnewDAte_ > newYear_, "Token Already Booked");
        }

        require(bookedTime_ != lnewDAte_, "Date Already Booked");
        
        uint _blockTimestamp = block.timestamp;
        require ( (_blockTimestamp + _bookingBefore) < lnewDAte_, "!booking Before");
        require ( (_blockTimestamp + _bookingAfter ) > lnewDAte_, "!booking After");

        uint lnewYear_ = DateTimeLibrary.timestampFromDate(year_.add(1), 12, 31);

        if (newYear_ != lnewYear_) newYear_ = lnewYear_;
        _indexOfBookedDates[contract_][id_] = _allBookedDates[contract_][newYear_].length;
        _allBookedDates[contract_][newYear_].push(_bookDates(year_, month_, day_));
        _bookDateID[contract_][year_][month_][day_] = id_;

        booking.set(contract_, id_, _msgSender(), _blockTimestamp, lnewDAte_, lnewYear_);

        emit booked(id_, _msgSender());

    }

    function cancelBooking(address contract_, uint id_) public {

        require (booking.isInserted(contract_, id_), "!Booked");
        require (booking.getOwner(contract_, id_) == _msgSender(), "!Owner");

        (, uint _DateAndTime ,) = booking.getTime(contract_, id_);
        require (_DateAndTime > (block.timestamp.sub(_cancelBefore)), "Cant Cancel Booking Now");

        (uint _year, uint _month, uint _day) = DateTimeLibrary.timestampToDate(_DateAndTime);

        booking.remove(contract_, id_);
        delete _bookDateID[contract_][_year][_month][_day];

        uint index = _indexOfBookedDates[contract_][id_];
        uint lastIndex = _allBookedDates[contract_][_newYear].length - 1;
        uint year = _allBookedDates[contract_][_newYear][lastIndex]._year;
        uint month = _allBookedDates[contract_][_newYear][lastIndex]._month;
        uint day = _allBookedDates[contract_][_newYear][lastIndex]._day;

        delete _indexOfBookedDates[contract_][id_];

        _allBookedDates[contract_][_newYear][index] = _bookDates( year, month, day );
        _allBookedDates[contract_][_newYear].pop();

        emit _cancelBooking(contract_, id_, _year, _month, _day);

    }






    /*******************************************************
    *   offer logic (offer, cancelOffer, acceptOffer)
    *******************************************************/

    struct offer_ {
        uint id;
        uint userID;
        uint Price;
        uint Time;
        uint offeredDate;
        address User;
        address Contract;
    }

    uint public _offerBefore; // user can't offer After (offerBefore)date
    uint public _acceptOfferBefore; // user can't acceptOffer After (acceptOfferBefore)date
    uint public _offerPrice; // user have to pay USDT for offer

    mapping(address => mapping(uint => uint)) private _indexOfuserAllOffers;
    mapping(address => mapping(uint => offer_)) private _offers;
    mapping(address => mapping(address => uint[])) private _userAllOffers;
    
    mapping(address => mapping(uint => bool)) private _offerdID;
    mapping(address => mapping(uint => bool)) private _acceptedOffers;

    event offered(uint token, address user);
    event offerAccepted(uint token, address user);

    // update function
    function updateOfferBefore(uint time_) public {
        _offerBefore = time_;
    }
    function updateAcceptOfferBefore(uint time_) public {
        _acceptOfferBefore = time_;
    }
    function updateOfferPrice(uint amount_) public {
        uint decimals = USDT.decimals();
        _offerPrice = (amount_ * 10 ** decimals);
    }

    // view function
    function offerBefore() public view returns(uint) {
        return _offerBefore;
    }
    function acceptOfferBefore() public view returns(uint) {
        return _acceptOfferBefore;
    }
    function offerPrice() public view returns(uint) {
        return _offerPrice;
    }
    function userAllOffers(address contract_, address user_) public view returns(uint[] memory) {
        return _userAllOffers[contract_][user_];
    }
    function getOffer(address contract_, uint id_) public view returns (

        uint id,
        uint userID,
        uint price,
        uint time,
        uint offeredDate,
        address userAddress,
        address contractAddress
        
        ) {

        id              = _offers[contract_][id_].id;
        userID          = _offers[contract_][id_].userID;
        price           = _offers[contract_][id_].Price;
        time            = _offers[contract_][id_].Time;
        offeredDate     = _offers[contract_][id_].offeredDate;
        userAddress     = _offers[contract_][id_].User;
        contractAddress = _offers[contract_][id_].Contract;

    }


    function offer(address contract_, uint id_, uint userID_, uint256 USDT_ ) public {

        require(!_offerdID[contract_][id_], "offerdID");

        address _msgSender = _msgSender();

        MYIERC721 IContract = MYIERC721(contract_);

        require(IContract.balanceOf(_msgSender) > 0, "!Token");
        require(IContract.ownerOf(userID_) == _msgSender, "!Owner");

        require ( booking.isInserted(contract_, id_), "!Booked");

        require ( _offerPrice <= USDT_, "!OfferPrice");

        (,uint _DateAndTime,) = booking.getTime(contract_, id_);

        require ( (_DateAndTime.sub(_offerBefore)) > block.timestamp, "!Time Out");

        USDT.transferFrom( _msgSender, address(this), USDT_);

        _offers[contract_][id_] = 
            offer_(id_, userID_, USDT_, (_DateAndTime.sub(_acceptOfferBefore)),  _DateAndTime, _msgSender, contract_);
        _indexOfuserAllOffers[contract_][id_] = _userAllOffers[contract_][_msgSender].length;
        _userAllOffers[contract_][_msgSender].push(id_);
        _offerdID[contract_][id_] = true;

        emit offered(id_, _msgSender);

    }

    function cancelOffer(address contract_, uint id_) public {

        require(_offerdID[contract_][id_],"!offerd");

        address _msgSender = _msgSender();
        require(_offers[contract_][id_].User == _msgSender, "!User");

        USDT.transfer( _msgSender, _offers[contract_][id_].Price);

        uint index = _indexOfuserAllOffers[contract_][id_];
        uint lastIndex = _userAllOffers[contract_][_msgSender].length - 1;
        uint lastKey = _userAllOffers[contract_][_msgSender][lastIndex];

        _indexOfuserAllOffers[contract_][lastKey] = index;
        delete _indexOfuserAllOffers[contract_][id_];

        _userAllOffers[contract_][_msgSender][index] = lastKey;
        _userAllOffers[contract_][_msgSender].pop();

        delete _offers[contract_][id_];
        delete _offerdID[contract_][id_];
    }

    function acceptOffer(address contract_, uint id_) public {

        require ( _offerdID[contract_][id_], "!Offerd");
        require ( booking.getOwner(contract_, id_) == _msgSender(), "!Owner");
        require ( _offers[contract_][id_].Time > block.timestamp, "!Time Out");

        (, uint bookedTime_, uint newYear_) = booking.getTime(contract_, id_);
        booking.remove(contract_, id_);
        booking.set(
            contract_, _offers[contract_][id_].userID, 
            _offers[contract_][id_].User, block.timestamp, bookedTime_, newYear_);

        (uint year, uint month, uint day) = DateTimeLibrary.timestampToDate(bookedTime_);
        _bookDateID[contract_][year][month][day] = _offers[contract_][id_].userID;

        _acceptedOffers[contract_][id_] = true;
        USDT.transfer(_msgSender(), _offers[contract_][id_].Price);

        delete _offerdID[contract_][id_];
        delete _offers[contract_][id_];

        emit offerAccepted(id_, _msgSender());

    }

}
