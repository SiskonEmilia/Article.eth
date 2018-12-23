var ControlBus = artifacts.require("./ControlBus.sol");

module.exports = function(deployer) {
  deployer.deploy(ControlBus);
};
