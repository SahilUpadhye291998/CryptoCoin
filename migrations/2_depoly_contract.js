const HokageToken = artifacts.require("HokageToken");

module.exports = function(deployer) {
  deployer.deploy(HokageToken,1000000);
};
