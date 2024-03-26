// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract Dreamaker is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    constructor(
        address initialOwner
    ) ERC20("Dreamaker", "DMK") Ownable(initialOwner) ERC20Permit("MyToken") {
        _mint(initialOwner, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function offer(
        address[] memory to,
        uint256[] memory amount
    ) public onlyOwner {
        require(to.length == amount.length, "Dreamaker: Invalid input length");

        for (uint256 i = 0; i < to.length; i++) {
            mint(to[i], amount[i]);
        }
    }
}
