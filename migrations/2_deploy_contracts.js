const HearcToken = artifacts.require("HearcToken");
const HearcTokenSale = artifacts.require("HearcTokenSale");
const SafeMath = artifacts.require("SafeMath");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(HearcToken, 1000000).then(function() {
  	// Token price is 0.001 Ether
  	var tokenPrice = 1000000000000000;
  	return deployer.deploy(HearcTokenSale, HearcToken.address, tokenPrice);	
  });  

};