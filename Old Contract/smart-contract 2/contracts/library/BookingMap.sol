// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

library BookingMap {

    struct Map {
        uint[] keys;
        mapping(uint => address) owner;
        mapping(uint => uint) blockTimestamp;
        mapping(uint => uint) DateAndTime;
        mapping(uint => uint) newYear;
        mapping(uint => uint) indexOf;
        mapping(uint => bool) inserted;
    }

    function getKeys(Map storage map) internal view returns (uint[] memory) {
        return map.keys;
    }

    function getOwner(Map storage map, uint _key) internal view returns (address) {
        return map.owner[_key];
    }

    function getKeyAtIndex(Map storage map, uint _index) internal view returns (uint) {
        return map.keys[_index];
    }

    function getsize(Map storage map) internal view returns (uint) {
        return map.keys.length;
    }

    function isInserted(Map storage map, uint _key) internal view returns (bool) {
        return map.inserted[_key];
    }

    function getTime(Map storage map, uint _key) internal view returns (
        uint _blockTimestamp, uint _DateAndTime, uint _newYear
    ) {
        _blockTimestamp = map.blockTimestamp[_key];
        _DateAndTime = map.DateAndTime[_key];
        _newYear = map.newYear[_key];
    }

    function set(
        Map storage map,
        uint _key,
        address _owner,
        uint _blockTimestamp,
        uint _DateAndTime,
        uint _newYear
    ) internal {
        if (!map.inserted[_key]) {
            map.inserted[_key] = true;
            map.indexOf[_key] = map.keys.length;
            map.keys.push(_key);

            map.owner[_key] = _owner;
            map.blockTimestamp[_key] = _blockTimestamp;
            map.DateAndTime[_key] = _DateAndTime;
            map.newYear[_key] = _newYear;
        }
    }

    function remove(Map storage map, uint _key) internal {
        if (!map.inserted[_key]) {
            return;
        }

        delete map.inserted[_key];
        delete map.owner[_key];
        delete map.blockTimestamp[_key];
        delete map.DateAndTime[_key];
        delete map.newYear[_key];

        uint index = map.indexOf[_key];
        uint lastIndex = map.keys.length - 1;
        uint lastKey = map.keys[lastIndex];

        map.indexOf[lastKey] = index;
        delete map.indexOf[_key];

        map.keys[index] = lastKey;
        map.keys.pop();
    }
}
