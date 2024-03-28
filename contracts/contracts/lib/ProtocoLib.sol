// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";
library ProtocoLib {
    /**
     * @dev Checks if an element exists in an array
     * @param array The array to search in
     * @param element The element to search for
     * @return Whether the element exists in the array
     **/
    function isInArray(
        address[] memory array,
        address element
    ) internal pure returns (bool) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == element) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Pushes an element to an array if it does not exist in the array yet
     * @param array The array to push the element to
     * @param element The element to push to the array
     **/
    function pushIfNotExist(address[] storage array, address element) internal {
        if (!isInArray(array, element)) {
            array.push(element);
        }
    }

    /**
     * @dev Calculates the fee percentage based on the amount and the target amount (1% of target amount + 2% of extra)
     * @param amount The amount to calculate the fee for
     * @param targetAmount The target amount
     * @return The fee percentage
     **/
    function calculateFeePercentage(
        uint256 amount,
        uint256 targetAmount
    ) internal pure returns (uint256) {
        uint256 extra = amount - targetAmount;
        uint256 baseFee = targetAmount / uint(100); // 2% of target amount
        uint256 extraFee = extra / uint(50); // 1% of extra

        return baseFee + extraFee;
    }
}
