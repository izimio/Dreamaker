import { ethers } from "hardhat";

import { DREAM_SINGLETON_ADDRESS, DREAM_PROXY_FACTORY_ADDRESS } from "./utils";

async function main() {
    const [deployer] = await ethers.getSigners();

    const owner = ethers.Wallet.createRandom()
    const targetAmount = ethers.parseEther(Math.floor((Math.random() * 100) + 500).toString())
    const deadlineTime = Math.floor((Date.now() / 1000 )+ (Math.random() * 1000 * 60 * 60 * 24))

    const dreamV1 = await ethers.getContractAt("DreamV1", DREAM_SINGLETON_ADDRESS);
    const dreamProxyFactory = await ethers.getContractAt("DreamProxyFactory", DREAM_PROXY_FACTORY_ADDRESS);

    // deploy Proxy
    const tx = await dreamProxyFactory.deployClone(owner.address, targetAmount, deadlineTime)
    const receipt = await tx.wait()

    const [proxyAddress, ownerr] = dreamProxyFactory.interface.decodeEventLog("ProxyCreated(address,address)", receipt!.logs[0].data);

    const proxy = await ethers.getContractAt("DreamV1", proxyAddress);

    const txx = await proxy.fund({
        value: ethers.parseEther("1")
    })
    const receiptt = await txx.wait()

    const vars = proxy.interface.decodeEventLog("DreamFunded(address,uint256)", receiptt!.logs[0].data);
    console.log(vars)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
