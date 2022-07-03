import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
import "hardhat-gas-reporter";
import { HardhatUserConfig, task } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.7",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`,
            accounts:
                process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            timeout: 1000000
        },
        bscTestnet: {
            url: "https://speedy-nodes-nyc.moralis.io/89b4f5c6d2fc13792dcaf416/bsc/testnet",
            chainId: 97,
            // gasPrice: 20000000000,
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            timeout: 10000000
        },
        bsc: {
            url: "https://bsc-dataseed.binance.org/",
            chainId: 56,
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            timeout: 1000000
        },
        avaxTestnet: {
            url: 'https://speedy-nodes-nyc.moralis.io/6b6699a56d6c765982b4b7c0/avalanche/testnet',
            chainId: 43113,
            gas: 2100000,
            gasPrice: 25000000000,
            timeout: 1000000,
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
        avaxMainnet: {
            url: 'https://api.avax.network/ext/bc/C/rpc',
            chainId: 43114,
            timeout: 100000000,
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: {
            rinkeby: "XTJMS3G1DVVMZ24GR1PKZFSABFBF4WE92T",
            bscTestnet: "A2HNWK3VKZNQFAGU254HW1DAG4RPB8FI8T",
            avalancheFujiTestnet: "R74P996X78YHM8EHPZS9S8YVRPKXVAV7JB",
        }
    }
};

export default config;
