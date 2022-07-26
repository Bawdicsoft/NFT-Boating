// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


interface IDeploy {
    
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function allContractAddress() external view returns(address[] memory);

    function userAllContractAddress(address user_) external view returns(address[] memory);

    function contractDitals(address contract_) external view returns(
        uint id, string memory name, string memory symbol, uint tSupply, 
        uint tOwnership, uint price, address owner, string memory baseURI
    );

    function updateTotalOwnership(address contract_, uint number_) external returns(bool);

    function deploy(

        string memory name_, string memory symbol_, uint totalSupply_,
        uint price_, address ownerAddress_, string memory baseURI_

    ) external view returns (uint256);

}
