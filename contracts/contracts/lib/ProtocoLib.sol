// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


library ProtocoLib {
    
    function isInArray(address[] memory array, address element) internal pure returns (bool) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == element) {
                return true;
            }
        }
        return false;
    }

    function pushIfNotExist(address[] storage array, address element) internal {
        if (!isInArray(array, element)) {
            array.push(element);
        }
    }
}