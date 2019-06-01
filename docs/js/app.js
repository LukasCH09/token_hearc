App = {
	web3Provider: null,
	contracts: {},
	account: '0x0',
	loading: false,
	tokenPrice: 10000000000000,
	tokensSold: 0,
	tokensAvailable: 750000,

	init: function() {
		console.log("App initialized...")
		return App.initWeb3();
	},

	initWeb3: function() {
		if(typeof web3 !== 'undefined') {
			// If a web3 instance is already provided by Meta Mask
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);
		} else {
			// Specify default instance if no web3 instance provided
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
			web3 = new Web3(App.web3Povider);
		}
		return App.initContracts();
	},

	initContracts: function() {
		$.getJSON("HearcTokenSale.json", function(hearcTokenSale) {
			App.contracts.HearcTokenSale = TruffleContract(hearcTokenSale);
			App.contracts.HearcTokenSale.setProvider(App.web3Provider);
			App.contracts.HearcTokenSale.deployed().then(function(hearcTokenSale){
				console.log("Hearc Token Sale address: ", hearcTokenSale.address);
			});
		}).done(function() {
			$.getJSON("HearcToken.json", function(hearcToken) {
				App.contracts.HearcToken = TruffleContract(hearcToken);
				App.contracts.HearcToken.setProvider(App.web3Provider);
				App.contracts.HearcToken.deployed().then(function(hearcToken){
					console.log("Hearc Token address: ", hearcToken.address);
				});

				App.listenForEvents();
				return App.render();
			});
		})
	},

	// Listen for events emitted from the contract
	listenForEvents: function() {
		App.contracts.HearcTokenSale.deployed().then(function(instance) {
			instance.Sell({}, {
				fromBlock: 0,
				toBlock: 'latest',
			}).watch(function(error, event) {
				console.log("event triggered", event);
				App.render();
			})
		})
	},

	render: function() {
		if(App.loading){
			return;
		}
		App.loading = true;

		var loader = $('#loader');
		var content = $('#content');

		loader.show();
		content.hide();

		// Load account data
		web3.eth.getCoinbase(function(err, account) {
			if(err === null) {
				App.account = account;
				$('#accountAddress').html("Your account:" + account);
			}
		});

		App.contracts.HearcTokenSale.deployed().then(function(instance) {
			hearcTokenSaleInstance = instance
			return hearcTokenSaleInstance.tokenPrice();
		}).then(function(_tokenPrice) {
			App.tokenPrice = _tokenPrice;
			$('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
			return hearcTokenSaleInstance.tokensSold();
		}).then(function(tokensSold) {
			App.tokensSold = tokensSold.toNumber();
			$('.tokens-sold').html(App.tokensSold);
			$('.tokens-available').html(App.tokensAvailable);

			var progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
			$('#progress').css('width', progressPercent + '%');

			App.contracts.HearcToken.deployed().then(function(instance) {
				hearcTokenInstance = instance;
				return hearcTokenInstance.balanceOf(App.account);
			}).then(function(balance) {
				$('.hearc-balance').html(balance.toNumber());
				
				App.loading = false;
				loader.hide();
				content.show();
			});
		});

	},

	buyTokens: function(){
		$('#content').hide();
		$('#loader').show();

		
		var numberOfTokens = $('#numberOfTokens').val();
		
		App.contracts.HearcTokenSale.deployed().then(function(instance) {
			return instance.buyTokens({
				from: App.account,
				value: numberOfTokens * App.tokenPrice.toNumber(),
				gas: 50000
			});
		}).then(function(result) {
			console.log('Tokens bought...');
			$('form').trigger('reset') // reset number of tokens in form
			// Wait for sell event
		});
	}
}

$(function() {
	$(window).load(function() {
		App.init();
	})
});
