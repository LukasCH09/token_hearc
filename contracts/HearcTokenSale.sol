pragma solidity ^0.5.0;

import "./HearcToken.sol";
import "./SafeMath.sol";

contract HearcTokenSale {
	address admin;
	HearcToken public tokenContract;
	//SafeMath public tokenMath;
	uint256 public tokenPrice;
	uint256 public tokensSold;
	
	using SafeMath for uint256;
	
	event Sell(
		address _buyer,
		uint256 _amount
		);

	constructor(HearcToken _tokenContract, uint256 _tokenPrice) public {
		admin = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
	}

	function buyTokens() public payable {
		uint256 numTokens = msg.value.div(tokenPrice);
		//require(msg.value == multiply(_numberOfTokens, tokenPrice));
		require(tokenContract.balanceOf(address(this)) >= numTokens);
		require(tokenContract.transfer(msg.sender, numTokens));
		
		tokensSold += numTokens;
		emit Sell(msg.sender, numTokens);

	}

	function endSale() public payable {
		require(msg.sender == admin);
		require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
		//address payable admin_pay = admin;
		//address payable testPayable = address(uint160(msg.sender));
		//selfdestruct(msg.sender);

	}
}