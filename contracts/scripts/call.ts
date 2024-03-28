// scripts/call.js
import { ethers } from "hardhat";

async function main() {
    const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Replace with your contract address
    const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Replace with your Ethereum network RPC endpoint
    const abi = ["function balanceOf(address) external view returns (uint256)"];
    const contract = new ethers.Contract(contractAddress, abi, provider); // Replace 'functionName()' with the function you want to call

    const res = await contract.balanceOf(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );

    console.log("Result:", res);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
