pragma solidity ^0.5.0;

// ----------------------------------------------------------------------------
// ERC20 Token, with the addition of symbol, name and decimals and a
// fixed supply
// ----------------------------------------------------------------------------
contract DappToken {
    //uint8 public decimals;
    uint256 public totalSupply;

    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor() public {
        //decimals = 18;
        totalSupply = 1000000;// * 10**uint(decimals);
    }
}