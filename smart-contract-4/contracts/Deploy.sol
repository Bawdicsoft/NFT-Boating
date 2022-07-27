//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Contracts/Whitelist.sol";
import "./DeployHandler/Boating.sol";
import "./Contracts/Ownable.sol";


contract Deploy is Ownable, Whitelist {


    struct contractDitals_ {
        uint id;
        string name;
        string symbol;
        uint tSupply;
        uint tOwnership;
        uint price;
        address owner;
        string baseURI;
    }

    uint decimals;
    address public factory;
    uint public _contractCounter;
    address[] internal _allContractAddress;
    mapping (address => contractDitals_) internal _contractDitals;
    mapping (address => address[]) internal _userAllContractAddress;

    event deploy_(address _Contract, uint id);
    event factoryAddressChanged_(address oldAddress_, address newAddress_);

    constructor() Ownable(msg.sender) {
        decimals = 6;
        factory = address(0);
    }


    modifier onlyFactory() {
        require(factory == msg.sender, "!owner");
        _;
    }
    modifier onlyContractOwner(address contract_) {
        require(_contractDitals[contract_].owner == msg.sender, "!owner");
        _;
    }



    function allContractAddress() public view returns(address[] memory) {
        return _allContractAddress;
    }

    function userAllContractAddress(address user_) public view returns(address[] memory) {
        return _userAllContractAddress[user_];
    }

    function contractDitals(address contract_) public view returns(
        uint id, string memory name, string memory symbol, uint tSupply, 
        uint tOwnership, uint price, address owner, string memory baseURI
    ) {
        id = _contractDitals[contract_].id;
        name = _contractDitals[contract_].name;
        symbol = _contractDitals[contract_].symbol;
        tSupply = _contractDitals[contract_].tSupply;
        tOwnership = _contractDitals[contract_].tOwnership;
        price = _contractDitals[contract_].price;
        owner = _contractDitals[contract_].owner;
        baseURI = _contractDitals[contract_].baseURI;
    }





    function updateFactoryAddress(address factory_) public onlyOwner {
        factory = factory_;
        emit factoryAddressChanged_(factory, factory_);
    }
    function updateTotalOwnership(address contract_, uint number_) public onlyFactory returns(bool) {
        _contractDitals[contract_].tOwnership += number_;
        return true;
    }
    function updatePrice(address contract_, uint price_) public onlyContractOwner(contract_) {
        _contractDitals[contract_].price = price_;
    }
    function updateBaseURI(address contract_, string memory baseURI_) public onlyContractOwner(contract_) {
        _contractDitals[contract_].baseURI = baseURI_;
    }





    function deploy(

        string memory name_, string memory symbol_, uint totalSupply_,
        uint price_, address ownerAddress_, string memory baseURI_

        ) public onlyWhitelisted {
        
        _contractCounter++;

        address _Contract = address(new Boating{salt: keccak256(
            abi.encode(_userAllContractAddress[ownerAddress_].length, _contractCounter, ownerAddress_)
            )} (name_, symbol_, factory, baseURI_));


        _contractDitals[_Contract] = contractDitals_(
            _contractCounter, name_, symbol_, totalSupply_, 0,
            (price_ * 10 ** decimals), ownerAddress_, baseURI_
        );

        _allContractAddress.push(_Contract);
        _userAllContractAddress[ownerAddress_].push(_Contract);
        emit deploy_(_Contract, _contractCounter);

    }
}