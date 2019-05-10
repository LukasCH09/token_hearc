//pragma solidity >=0.4.21 <0.6.0;
pragma solidity ^0.5.0;

import "./SafeMath.sol";

// ----------------------------------------------------------------------------
// ERC20 Token, with the addition of symbol, name and decimals and a
// fixed supply
// ----------------------------------------------------------------------------
contract DappToken {
    string public name = 'My Token';
    string public symbol = 'MYT';
    //uint8 public decimals;
    uint256 public totalSupply;

    event Transfer(
        address indexed _from, 
        address indexed _to, 
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    // ------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------- ----
    constructor(uint256 _initialSupply) public {
        //decimals = 18;
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;// * 10**uint(decimals);
    }

    function transfer(address _to, uint256 _value) public returns (bool succes){
        require(_to != address(0), "ERC20: transfer to the zero address");

        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}