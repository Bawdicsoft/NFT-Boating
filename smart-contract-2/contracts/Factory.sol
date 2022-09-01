//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./interfaces/MYIERC721.sol";
import "./interfaces/INFTilityExchange.sol";
import "./interfaces/IUSDT.sol";
import "./DeployHandler/IDeploy.sol";

import "./Contracts/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./library/BookingMap.sol";
import "./library/UserMapping.sol";
import "./library/DateTimeLibrary.sol";

import "hardhat/console.sol";

contract Factory is Ownable {

    using SafeMath for uint256;

    using BookingMap for BookingMap.Map;
    using UserMapping for UserMapping.Map;

    BookingMap.Map private booking;
    UserMapping.Map private User;


    /***********************************************
    *   variables
    ***********************************************/

    IUSDT public USDT;
    IERC20 public NFTilityToken;
    IDeploy private DeployHandler;
    INFTilityExchange private ExchangeHandler;
    uint public ownerFee = 20; // 20%

    
    /***********************************************
    *   constructor
    ***********************************************/

    constructor(address _USDT, address _NFTilityToken, address _ExchangeHandler, address _DeployHandler) Ownable(msg.sender) {
        USDT = IUSDT(_USDT);
        NFTilityToken = IERC20(_NFTilityToken);
        ExchangeHandler = INFTilityExchange(_ExchangeHandler);
        DeployHandler = IDeploy(_DeployHandler);
    }

    function updateOwnerFee(uint _fee) public onlyOwner {
        require(ownerFee != _fee, "!already");
        ownerFee = _fee;
    }


    /******************************************************
    *               Buy Ownership (loigc)
    *******************************************************/

    event mint(uint token, address user);

    enum Tokens {
        USDT,
        NFTilityToken
    }

    function buyOwnership ( uint256 tOwnership_, Tokens token_, uint256 value_, address contract_ ) public {

        require ( tOwnership_ > 0, "!tOwnership");

        ( ,,, uint contractTotalSupply, uint contractTotalOwnership, uint contractPrice, address contractOwner , ) =
            DeployHandler.contractDitals(contract_);

        require ( 
            contractTotalSupply >= (contractTotalOwnership.add(tOwnership_)), 
            "!Total Supply"
        );

        

        if (token_ == Tokens.USDT) {
            
            require ( 
                (contractPrice.mul(tOwnership_)) == value_, 
                "!inSufficient USDT"
            );

            require (
                (USDT.allowance(msg.sender, address(this))) >= value_, 
                "!inSufficient USDT allowance"
            );

            uint256 _ownerFee = value_.mul(ownerFee).div(100);
            uint256 _boatFee = value_.sub(_ownerFee);

            USDT.transferFrom( msg.sender, owner(), _ownerFee );
            USDT.transferFrom( msg.sender, contractOwner, _boatFee );

        }

        if (token_ == Tokens.NFTilityToken) {

            contractPrice = ExchangeHandler.priceCalculatorUSDTtoNNT(contractPrice);

            require ( 
                (contractPrice.mul(tOwnership_)) == value_, 
                "!inSufficient NFTilityToken"
            );

            uint256 _ownerFee = value_.mul(ownerFee).div(100);
            uint256 _boatFee = value_.sub(_ownerFee);

            NFTilityToken.transferFrom( msg.sender, owner(), _ownerFee );
            NFTilityToken.transferFrom( msg.sender, contractOwner, _boatFee );

        }


        MYIERC721 IContract = MYIERC721(contract_);

        for (uint256 i = 0; i < tOwnership_; i++) {

            DeployHandler.updateTotalOwnership(contract_, tOwnership_);
            uint _current = contractTotalOwnership.add(tOwnership_);

            User.set(contract_, _msgSender(), _current);
            IContract.safeMint(msg.sender, _current);

            emit mint(_current, msg.sender);

        }

    }

    /******************************************************
    *   BookDate loigc (bookDate, cancelBooking)
    *******************************************************/
    uint public _newYear;
    uint public _bookingBefore; // user can't book date Before (bookingBefore)date
    uint public _bookingAfter = 5260000; // user can't book date After  (bookingAfter)date
    uint public _cancelBefore;
    uint public _maintenanceFee = 300000000;

    struct date {
        uint _year;
        uint _month;
        uint _day;
    }

    mapping(address => mapping(uint => uint)) public _indexOfBookedDates;
    mapping(address => mapping(uint => date[])) private _allBookedDates;
    mapping(address => mapping(uint => mapping ( uint => mapping ( uint => uint )))) public _bookDateID;

    event booked(uint token, address user);
    event _cancelBooking(address _Contract, uint id, uint year, uint month, uint day);

    mapping(address => date[]) private _specialDays;
    mapping(address => mapping(uint => mapping(uint => mapping(uint => bool)))) private _isSpecialDay;
    mapping(address => mapping(uint => mapping(uint => mapping(uint => uint)))) private _specialDayAmount;
    mapping(address => mapping(uint => mapping(uint => mapping(uint => uint)))) private _specialDayOwnerUSDT;
    mapping(address => mapping(uint => mapping(uint => mapping(uint => uint)))) private _specialDayOwnerNFTilityToken;
    mapping(address => mapping(uint => mapping(uint => bool))) public _maintenanceFeePad;

    // update function
    function addSpecialDay(uint year_, uint month_, uint day_, uint amount_, address contract_) public {

        ( ,,,,,, address contractOwner , ) = DeployHandler.contractDitals(contract_);
        require(contractOwner == msg.sender, "!ContractOwner");

        if (_isSpecialDay[contract_][year_][month_][day_]) {
            _specialDayAmount[contract_][year_][month_][day_] = amount_;
        } else {
            _specialDays[contract_].push( date(year_, month_, day_) );
            _isSpecialDay[contract_][year_][month_][day_] = true;
            _specialDayAmount[contract_][year_][month_][day_] = amount_;
        }
    }
    function updateBookingBefore(uint time_) public onlyOwner {
        _bookingBefore = time_;
    }
    function updateBookingAfter(uint time_) public onlyOwner {
        _bookingAfter = time_;
    }
    function updateCancelBefore(uint time_) public onlyOwner {
        _cancelBefore = time_;
    }
    function updateMaintenanceFee(uint fee_) public onlyOwner {
        _maintenanceFee = fee_;
    }

    // view function
    function specialDays(address contract_) public view returns(date[] memory) {
        return _specialDays[contract_];
    }
    function specialDayAmount(uint year_, uint month_, uint day_, address contract_) public view returns(uint) {
        return _specialDayAmount[contract_][year_][month_][day_];
    }
    function allBookedDates(address contract_, uint newYear_) public view returns(date[] memory) {
        return _allBookedDates[contract_][newYear_];
    }
    function specialDayOwnerUSDT(address contract_, uint year_, uint month_, uint day_) public view returns(uint) {
        return _specialDayOwnerUSDT[contract_][year_][month_][day_];
    }
    function specialDayOwnerNFTilityToken(address contract_, uint year_, uint month_, uint day_) public view returns(uint) {
        return _specialDayOwnerNFTilityToken[contract_][year_][month_][day_];
    }

    // public function
    function bookDate(

        uint year_, uint month_, uint day_, address contract_, uint id_, Tokens token_, uint256 value_

        ) public {
        
        uint id__ = id_;
        uint day__ = day_;
        uint month__ = month_;
        uint year__ = year_;
        address contract__ = contract_;
        uint amountValue_ = value_;
        MYIERC721 IContract = MYIERC721(contract_);
        address __owner = IContract.ownerOf(id__);

        require(
            _msgSender() == __owner || IContract.isApprovedForAll(__owner, _msgSender()),
            "ERC721: approve caller is not owner nor approved for all"
        );

        require ( DateTimeLibrary.isValidDate(year__, month__, day__), "inValid Date");
        uint lnewDAte_ = DateTimeLibrary.timestampFromDate(year__, month__, day__);

        (, uint bookedTime_, uint newYear_) = booking.getTime(contract__, id__);

        if (booking.isInserted(contract__, id__)) {
            require ( lnewDAte_ > newYear_, "Token Already Booked");
            if (_maintenanceFee > 0) {
                require (_maintenanceFeePad[contract__][_newYear][id__], "!maintenanceFeePad");
            }
        }

        require(bookedTime_ != lnewDAte_, "Date Already Booked");
        
        uint _blockTimestamp = block.timestamp;
        require ( (_blockTimestamp + _bookingBefore) < lnewDAte_, "!booking Before");
        require ( (_blockTimestamp + _bookingAfter ) > lnewDAte_, "!booking After");

        uint lnewYear_ = DateTimeLibrary.timestampFromDate((year__ + 1), 12, 31);

        if (_isSpecialDay[contract__][year__][month__][day__]) {
            if ( token_ == Tokens.USDT ) {

                require(USDT.allowance(msg.sender, address(this)) <= amountValue_, "!allowance");
                require(_specialDayAmount[contract__][year__][month__][day__] == amountValue_, "!specialDayAmount");

                USDT.transferFrom( msg.sender, address(this), amountValue_ );

                _specialDayOwnerUSDT[contract__][year__][month__][day__] = amountValue_;

            }

            if ( token_ == Tokens.NFTilityToken ) {

                uint specialDayAmount__ = _specialDayAmount[contract__][year__][month__][day__];
                specialDayAmount__ = ExchangeHandler.priceCalculatorUSDTtoNNT(specialDayAmount__);

                require ( 
                    (specialDayAmount__) == amountValue_, 
                    "!inSufficient NFTilityToken"
                );

                NFTilityToken.transferFrom( msg.sender, address(this), amountValue_ );

                _specialDayOwnerNFTilityToken[contract__][year__][month__][day__] = amountValue_;
            
            }
        }


        if (_newYear > lnewYear_) _newYear = lnewYear_;
        _indexOfBookedDates[contract__][id__] = _allBookedDates[contract__][newYear_].length;
        _allBookedDates[contract__][newYear_].push(date(year__, month__, day__));
        _bookDateID[contract__][year__][month__][day__] = id__;

        booking.set(contract__, id__, _msgSender(), _blockTimestamp, lnewDAte_, lnewYear_);

        emit booked(id__, _msgSender());

    }


    function cancelBooking(address contract_, uint id_) public {

        require (booking.isInserted(contract_, id_), "!Booked");
        require (booking.getOwner(contract_, id_) == _msgSender(), "!Owner");

        (, uint _DateAndTime ,) = booking.getTime(contract_, id_);
        require (_DateAndTime > (block.timestamp.sub(_cancelBefore)), "Cant Cancel Booking Now");

        (uint _year, uint _month, uint _day) = DateTimeLibrary.timestampToDate(_DateAndTime);

        if (_specialDayOwnerUSDT[contract_][_year][_month][_day] > 0) {

            USDT.transfer( msg.sender, _specialDayOwnerUSDT[contract_][_year][_month][_day]);
            _specialDayOwnerUSDT[contract_][_year][_month][_day] = 0;
        }

        if (_specialDayOwnerNFTilityToken[contract_][_year][_month][_day] > 0) {

            NFTilityToken.transfer( msg.sender, _specialDayOwnerNFTilityToken[contract_][_year][_month][_day]);
            _specialDayOwnerNFTilityToken[contract_][_year][_month][_day] = 0;
        }

        booking.remove(contract_, id_);
        delete _bookDateID[contract_][_year][_month][_day];

        uint index = _indexOfBookedDates[contract_][id_];
        uint lastIndex = _allBookedDates[contract_][_newYear].length - 1;
        uint year = _allBookedDates[contract_][_newYear][lastIndex]._year;
        uint month = _allBookedDates[contract_][_newYear][lastIndex]._month;
        uint day = _allBookedDates[contract_][_newYear][lastIndex]._day;

        delete _indexOfBookedDates[contract_][id_];

        _allBookedDates[contract_][_newYear][index] = date( year, month, day );
        _allBookedDates[contract_][_newYear].pop();

        emit _cancelBooking(contract_, id_, _year, _month, _day);

    }


    function payMaintenanceFee(address contract_, uint id_, Tokens token_, uint256 value_) public {

        require (booking.isInserted(contract_, id_), "!Booked");
        require (booking.getOwner(contract_, id_) == _msgSender(), "!Owner");
        require (!_maintenanceFeePad[contract_][_newYear][id_], "Maintenance Fee paid");

        ( ,,,,,, address contractOwner , ) = DeployHandler.contractDitals(contract_);

        if (token_ == Tokens.USDT) {
            
            require(_maintenanceFee == value_, "!maintenanceFee");
            require(USDT.allowance(msg.sender, address(this)) <= value_, "!allowance");
            
            uint256 _ownerFee = value_.mul(ownerFee).div(100);
            uint256 _boatFee = value_.sub(_ownerFee);

            USDT.transferFrom( msg.sender, owner(), _ownerFee );
            USDT.transferFrom( msg.sender, contractOwner, _boatFee );
            
        }

        if (token_ == Tokens.NFTilityToken) {
            
            uint mFee_ = ExchangeHandler.priceCalculatorUSDTtoNNT(_maintenanceFee);
            require(mFee_ == value_, "!maintenanceFee");

            uint256 _ownerFee = value_.mul(ownerFee).div(100);
            uint256 _boatFee = value_.sub(_ownerFee);

            NFTilityToken.transferFrom( msg.sender, owner(), _ownerFee );
            NFTilityToken.transferFrom( msg.sender, contractOwner, _boatFee );

        }

        _maintenanceFeePad[contract_][_newYear][id_] = true;

    }


    function withdrewSpecialDayAmount(uint year_, uint month_, uint day_, address contract_) public {

        ( ,,,,,, address contractOwner , ) = DeployHandler.contractDitals(contract_);
        require(contractOwner == msg.sender, "!ContractOwner");

        (, uint _DateAndTime ,) = booking.getTime(contract_, _bookDateID[contract_][year_][month_][day_]);
        require (_DateAndTime < (block.timestamp.sub(_cancelBefore)), "Cant withdrew Amount Now");

        if ( _specialDayOwnerUSDT[contract_][year_][month_][day_] > 0 ) {
        
            uint USDT_ = _specialDayOwnerUSDT[contract_][year_][month_][day_];

            uint256 _ownerFee = USDT_.mul(ownerFee).div(100);
            uint256 _boatFee = USDT_.sub(_ownerFee);

            USDT.transfer( owner(), _ownerFee );
            USDT.transfer( contractOwner, _boatFee );

            _specialDayOwnerUSDT[contract_][year_][month_][day_] = 0;
            
        } else if ( _specialDayOwnerNFTilityToken[contract_][year_][month_][day_] > 0 ) {

            uint NNT_ = _specialDayOwnerNFTilityToken[contract_][year_][month_][day_];

            uint256 _ownerFee = NNT_.mul(ownerFee).div(100);
            uint256 _boatFee = NNT_.sub(_ownerFee);

            NFTilityToken.transfer( owner(), _ownerFee );
            NFTilityToken.transfer( contractOwner, _boatFee );

            _specialDayOwnerNFTilityToken[contract_][year_][month_][day_] = 0;

        } else {
            revert("!Amount");
        }
    
    }






    /*******************************************************
    *   offer logic (offer, cancelOffer, acceptOffer)
    *******************************************************/

    struct offer_ {
        uint id;
        uint userID;
        Tokens tName;
        uint Price;
        uint Time;
        uint offeredDate;
        address User;
        address Contract;
    }

    uint public _offerBefore; // user can't offer After (offerBefore)date
    uint public _acceptOfferBefore; // user can't acceptOffer After (acceptOfferBefore)date
    uint public _offerPrice = 300 * 10 ** 6; // user have to pay USDT for offer

    mapping(address => mapping(uint => uint)) public _indexOfuserAllOffers;
    mapping(address => mapping(uint => offer_)) public _offers;
    mapping(address => mapping(address => uint[])) private _userAllOffers;
    
    mapping(address => mapping(uint => bool)) public _offerdID;
    mapping(address => mapping(uint => bool)) public _acceptedOffers;

    event offered(uint token, address user);
    event offerAccepted(uint token, address user);

    // update function
    function updateOfferBefore(uint time_) public onlyOwner {
        _offerBefore = time_;
    }
    function updateAcceptOfferBefore(uint time_) public onlyOwner {
        _acceptOfferBefore = time_;
    }
    function updateOfferPrice(uint amount_) public onlyOwner {
        _offerPrice = amount_;
    }

    // view function
    function userAllOffers(address contract_, address user_) public view returns(uint[] memory) {
        return _userAllOffers[contract_][user_];
    }

    function offer(address contract_, uint id_, uint userID_, Tokens token_, uint256 value_ ) public {

        require(!_offerdID[contract_][id_], "offerdID");

        address _msgSender = _msgSender();

        MYIERC721 IContract = MYIERC721(contract_);

        require(IContract.balanceOf(_msgSender) > 0, "!Token");
        require(IContract.ownerOf(userID_) == _msgSender, "!Owner");

        require ( booking.isInserted(contract_, id_), "!Booked");

        (,uint _bookedTime,) = booking.getTime(contract_, id_);

        require ( (_bookedTime.sub(_offerBefore)) > block.timestamp, "Time Out");

        (uint year_, uint month_, uint day_) = DateTimeLibrary.timestampToDate(_bookedTime);

        if (token_ == Tokens.USDT) {
            
            if (_isSpecialDay[contract_][year_][month_][day_]) {
                require((_specialDayAmount[contract_][year_][month_][day_] + _offerPrice) <= value_, "SpecialDay");
                USDT.transferFrom( _msgSender, address(this), value_);
            } else {
                require ( _offerPrice <= value_, "!OfferPrice");
                USDT.transferFrom( _msgSender, address(this), value_);
            }

            _offers[contract_][id_] = 
                offer_(id_, userID_, token_, value_, (_bookedTime.sub(_acceptOfferBefore)),  _bookedTime, _msgSender, contract_);

        }

        if (token_ == Tokens.NFTilityToken) {

            if (_isSpecialDay[contract_][year_][month_][day_]) {

                uint _NNT = _specialDayAmount[contract_][year_][month_][day_] + _offerPrice;
                _NNT = ExchangeHandler.priceCalculatorUSDTtoNNT(_NNT);

                require(_NNT <= value_, "SpecialDay");
                NFTilityToken.transferFrom( _msgSender, address(this), value_);
            } else {
                require ( _offerPrice <= value_, "!OfferPrice");
                NFTilityToken.transferFrom( _msgSender, address(this), value_);
            }

            _offers[contract_][id_] = 
                offer_(id_, userID_, token_, value_, (_bookedTime.sub(_acceptOfferBefore)),  _bookedTime, _msgSender, contract_);

        }

        
        _indexOfuserAllOffers[contract_][id_] = _userAllOffers[contract_][_msgSender].length;
        _userAllOffers[contract_][_msgSender].push(id_);
        _offerdID[contract_][id_] = true;

        emit offered(id_, _msgSender);

    }

    function cancelOffer(address contract_, uint id_) public {

        require(_offerdID[contract_][id_],"!offerd");

        address _msgSender = _msgSender();
        require(_offers[contract_][id_].User == _msgSender, "!User");


        if (_offers[contract_][id_].tName == Tokens.USDT) {
            USDT.transfer( _msgSender, _offers[contract_][id_].Price );
        }
        if (_offers[contract_][id_].tName == Tokens.NFTilityToken) {
            NFTilityToken.transfer( _msgSender, _offers[contract_][id_].Price );
        }


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
        require ( _offers[contract_][id_].Time > block.timestamp, "Time Out");

        (, uint bookedTime_, uint newYear_) = booking.getTime(contract_, id_);
        booking.remove(contract_, id_);
        booking.set(
            contract_, _offers[contract_][id_].userID, 
            _offers[contract_][id_].User, block.timestamp, bookedTime_, newYear_);

        (uint year, uint month, uint day) = DateTimeLibrary.timestampToDate(bookedTime_);
        _bookDateID[contract_][year][month][day] = _offers[contract_][id_].userID;

        _acceptedOffers[contract_][id_] = true;

        uint256 _ownerFee = _offers[contract_][id_].Price.mul(ownerFee).div(100);
        uint256 _boatFee = _offers[contract_][id_].Price.sub(_ownerFee);


        if (_offers[contract_][id_].tName == Tokens.USDT) {
            USDT.transfer(owner(), _ownerFee);
            USDT.transfer(_msgSender(), _boatFee);
        }
        if (_offers[contract_][id_].tName == Tokens.NFTilityToken) {
            NFTilityToken.transfer(owner(), _ownerFee);
            NFTilityToken.transfer(_msgSender(), _boatFee);
        }


        delete _offerdID[contract_][id_];
        delete _offers[contract_][id_];

        emit offerAccepted(id_, _msgSender());

    }


    /*******************************************************
    *   view function from UserMapping library
    *******************************************************/

    function UserIDs(address _contract, address _user) public view returns (uint256[] memory) {
        return User.getTokens(_contract, _user);
    }
    function UserAllContractAddress(address _user) public view returns (address[] memory) {
        return User.getAllContractAddress(_user);
    }
    function AllUser() public view returns (address[] memory) {
        return User.getUser();
    }
    function userKeyAtIndex(uint _id) public view returns (address) {
        return User.getKeyAtIndex(_id);
    }
    function userArraySize() public view returns (uint) {
        return User.getSize();
    }
    function userArraySize(address _contract, address _user) public view returns (bool) {
        return User.isInserted(_contract, _user);
    }



    /*******************************************************
    *   view function from BookingMap library
    *******************************************************/

    function BookedUserIDs(address _Contract) public view returns (
        uint[] memory _userIds
        ) {
        (_userIds ,) = booking.getKeys(_Contract);
    }
    
    function BookedIsInserted(address _Contract, uint _id) public view returns ( bool ) {
        return booking.isInserted(_Contract, _id);
    }


    function BookedDate(address _Contract, uint _id) public view returns (
        uint bookingTime_, uint bookedTime_, uint newYear_ ) {

        (bookingTime_, bookedTime_, newYear_) = booking.getTime(_Contract, _id);
    }

}
