import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers"

dotenv.config();
// 140a0304ec0fb981ecf2c554e9fed0138f406e3962f507bedf9e6d6e1678ee45
const privateKey =
  process.env.PRIVATE_KEY ||
  "0x0123456789012345678901234567890123456789012345678901234567890123";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    bsc: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: [privateKey],
    },
    tbsc: {
      url: `https://data-seed-prebsc-1-s2.binance.org:8545/`,
      accounts: [privateKey],
    },
    hardhat: {
      chainId: 1337,
    },
    local: {
      chainId: 1337,
      url: `http://127.0.0.1:8545`,
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: privateKey ? [privateKey] : [],
    },
  },
  defaultNetwork: "local"
};

export default config;
