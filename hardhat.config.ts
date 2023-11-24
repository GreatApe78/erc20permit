import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
//import 'solidity-docgen';

import dotenv from 'dotenv';

dotenv.config();

const { MNEMONIC, NODE_URL, CHAIN_ID, ETHERSCAN_API_KEY, FANTOM_TESTNET_RPC, POLYGON_MAINNET_RPC,COINMARKETCAP_API_KEY } = process.env;

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: '0.8.19',
			},
			{ version: '0.8.20' },
		],
	},
	networks: {
		customNetwork: {
			chainId: parseInt(`${CHAIN_ID}`),
			url: `${NODE_URL}`,
			accounts: {
				mnemonic: `${MNEMONIC}`,
			},
		},
		sepolia:{
			chainId: parseInt(`${CHAIN_ID}`),
			url: `${NODE_URL}`,
			accounts: {
				mnemonic: `${MNEMONIC}`,
			},
		},
		fantomTestnet:{
			chainId: 4002,
			url: `${FANTOM_TESTNET_RPC}`,
			accounts: {
				mnemonic: `${MNEMONIC}`,
			},
		},
		polygonMainnet: {
			url: `${POLYGON_MAINNET_RPC}`,
			accounts: {
			  mnemonic: `${MNEMONIC}`,
			},
			chainId: 137,
			gas: 5500000,
			gasPrice: 120000000000,
		  },
		  ganacheCli:{
			url:`http://127.0.0.1:8545`,
	  
		  },
		  hardhatNode:{
			url:`http://127.0.0.1:8545`
		  }
	},
	etherscan: {
		apiKey: `${ETHERSCAN_API_KEY}`,
	},
	
	gasReporter:{
		enabled: true,
		coinmarketcap: `${COINMARKETCAP_API_KEY}`,
		currency: `USD`,
		token: `MATIC`,
	}
	
};

export default config;
