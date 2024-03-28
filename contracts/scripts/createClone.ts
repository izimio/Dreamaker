import { ethers } from 'hardhat';

const FACTORY_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

async function main() {
    const [deployer] = await ethers.getSigners();
    const provider = new ethers.JsonRpcProvider('http://localhost:8545'); // Replace with your Ethereum network RPC endpoint
    const abi = [
        'deployClone(address,uint256, uint256) external returns (address)',
    ];
    const contract = new ethers.Contract(FACTORY_ADDRESS, abi, provider); // Replace 'functionName()' with the function you want to call

    // parse in wei 0.1 ETH
    const amount = ethers.parseEther('0.1');
    const res = await contract.deployClone(
        deployer,
        amount,
        Date.now() + 1000 * 60 * 60 * 24 * 30
    );

    console.log('Result:', res);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
