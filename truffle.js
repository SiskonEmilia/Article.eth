// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  devServer: {
    disableHostCheck: true
  },
  networks: {
    ganache: {
      host: 'localhost',
      port: 9545,
      network_id: '*' // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.4.24"  // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
 }
}
