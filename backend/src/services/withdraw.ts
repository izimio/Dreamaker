import { ethers } from "ethers"
import { DreamModel, DreamStatus } from "../models/dreamModel"
import { ABIs, signer } from "../utils/EProviders"
import { BusinessError, InternalError, ObjectNotFoundError } from "../utils/error"
import { DREAM_PROXY_FACTORY_ADDRESS } from "../utils/config"

const ProxyFactory = new ethers.Contract(DREAM_PROXY_FACTORY_ADDRESS, ABIs.ProxyFactory, signer)

export const getBalance = async () => {

    let balance: ethers.BigNumberish
    try {
        balance = await ProxyFactory.getBalance()
    } catch (e: any) {
        throw new InternalError("Error getting balance", e)
    }

    return ethers.formatEther(balance)
}

export const withdraw = async (amount: string = "", to: string) => {


    let contract: ethers.Contract
    try {
        contract = new ethers.Contract(DREAM_PROXY_FACTORY_ADDRESS, ABIs.ProxyFactory, signer)
    } catch (e: any) {
        throw new InternalError("Error creating contract instance", e)
    }

    let balance: bigint
    try {
        balance = await contract.getBalance()
    } catch (e: any) {
        throw new InternalError("Error getting balance", e)
    }

    if (amount && (balance < ethers.parseUnits(amount, "wei"))) {
        throw new BusinessError("Insufficient balance in proxy contract")
    }
    const rAmount = amount ? ethers.parseUnits(amount, "wei") : balance;

    try {
        const tx = await contract.withdraw(rAmount, to)
        await tx.wait();
    } catch (e: any) {
        throw new InternalError("Withdraw failed", e)
    }

    return {
        status: "success",
        amount: ethers.formatEther(rAmount)
    }

}