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


  function addAddressesToWhitelist(address[] memory addrs) onlyOwner public {
    for (uint256 i = 0; i < addrs.length; i++) {
        if (!whitelist[addrs[i]]) {
            addAddressToWhitelist(addrs[i]);
            emit WhitelistedAddressAdded(addrs[i]);
        } else {
            emit AlreadyWhitelistedAddressAdded(addrs[i]);
        }
    }
  }


  function removeAddressFromWhitelist(address addr) onlyOwner public {
    require(whitelist[addr], "whitelist?");

    whitelist[addr] = false;
    emit WhitelistedAddressRemoved(addr);
  }


  function removeAddressesFromWhitelist(address[] memory addrs) onlyOwner public {
    for (uint256 i = 0; i < addrs.length; i++) {
        if (whitelist[addrs[i]]) {
            whitelist[addrs[i]] = false;
            emit WhitelistedAddressRemoved(addrs[i]);
        } else {
            emit AlreadyWhitelistedAddressRemoved(addrs[i]);
        }
    }
  }

}
