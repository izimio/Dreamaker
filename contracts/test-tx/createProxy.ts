import { ethers } from "hardhat";

const DREAM_SINGLETON = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
const DREAM_PROXY_FACTORY = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"

// DREAM_SINGLETON_ADDRESS=0xD4241407C264d308cad6fA82DeF834001F0FCE1F
// DREAM_PROXY_FACTORY_ADDRESS=0x41361AfD017fC3f7f6bBDaBc8279CF4df1961435
// DREAMAKER_ADDRESS=0x5A3e7e51Ac0Ecc59EA78014673F53049411247D6

async function main() {
    const [deployer] = await ethers.getSigners();

    const owner = ethers.Wallet.createRandom()
    const targetAmount = ethers.parseEther(Math.floor(Math.random() * 100).toString())
    const deadlineTime = Math.floor((Date.now() / 1000 )+ (Math.random() * 1000 * 60 * 60 * 24))

    console.log({
        owner: owner.address,
        targetAmount: targetAmount.toString(),
        deadlineTime: deadlineTime,
    });

    const dreamV1 = await ethers.getContractAt("DreamV1", DREAM_SINGLETON);
    const dreamProxyFactory = await ethers.getContractAt("DreamProxyFactory", DREAM_PROXY_FACTORY);

    // deploy Proxy
    const tx = await dreamProxyFactory.deployClone(owner.address, targetAmount, deadlineTime)
    const receipt = await tx.wait()

    console.log(`Proxy deployed at ${receipt!.logs[0].address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
