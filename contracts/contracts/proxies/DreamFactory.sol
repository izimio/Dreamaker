// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import '../DreamV1.sol';

contract DreamProxyFactory {
    address[] public proxies;
    address owner;
    address implementationContract;

    error Forbidden();

    constructor(address _owner, address _implementationContract) {
        owner = _owner;
        implementationContract = _implementationContract;
    }

    function deployClone(
        address _owner,
        uint256 _targetAmount,
        uint256 _deadlineTimestamp
    ) external returns (address) {
        if (msg.sender != owner) {
            revert Forbidden();
        }
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

            // create a new contract
            // send 0 Ether
            // code starts at the pointer stored in "clone"
            // code size == 0x37 (55 bytes)
            proxy := create(0, clone, 0x37)
        }

        // Call initialization
        DreamV1(payable(proxy)).initialize(
            _owner,
            _targetAmount,
            _deadlineTimestamp
        );
        proxies.push(proxy);
        return proxy;
    }
}
