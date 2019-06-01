const HearcTokenSale = artifacts.require("./HearcTokenSale.sol");
const HearcToken = artifacts.require("./HearcToken.sol");

contract('HearcTokenSale', function(accounts) {
	var tokenSaleInstance;
	var tokenInstance;
	var admin = accounts[0];
	var buyer = accounts[1];
	var tokenPrice = 1000000000000000;
	var tokensAvailable = 750000;
	var numberOfTokens;

	it('initializes the contract with the correct values', function() {
		return HearcTokenSale.deployed().then(function(instance) {
			tokenSaleInstance = instance;
			return tokenSaleInstance.address;
		}).then(function(address){
			assert.notEqual(address, 0x0, 'has contract address');
			return tokenSaleInstance.tokenContract();
		}).then(function(address){
			assert.notEqual(address, 0x0, 'has token contract address');
			return tokenSaleInstance.tokenPrice();
		}).then(function(price) {
			assert.equal(price, tokenPrice, 'token price is correct');
		});
	});

	it('facilitates token buying', function() {
		return HearcToken.deployed().then(function(instance) {
			// Grab first the tokenInstance
			tokenInstance = instance;
			return HearcTokenSale.deployed();
		}).then(function(instance) {
			// Then grab the TokenSaleInstance
			tokenSaleInstance = instance;
			// Provision 75% of tokens for tokenSale
			return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable , { from: admin} );
		}).then(function(receipt){
			numberOfTokens = 10;
			return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice});
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
			assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
			assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
			return tokenSaleInstance.tokenSold();
		}).then(function(amount) {
			assert.equal(amount.toNumber(), numberOfTokens, 'increment the number of tokens available');
			return tokenInstance.balanceOf(buyer);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), numberOfTokens, 'increment the number of tokens bought');
			return tokenInstance.balanceOf(tokenSaleInstance.address);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens, 'decrement the number of tokens sold');
		 	return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1});
		}).then(assert.fail).catch(function(error){
		  	assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei: ' + error.message);
			return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'msg.value must be less than or equal the nuber of vailable tokens: ' + error.message);
		});
	});


	it('ends token sale', function() {
		return HearcToken.deployed().then(function(instance) {
			// Grab first the tokenInstance
			tokenInstance = instance;
			return HearcTokenSale.deployed();
		}).then(function(instance) {
			// Then grab the TokenSaleInstance
			tokenSaleInstance = instance;
			return tokenSaleInstance.endSale({ from: buyer });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale')); 
			return tokenSaleInstance.endSale({ from: admin });
		}).then(function(receipt) {
			return tokenInstance.balanceOf(admin);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 999990, 'returns all unsold dapp tokens to admin')
			// Check that token price is reset when selfdestruct is called
		//	return tokenSaleInstance.tokenPrice();
		//}).then(function(price) {
		//	assert.equal(price.toNumber(), 0, 'token price was reset to 0');
		});
	});

})