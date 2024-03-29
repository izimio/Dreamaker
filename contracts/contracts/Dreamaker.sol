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

    error InvalidInput();

    /**
     * @dev Mint the amount of tokens to the address
     * @param to The address to mint the tokens to
     * @param amount The amount of tokens to mint
     **/
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Offer the amount of tokens to the addresses
     * @param to The addresses to mint the tokens to
     * @param amount The amount of tokens to mint
     **/
    function offer(
        address[] memory to,
        uint256[] memory amount
    ) public onlyOwner {
        if (to.length == 0 || amount.length == 0) {
            revert InvalidInput();
        }

        for (uint256 i = 0; i < to.length; i++) {
            mint(to[i], amount[i]);
        }
    }
}
