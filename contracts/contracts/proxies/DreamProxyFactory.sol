// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.0;

import { DreamV1 } from "../DreamV1.sol";

contract DreamProxyFactory {
    address[] public proxies;
    address public owner;
    address public implementationContract;

    event ProxyCreated(address proxy, address indexed dreamOwner);

    error Forbidden();
    error AmountHigherThanBalance();

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Forbidden();
        }
        _;
    }

    constructor(address _implementationContract) {
        owner = msg.sender;
        implementationContract = _implementationContract;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw(uint256 amount, address to) external onlyOwner {
        if (amount > getBalance()) {
            revert AmountHigherThanBalance();
        }
        payable(to).transfer(amount);
    }

    function getProxies() external view onlyOwner returns (address[] memory) {
        return proxies;
    }

    function setImplementationContract(
        address _implementationContract
    ) external onlyOwner {
        implementationContract = _implementationContract;
    }

    function deployClone(
        address _owner,
        uint256 _targetAmount,
        uint256 _deadlineTimestamp
    ) external onlyOwner {
        bytes20 implementationContractInBytes = bytes20(implementationContract);
        address proxy;

        assembly {
            let clone := mload(0x40)
            mstore(
                clone,
                0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000
            )

            mstore(add(clone, 0x14), implementationContractInBytes)

            mstore(
                add(clone, 0x28),
                0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000
            )
            proxy := create(0, clone, 0x37)
        }

        DreamV1(payable(proxy)).initialize(
            _owner,
            _targetAmount,
            _deadlineTimestamp
        );
        proxies.push(proxy);
        emit ProxyCreated(proxy, _owner);
    }
}
