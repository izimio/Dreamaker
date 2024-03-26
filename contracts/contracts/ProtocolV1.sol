// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./lib/ProtocoLib.sol";

contract ProtocolV1 is Ownable {

    event DreamCreated(
        address owner,
        uint256 targetAmount,
        uint256 deadlineTimestamp
    );
    event DreamFunded(address funder, uint256 amount);
    event DreamWithdrawn(address owner, uint256 amount);
    event DreamRefunded(address funder, uint256 amount);
    event DreamCanceled(address owner);
    event minFundingAmountChanged(uint256 minFundingAmount);

    error InvalidTargetAmount();
    error InvalidDeadlineTimestamp();
    error DreamFundingEnded();
    error DreamStillFunding();
    error BelowMinFundingAmount();
    error FundingNotOpenToOwner();
    error DreamDidNotReachTargetAmount();
    error NothingToRefund();
    error DreamWasCanceled();

    uint256 public targetAmount;
    uint256 public deadlineTimestamp;
    uint256 public minFundingAmount;
    bool public canceled;

    address[] public funders;

    mapping(address => uint256) public fundedAmount;

    /*
    @dev Constructor to initialize the contract with the target amount and deadline timestamp
    @param _owner The owner of the contract
    @param _targetAmount The target amount to be raised in wei
    @param _deadlineTimestamp The deadline timestamp in seconds
    */

    receive() external payable {
        fund();
    }

    constructor(
        address _owner,
        uint256 _targetAmount,
        uint256 _deadlineTimestamp
    ) Ownable(_owner) {
        if (_targetAmount == 0) {
            revert InvalidTargetAmount();
        }
        if (_deadlineTimestamp <= block.timestamp) {
            revert InvalidDeadlineTimestamp();
        }

        targetAmount = _targetAmount;
        deadlineTimestamp = _deadlineTimestamp;
    }

    /*
    @dev Modifier to check if the dream is still active, i.e., the deadline has not been passed
    */
    modifier onlyActiveDream() {
        if (block.timestamp > deadlineTimestamp) {
            revert DreamFundingEnded();
        }
        if(canceled) {
            revert DreamWasCanceled();
        }
        _;
    }

    modifier onlyEndedDream() {
        if (block.timestamp <= deadlineTimestamp) {
            revert DreamStillFunding();
        }
        if(canceled) {
            revert DreamWasCanceled();
        }
        _;
    }

    function isDreamFunded() public view returns (bool) {
        return address(this).balance >= targetAmount;
    }

    function isDreamEnded() public view returns (bool) {
        return block.timestamp > deadlineTimestamp;
    }

    function getAmount() public view returns (uint256) {
        return address(this).balance;
    }

    function setMinFundingAmount(uint256 _minFundingAmount) public onlyOwner {
        minFundingAmount = _minFundingAmount;
    }

    function withdraw() external onlyOwner onlyEndedDream {
        if (!isDreamFunded()) {
            revert DreamDidNotReachTargetAmount();
        }
        uint balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit DreamWithdrawn(owner(), balance);
    }

    function refund() external onlyEndedDream {
        if (fundedAmount[msg.sender] == 0 || isDreamFunded()) {
            revert NothingToRefund();
        }
        payable(msg.sender).transfer(fundedAmount[msg.sender]);
        fundedAmount[msg.sender] = 0;
        emit DreamRefunded(msg.sender, fundedAmount[msg.sender]);
    }

    function fund() public payable onlyActiveDream {
        if (msg.value < minFundingAmount) {
            revert BelowMinFundingAmount();
        }

        if (msg.sender == owner()) {
            revert FundingNotOpenToOwner();
        }

        fundedAmount[msg.sender] += msg.value;
        ProtocoLib.pushIfNotExist(funders, msg.sender);

        emit DreamFunded(msg.sender, msg.value);
    }

    function cancel() external onlyOwner {
        if (!isDreamEnded()) {
            revert DreamStillFunding();
        }
        for (uint256 i = 0; i < funders.length; i++) {
            address f = funders[i];
            payable(f).transfer(fundedAmount[f]);
            fundedAmount[f] = 0;
        }
        canceled = true;
        emit DreamCanceled(owner());
    }
}
