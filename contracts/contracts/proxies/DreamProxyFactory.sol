// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.0;

import { DreamV1 } from "../DreamV1.sol";

contract DreamProxyFactory {
    address[] public proxies;
    address public owner;
    address public implementationContract;

    event ProxyCreated(address proxy, address indexed dreamOwner);
    event ReceivedFees(address proxy, uint256 amount);
    error Forbidden();
    error AmountHigherThanBalance();

    /**
     * @dev Fallback function to receive ether and receive fees
     **/
    receive() external payable {
        emit ReceivedFees(msg.sender, msg.value);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Forbidden();
        }
        _;
    }

    /**
     * @dev Constructor to set the owner and the implementation contract
     * @param _implementationContract The address of the implementation contract
     * @notice The owner of the contract is the deployer
     * @notice The implementation contract is the contract that will be cloned
     **/
    constructor(address _implementationContract) {
        owner = msg.sender;
        implementationContract = _implementationContract;
    }

    /**
     * @dev Get the balance of the contract
     * @return The balance of the contract
     **/
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Withdraw the amount from the contract
     * @param amount The amount to withdraw
     * @param to The address to send the amount to
     **/
    function withdraw(uint256 amount, address to) external onlyOwner {
        if (amount > getBalance()) {
            revert AmountHigherThanBalance();
        }
        payable(to).transfer(amount);
    }

    /**
     * @dev Get the proxies
     * @return The array of proxies
     **/
    function getProxies() external view returns (address[] memory) {
        return proxies;
    }

    /**
     * @dev Set the implementation contract
     * @param _implementationContract The address of the new implementation contract
     **/
    function setImplementationContract(
        address _implementationContract
    ) external onlyOwner {
        implementationContract = _implementationContract;
    }

    /**
     * @dev Deploy a clone of the implementation contract
     * @param _owner The owner of the dream
     * @param _targetAmount The target amount of the dream
     * @param _deadlineTimestamp The deadline timestamp of the dream
     **/
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
