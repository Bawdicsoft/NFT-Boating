// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Ownable.sol";


abstract contract Whitelist is Ownable {

  mapping(address => bool) public whitelist;
  
  event WhitelistedAddressAdded(address addr);
  event AlreadyWhitelistedAddressAdded(address addr);
  event WhitelistedAddressRemoved(address addr);
  event AlreadyWhitelistedAddressRemoved(address addr);


  modifier onlyWhitelisted() {
    require(whitelist[msg.sender], "onlyWhitelisted");
    _;
  }


  function addAddressToWhitelist(address addr) onlyOwner public {
    require(!whitelist[addr], "!whitelist");

    whitelist[addr] = true;
    emit WhitelistedAddressAdded(addr);
  }


  function removeAddressFromWhitelist(address addr) onlyOwner public {
    require(whitelist[addr], "whitelist?");

    whitelist[addr] = false;
    emit WhitelistedAddressRemoved(addr);
  }

  function removeWhitelist(address addr) internal {
    whitelist[addr] = false;
    emit WhitelistedAddressRemoved(addr);
  }

}
