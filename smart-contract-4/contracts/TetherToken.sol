// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TetherToken is ERC20 {
    constructor() ERC20("TetherToken", "USDT") {
        _mint(msg.sender, 20000000000 * 10 ** decimals());
    }

    function mint(uint amout_) public {
        _mint(msg.sender, amout_ * 10 ** decimals());
    }
}