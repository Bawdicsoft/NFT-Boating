//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";



contract NFTYacht is ERC721, Ownable {

    using SafeMath for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private OwnershipID;

    // VARIABLES
    IERC20 private USDT;
    uint256 private rate;


    // mapping(uint => _userBookingDetails) private userBlockTimestamp;

    mapping(uint => string) private TURI;
    mapping(address => uint[]) private userOwnershipIDs;
    mapping(uint => bool) private userBookedID;


    constructor(address _USDT) ERC721("Yacht", "Y") {
        rate = 1 ether;
        USDT = IERC20(_USDT);
    }

    function setRate(uint256 _rate) public onlyOwner {
        rate = _rate;
    }

    function getRate() public view returns(uint256) {
        return rate;
    }

    function getUserOwnedIDs(address user) public view returns (uint256[] memory) {
        return userOwnershipIDs[user];
    }

    function isUserBookedID(uint256 id) public view returns (bool) {
        return userBookedID[id];
    }

    // function getUserBookingDetails(uint256 id) public view returns (

    //     uint bookingTime, string memory date, string memory time, string memory place 

    //     ) {
            
    //     return (
    //         userBookingDetails[id].bookingTime, userBookingDetails[id].date, 
    //         userBookingDetails[id].time, userBookingDetails[id].place
    //     );

    // }


    
    function buyOwnership(

        uint256 _tOwnership,
        uint256 _USDT,
        string memory _tURI

        ) public {

        require ( USDT.balanceOf(msg.sender) >= _USDT, "!Balance");
        require ( USDT.allowance( msg.sender,  address(this)) >= _USDT, "!Allownace");
        require ( (rate.mul(_tOwnership)) == _USDT, "!Not suffecient USDT");

        USDT.transferFrom( msg.sender, owner(), _USDT );

        for (uint256 i = 0; i < _tOwnership; i++) {
            OwnershipID.increment();
            userOwnershipIDs[_msgSender()].push(OwnershipID.current());
            _safeMint(msg.sender, OwnershipID.current());
            TURI[OwnershipID.current()] = _tURI;
        }

    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TURI[tokenId];
    }

    // function booking(

    //     string memory _date,
    //     string memory _time,
    //     string memory _place,
    //     uint _id

    //     ) public {

    //     require(!userBookedID[_id], "!Booked");
    //     require(userDetails[_id].user == _msgSender(), "!Owner");

    //     userBookingDetails[_id] = _userBookingDetails(
    //         block.timestamp, _date, _time, _place
    //     );
    //     userBookedID[_id] = true;

    // }

}
