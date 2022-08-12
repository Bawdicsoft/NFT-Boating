// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

library BookingMap {

    struct Map {
        address[] _contract;
        mapping(address => uint[]) id;
        mapping(address => mapping(uint => address)) owner;
        mapping(address => mapping(uint => uint)) bookingTime;
        mapping(address => mapping(uint => uint)) bookedTime;
        mapping(address => mapping(uint => uint)) newYear;
        mapping(address => mapping(uint => uint)) indexOf;
        mapping(address => mapping(uint => bool)) inserted;

        // uint[] id;
        // mapping(uint => address) owner;
        // mapping(uint => uint) bookingTime;
        // mapping(uint => uint) bookedTime;
        // mapping(uint => uint) newYear;
        // mapping(uint => uint) indexOf;
        // mapping(uint => bool) inserted;
    }

    function getKeys(Map storage map, address _Contract) internal view returns (uint[] memory) {
        return map.id[_Contract];
    }

    function getOwner(Map storage map, address _Contract, uint _id) internal view returns (address) {
        return map.owner[_Contract][_id];
    }

    function getKeyAtIndex(Map storage map, address _Contract, uint _index) internal view returns (uint) {
        return map.id[_Contract][_index];
    }

    function getsize(Map storage map, address _Contract) internal view returns (uint) {
        return map.id[_Contract].length;
    }

    function isInserted(Map storage map, address _Contract, uint _id) internal view returns (bool) {
        return map.inserted[_Contract][_id];
    }

    function getTime(Map storage map, address _Contract, uint _id) internal view returns (
        uint _bookingTime, uint _bookedTime, uint _newYear
    ) {
        _bookingTime = map.bookingTime[_Contract][_id];
        _bookedTime = map.bookedTime[_Contract][_id];
        _newYear = map.newYear[_Contract][_id];
    }

    function set(
        Map storage map,
        address _Contract,
        uint _id,
        address _owner,
        uint _bookingTime,
        uint _bookedTime,
        uint _newYear
    ) internal {
        if (!map.inserted[_Contract][_id]) {
            map.inserted[_Contract][_id] = true;
            map.indexOf[_Contract][_id] = map.id[_Contract].length;
            map.id[_Contract].push(_id);

            map.owner[_Contract][_id] = _owner;
            map.bookingTime[_Contract][_id] = _bookingTime;
            map.bookedTime[_Contract][_id] = _bookedTime;
            map.newYear[_Contract][_id] = _newYear;
        }
    }

        
    function remove(Map storage map, address _Contract, uint _id) internal {
        if (!map.inserted[_Contract][_id]) {
            return;
        }

        delete map.inserted[_Contract][_id];
        delete map.owner[_Contract][_id];
        delete map.bookingTime[_Contract][_id];
        delete map.bookedTime[_Contract][_id];
        delete map.newYear[_Contract][_id];

        uint index = map.indexOf[_Contract][_id];
        uint lastIndex = map.id[_Contract].length - 1;
        uint lastKey = map.id[_Contract][lastIndex];

        map.indexOf[_Contract][lastKey] = index;
        delete map.indexOf[_Contract][_id];

        map.id[_Contract][index] = lastKey;
        map.id[_Contract].pop();
    }
}
