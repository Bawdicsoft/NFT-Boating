// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./../Contracts/Ownable.sol";



contract Boating is ERC721, Pausable, Ownable {

    using Strings for uint256;


    /***********************************************
    *   variables
    ***********************************************/

    string public baseURI;
    string public baseExtension = ".json";


    /*******************************************************************
    *   constructor logic for deploy smart contract from factory
    ********************************************************************/

    constructor(

        string memory name_, string memory symbol_,
        address factoryAddress_, string memory baseURI_
        
        ) ERC721(name_, symbol_) Ownable(factoryAddress_) {

        baseURI = baseURI_;
    
    }


    /***********************************************
    *   _baseURI & tokenURI logic
    ***********************************************/

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");

        return bytes(baseURI).length > 0 ? string(abi.encodePacked(_baseURI(), tokenId.toString(), baseExtension)) : "";
    }


    /***********************************************
    *   update baseURI & baseExtension logic
    ***********************************************/

    function updateBaseURI(string memory symbol_) public onlyOwner {
        baseURI = symbol_;
    }

    function updateBaseExtension(string memory baseExtension_) public onlyOwner {
        baseExtension = baseExtension_;
    }


    /***********************************************
    *   pause & unpause logic
    ***********************************************/

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }


    /***********************************************
    *   safeMint logic for factory
    ***********************************************/

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

}
