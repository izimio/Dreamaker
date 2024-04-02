import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const {ETHERSCAN_API_KEY, PRIVATE_KEY, SEPOLIA_RPC} = process.env;

if (!PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is missing");
}

if (!ETHERSCAN_API_KEY) {
  throw new Error("ETHERSCAN_API_KEY is missing");
}

if (!SEPOLIA_RPC) {
  throw new Error("SEPOLIA_RPC is missing");
}

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  
  
  networks: {
    sepolia: {
      url: SEPOLIA_RPC,
      accounts: [PRIVATE_KEY],
    },
    hardhat: {
      gasPrice: 0,
      initialBaseFeePerGas: 0
    },
    localhost: {
      gasPrice: 0,
      initialBaseFeePerGas: 0
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  defaultNetwork: "hardhat",
};

export default config;
