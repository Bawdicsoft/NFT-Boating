// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./NFTYacht.sol";


contract Factory {

    event deploy_(address _Contract);

    address[] private allContractAddress;
    mapping (address => address[]) private userAllContractAddress;

    function getAllContractAddress() public view returns(address[] memory) {
        return allContractAddress;
    }

    function getUserAllContractAddress(address user_) public view returns(address[] memory) {
        return userAllContractAddress[user_];
    }

    function deploy(
        string memory name_, string memory symbol_, uint totalSupply_,
        uint price_, address ownerAddress_, string memory baseURI_
    ) public {
        
        address _Contract = address(new NFTYacht{salt: keccak256(abi.encode(name_, symbol_, price_, ownerAddress_))}
                (name_, symbol_, totalSupply_, price_, ownerAddress_, baseURI_));

        allContractAddress.push(_Contract);
        userAllContractAddress[ownerAddress_].push(_Contract);
        emit deploy_(_Contract);

    }

    // function _deploy(
    //     string memory name_, string memory symbol_, uint totalSupply_,
    //     uint price_, address ownerAddress_, string memory baseURI_
    // ) internal returns (address) {
        
    //     return address(new NFTYacht{salt: keccak256(abi.encode(name_, symbol_, price_, ownerAddress_))}
    //             (name_, symbol_, totalSupply_, price_, ownerAddress_, baseURI_));

    // }

}
