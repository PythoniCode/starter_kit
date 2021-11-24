pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap Instant Exchange";
  Token public token;
  uint256 public rate = 100;

  event Purchase(
    address account,
    address token,
    uint256 amount,
    uint256 rate
  );

  event Sale(
    address account,
    address token,
    uint256 amount,
    uint256 rate
  );

  constructor(Token _token) public {
    token = _token;
  }

  function buyTokens() public payable {
    // Amount of Ether they provide * exchange rate (100 here)
    uint256 tokenAmount = msg.value * rate;
    // Require that EthSwap has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount);
    // Transfer the tokens to the buyer
    token.transfer(msg.sender, tokenAmount);
    // Emit a Purchase event
    emit Purchase(msg.sender, address(token), tokenAmount, rate);
  }

  function sellTokens(uint256 _amount) public {
    // User can't sell more tokens than they have
    require(token.balanceOf(msg.sender) >= _amount);
    // Calculate amount of Ether to redeem
    uint256 etherAmount = _amount / rate;
    require(address(this).balance >= etherAmount);
    // Transfer tokens from sender back to swap
    token.transferFrom(msg.sender, address(this), _amount);
    // Send Ether to the Seller
    msg.sender.transfer(etherAmount);
    emit Sale(msg.sender, address(token), _amount, rate);
  }

}
