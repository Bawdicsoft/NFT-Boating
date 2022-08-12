// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    
    constructor(address ownerAddress_) {
        _owner = ownerAddress_;
        emit OwnershipTransferred(address(0), ownerAddress_);
    }

    
    function owner() public view virtual returns (address) {
        return _owner;
    }

    
    modifier onlyOwner() {
        require(owner() == _msgSender(), "!owner");
        _;
    }
    
    function _transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "!zero address");
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
