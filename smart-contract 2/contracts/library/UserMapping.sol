// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library UserMapping {

    struct Map {
        address[] user;
        mapping(address => uint[]   ) tokens;
        mapping(address => uint     ) indexOf;
        mapping(address => bool     ) inserted;
    }

    function getTokens(Map storage map, address key) internal view returns (uint[] memory) {
        return map.tokens[key];
    }

    function getUser(Map storage map) internal view returns (address[] memory) {
        return map.user;
    }

    function getKeyAtIndex(Map storage map, uint index) internal view returns (address) {
        return map.user[index];
    }

    function getSize(Map storage map) internal view returns (uint) {
        return map.user.length;
    }

    function inInserted(Map storage map, address key) internal view returns (bool) {
        return map.inserted[key];
    }

    function set(
        Map storage map,
        address key,
        uint tokensID
    ) internal {
        if (map.inserted[key]) {
            map.tokens[key].push(tokensID);
        } else {
            map.inserted[key] = true;
            map.tokens[key].push(tokensID);
            map.indexOf[key] = map.user.length;
            map.user.push(key);
        }
    }

    function remove(Map storage map, address key) internal {
        if (!map.inserted[key]) {
            return;
        }

        delete map.inserted[key];
        delete map.tokens[key];

        uint index = map.indexOf[key];
        uint lastIndex = map.user.length - 1;
        address lastKey = map.user[lastIndex];

        map.indexOf[lastKey] = index;
        delete map.indexOf[key];

        map.user[index] = lastKey;
        map.user.pop();
    }
    
}
