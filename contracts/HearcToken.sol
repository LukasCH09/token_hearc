//pragma solidity >=0.4.21 <0.6.0;
pragma solidity ^0.5.0;

import "./SafeMath.sol";

// ----------------------------------------------------------------------------
// ERC20 Token, with the addition of symbol, name and decimals and a
// fixed supply
// ----------------------------------------------------------------------------
contract HearcToken {
    string public name = 'He-Arc Token';
    string public symbol = 'HEARC';
    //uint8 public decimals;
    uint256 public totalSupply;

    event Transfer(
        address indexed _from, 
        address indexed _to, 
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
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

    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require(_to != address(0), "ERC20: transfer to the zero address");

        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}