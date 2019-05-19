const DappToken = artifacts.require("DappToken");
const DappTokenSale = artifacts.require("DappTokenSale");
const SafeMath = artifacts.require("SafeMath");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(DappToken, 1000000).then(function() {
  	// Token price is 0.001 Ether
  	var tokenPrice = 1000000000000000;
  	return deployer.deploy(DappTokenSale, DappToken.address, tokenPrice);	
  });  

};