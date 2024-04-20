import axios from "axios"

const URL = "https://api.coinbase.com/v2/exchange-rates?currency=ETH"

export const getETH_USDTPrice = async () => {
    console.log("Fetching ETH price")
    try {
        const res = await axios.get(URL)
        const price = res.data.data.rates["USDT"]
        return price
    } catch (error) {
        return -1
    }
}