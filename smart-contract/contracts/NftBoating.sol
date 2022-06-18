// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract NftBoating is ERC721 {

    // VARIABLES
    address public owner;
    IERC20 public USDT;
    uint256 public rate;
    uint public TokenID;

    constructor(address _USDT) ERC721("MyToken", "MTK") {
        owner = msg.sender;
        rate = 1;
        USDT = IERC20(_USDT);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not an owner");
        _;
    }

    function setRate(uint256 _rate) public onlyOwner {
        rate = _rate;
    }

    struct _userDetails {
        string  _name;
        string  _email;
        string  _phone;
        string  _dob;
    }

    mapping(uint => _userDetails) public userDetails;
    
    function buyToken(
        string memory _name,
        string memory _email,
        string memory _phone,
        string memory _dob,
        uint256 _USDT
    ) public {


        require ( 
            USDT.balanceOf(msg.sender) >= _USDT, 
            "No balance"
        );

        require ( 
            USDT.allowance( msg.sender,  address(this)) >= _USDT, 
            "No allownace"
        );

        require ( 
            rate == _USDT, 
            "Not suffecient USDT"
        );

        console.log("kuch bhi", owner, _USDT);
        USDT.transferFrom( msg.sender, owner, _USDT );

        TokenID++;

        userDetails[TokenID] = _userDetails(
            _name,
            _email,
            _phone,
            _dob
        );
        _safeMint(msg.sender, TokenID);

    }

}