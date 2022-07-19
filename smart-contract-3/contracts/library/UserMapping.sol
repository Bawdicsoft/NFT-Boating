// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library UserMapping {

    struct Map {
        address[] user;
        mapping(address => address[]) Contract;
        mapping(address => mapping(address => uint[])) tokens;
        mapping(address => mapping(address => uint)) indexOf;
        mapping(address => mapping(address => bool)) inserted;

        // address[] user;
        // mapping(address => uint[]) tokens;
        // mapping(address => uint) indexOf;
        // mapping(address => bool) inserted;
    }

    function getTokens(Map storage map, address _contract, address key) internal view returns (uint[] memory) {
        return map.tokens[_contract][key];
    }

    function getAllContractAddress(Map storage map, address _user) internal view returns (address[] memory) {
        return map.Contract[_user];
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

    function inInserted(Map storage map, address _contract, address key) internal view returns (bool) {
        return map.inserted[_contract][key];
    }

    function set(
        Map storage map,
        address _contract,
        address key,
        uint tokensID
    ) internal {
        if (map.inserted[_contract][key]) {
            map.tokens[_contract][key].push(tokensID);
        } else {
            map.inserted[_contract][key] = true;
            map.tokens[_contract][key].push(tokensID);
            map.indexOf[_contract][key] = map.user.length;
            map.user.push(key);
        }
    }

    function remove(Map storage map, address _contract, address key) internal {
        if (!map.inserted[_contract][key]) {
            return;
        }

        delete map.inserted[_contract][key];
        delete map.tokens[_contract][key];

        uint index = map.indexOf[_contract][key];
        uint lastIndex = map.user.length - 1;
        address lastKey = map.user[lastIndex];

        map.indexOf[_contract][lastKey] = index;
        delete map.indexOf[_contract][key];

        map.user[index] = lastKey;
        map.user.pop();
    }
    
}
