import * as dotenv from "dotenv"
import { HardhatUserConfig, task } from "hardhat/config"
import "@nomiclabs/hardhat-etherscan"
// import "@nomiclabs/hardhat-waffle"
import "hardhat-gas-reporter"
// import "solidity-coverage"
// import "hardhat-deploy"
import "@nomiclabs/hardhat-ethers"
import "dotenv/config"
import "@typechain/hardhat"

dotenv.config()

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: process.env.MAINNET_RPC_URL!,
      },
      // blockConfirmations: 1,
    },
    rinkeby: {
      chainId: 4,
      // blockConfirmations: 6,
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  solidity: {
    compilers: [
      { version: "0.8.9", settings: {} },
      { version: "0.6.6" },
      { version: "0.6.12" },
      { version: "0.4.19" },
    ],
  },

  mocha: {
    timeout: 300000, // 300 seconds max
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },

  gasReporter: {
    // enabled: process.env.REPORT_GAS !== undefined,
    enabled: false,
    currency: "INR",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: "ETH",
  },
}

export default config
