const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config()

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    test: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(`${process.env.MNEMONICS}`, `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`)
      },
      network_id: 3,
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(`${process.env.MNEMONICS}`, `https://kovan.infura.io/v3/${process.env.INFURA_ID}`)
      },
      network_id: 42,
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(`${process.env.MNEMONICS}`, `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`)
      },
      network_id: 4,
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(`${process.env.MNEMONICS}`, `https://goerli.infura.io/v3/${process.env.INFURA_ID}`)
      },
      network_id: 5,
    },
  },
  contracts_build_directory: './src/build',
  compilers: {
    solc: {
      version: "0.6.8",
      parser: "solcjs",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.REACT_APP_ETHERSCAN_API_KEY 
  },
}
