// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "./../library/BookingMap.sol";
import "./../library/UserMapping.sol";

abstract contract librariesViewFunction {

    using BookingMap for BookingMap.Map;
    using UserMapping for UserMapping.Map;

    BookingMap.Map private booking;
    UserMapping.Map private User;

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


    function BookedDate(address _Contract, uint _id) public view returns (
        uint bookingTime_, uint bookedTime_, uint newYear_ ) {

        (bookingTime_, bookedTime_, newYear_) = booking.getTime(_Contract, _id);
    }
}