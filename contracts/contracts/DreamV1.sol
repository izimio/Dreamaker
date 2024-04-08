// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./lib/ProtocoLib.sol";

contract DreamV1 {

    event DreamFunded(address funder, uint256 amount);
    event DreamRefunded(address funder, uint256 amount);
    event MinFundingAmountChanged(uint256 minFundingAmount);

    error InvalidTargetAmount();
    error InvalidDeadlineTimestamp();
    error DreamFundingEnded();
    error DreamStillFunding();
    error FundingNotOpenToowner();
    error BelowMinFundingAmount();
    error DreamDidNotReachTargetAmount();
    error NothingToRefund();
    error Forbidden();

    uint256 public targetAmount;
    uint256 public deadlineTimestamp;
    uint256 public minFundingAmount;
    bool public isInitialized;
    address public owner;
    address public admin;
    address[] public funders;

    mapping(address => uint256) public fundedAmount;

    receive() external payable {
        fund();
    }

    /**
     * @dev Initializator the contract with the target amount and deadline timestamp
     * @param _owner The owner of the contract
     * @param _targetAmount The target amount to be raised in wei
     * @param _deadlineTimestamp The deadline timestamp in seconds
     **/
    function initialize(
        address _owner,
        uint256 _targetAmount,
        uint256 _deadlineTimestamp
    ) public {
        if (isInitialized) {
            revert Forbidden();
        }
        if (_owner == msg.sender) {
            revert Forbidden();
        }
        if (_targetAmount == 0) {
            revert InvalidTargetAmount();
        }
        if (_deadlineTimestamp <= block.timestamp) {
            revert InvalidDeadlineTimestamp();
        }
        admin = msg.sender;
        owner = _owner;
        targetAmount = _targetAmount;
        deadlineTimestamp = _deadlineTimestamp;
        minFundingAmount = 1 wei;
        isInitialized = true;
    }

    /**
     * @dev Modifier to check if the caller is the owner of the contract
     **/
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Forbidden();
        }
        _;
    }
    /**
     * @dev Modifier to check if the dream is still active, i.e., the deadline has not been passed
     **/
    modifier onlyActiveDream() {
        if (block.timestamp > deadlineTimestamp) {
            revert DreamFundingEnded();
        }
        _;
    }

    /**
     * @dev Modifier to check if the dream has ended, i.e., the deadline has been passed
     **/
    modifier onlyEndedDream() {
        if (block.timestamp <= deadlineTimestamp) {
            revert DreamStillFunding();
        }
        _;
    }

    /**
     * @dev Function to retrieve the amount funded by a specific funder
     * @param funder The address of the funder
     * @return uint256 The amount funded by the funder
     **/
    function getFundedAmount(address funder) public view returns (uint256) {
        return fundedAmount[funder];
    }

    /**
     * @dev Function to retrieve all the funders
     * @return address[] Returns an array of all funders
     **/
    function getFunders() public view returns (address[] memory) {
        return funders;
    }

    /**
     * @dev Function to retrieve all the funders and the amount funded
     * @return address[] Returns an array of all funders
     * @return uint256[] Returns an array of the amount funded by each funder
     **/
    function getFundersAndAmounts() public view returns (address[] memory, uint256[] memory) {
        uint256[] memory amounts = new uint256[](funders.length);
        for (uint256 i = 0; i < funders.length; i++) {
            amounts[i] = fundedAmount[funders[i]];
        }
        return (funders, amounts);
    }

    /**
     * @dev Function to check if the dream has reached the target amount
     * @return bool Returns true if the dream has reached the target amount
     **/
    function isDreamFunded() public view returns (bool) {
        return address(this).balance >= targetAmount;
    }

    /**
     * @dev Function to check if the dream has ended
     * @return bool Returns true if the dream has ended
     **/

    function isDreamEnded() public view returns (bool) {
        return block.timestamp > deadlineTimestamp;
    }

    /**
     * @dev Function to get the total amount raised
     * @return uint256 Returns the total amount raised
     **/

    function getAmount() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Function to change the minimum funding threshold
     **/

    function setMinFundingAmount(uint256 _minFundingAmount) public onlyOwner {
        minFundingAmount = _minFundingAmount;
        emit MinFundingAmountChanged(minFundingAmount);
    }

    function _payAdmin() internal returns (uint256) {
        uint256 fee = ProtocoLib.calculateFeePercentage(
            address(this).balance,
            targetAmount
        );
        payable(admin).transfer(fee);

        return fee;
    }
    /**
     * @dev Function to withdraw the funds raised, only available to the owner of the
     * contract and after the dream has ended and the target amount has been reached
     **/
    function withdraw() external onlyOwner onlyEndedDream {
        if (!isDreamFunded()) {
            revert DreamDidNotReachTargetAmount();
        }
        _payAdmin();
        uint256 balance = address(this).balance;

        payable(owner).transfer(balance);
    }

    /**
     * @dev Function to refund the funds to the funders, only available
     * after the dream has ended and the target amount has not been reached
     **/
    function refund() external onlyEndedDream {
        if (fundedAmount[msg.sender] == 0 || isDreamFunded()) {
            revert NothingToRefund();
        }
        uint256 amount = fundedAmount[msg.sender];

        fundedAmount[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit DreamRefunded(msg.sender, amount);
    }

    /**
     * @dev Function to fund the dream, only available if the dream is still active
     **/
    function fund() public payable onlyActiveDream {
        if (msg.value < minFundingAmount) {
            revert BelowMinFundingAmount();
        }

        if (msg.sender == owner) {
            revert FundingNotOpenToowner();
        }

        fundedAmount[msg.sender] += msg.value;
        ProtocoLib.pushIfNotExist(funders, msg.sender);

        emit DreamFunded(msg.sender, msg.value);
    }
}
