const DappToken = artifacts.require("DappToken");
const SafeMath = artifacts.require("SafeMath");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(DappToken, 1000000);
};
