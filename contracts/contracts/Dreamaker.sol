// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract Dreamaker is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    constructor(
        address initialOwner,
        uint256 initialSupply
    ) ERC20("Dreamaker", "DMK") Ownable(initialOwner) ERC20Permit("MyToken") {
        _mint(initialOwner, initialSupply * 10 ** decimals());
    }

    event DreamBoosted(address from, address proxy, uint256 amount);

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
            _mint(to[i], amount[i]);
        }
    }

    /**
     * @dev Burn the amount of tokens from the address to boost the specified dream
     * @param _dream The dream to boost
     * @param _amount The amount of tokens to burn
     **/
    function boost(address _dream, uint256 _amount) public {
        if (_amount == 0) {
            revert InvalidInput();
        }
        if (_amount > balanceOf(msg.sender)) {
            revert ERC20InsufficientBalance(
                msg.sender,
                _amount,
                balanceOf(msg.sender)
            );
        }

        _burn(msg.sender, _amount);
        emit DreamBoosted(msg.sender, _dream, _amount);
    }
}
