import { DreamModel, DreamStatus } from "../models/dreamModel"

export const getWithdrawList = async () => {
    
    const dreams = await DreamModel.find({
        status: DreamStatus.REACHED
    }).lean()

    return dreams
    
}