pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DappToken.sol";
import "./SafeMath.sol";

contract DappTokenSale {
	address admin;
	DappToken public tokenContract;
	//SafeMath public tokenMath;
	uint256 public tokenPrice;
	uint256 public tokensSold;
	
	using SafeMath for uint256;
	
	event Sell(
		address _buyer,
		uint256 _amount
		);

	constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
		admin = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
	}

	function multiply(uint x, uint y) internal pure returns (uint z) {
		require(y == 0 || (z = x * y) / y == x);
	}

	function buyTokens(uint256 _numberOfTokens) public payable {
		require(msg.value == multiply(_numberOfTokens, tokenPrice));
		require(msg.value == _numberOfTokens.mul(tokenPrice));
		//require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
		require(tokenContract.transfer(msg.sender, _numberOfTokens));
		
		tokensSold += _numberOfTokens;
		emit Sell(msg.sender, _numberOfTokens);

	}

	function endSale() public payable {
		require(msg.sender == admin);
		require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
		//address payable admin_pay = admin;
		//address payable testPayable = address(uint160(msg.sender));
		//selfdestruct(msg.sender);

	}
}