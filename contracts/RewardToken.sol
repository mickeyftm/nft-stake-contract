// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    constructor() ERC20("Reward Token", "RT") {
    }

    function mint(address to, uint256 mintAmount) public onlyOwner {
        _mint(to, mintAmount);
    }
}