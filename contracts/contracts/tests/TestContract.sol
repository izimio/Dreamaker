// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TestContract {
    uint256 public value;

    function initialize(
        address _owner,
        uint256 _targetAmount,
        uint256 _deadlineTimestamp
    ) public {
        value = 0;
        _owner = address(0x0);
        _targetAmount = 0;
        _deadlineTimestamp = 0;
    }

    function setValue(uint256 _value) public {
        value = _value;
    }
}
