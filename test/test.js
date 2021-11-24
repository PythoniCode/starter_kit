const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor]) => {
  let token, ethswap;

  before(async() => {
    token = await Token.new();
    ethswap = await EthSwap.new(token.address);
    // Swap 1,000,00 Tokens to EthSwap
    await token.transfer(ethswap.address, tokens('1000000'));
  });

  describe('Token Deployment', async() => {
    it('contract has name',  async() => {
      const name = await token.name();
      assert.equal(name, 'Cointrack');
    });
  });

  describe('EthSwap Deployment', async() => {
    it('contract has name',  async() => {
      const name = await ethswap.name();
      assert.equal(name, 'EthSwap Instant Exchange');
    });
    it('contract has tokens',  async() => {
      let balance = await token.balanceOf(ethswap.address);
      assert.equal(balance.toString(), tokens('1000000'));
    });
  });

  describe('buyTokens()', async() => {
    let result;
    before(async() => {
      result = await ethswap.buyTokens({from: investor, value: tokens('1')});
    });
    it('Allows user to buy tokens from ethSwap for a fixed price', async() => {
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('100'));
      let ethSwapBalance = await token.balanceOf(ethswap.address);
      assert.equal(ethSwapBalance.toString(), tokens('999900'));
      ethSwapBalance = await web3.eth.getBalance(ethswap.address);
      assert.equal(ethSwapBalance.toString(), tokens('1'));
      let event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens('100').toString());
      assert.equal(event.rate.toString(), '100');
    });
  });

  describe('sellTokens()', async() => {
    let result;
    before(async() => {
      await token.approve(ethswap.address, tokens('100'), {from: investor});
      result = await ethswap.sellTokens(tokens('100'), {from: investor});
    });
    it('Allows user to sell tokens to ethSwap for a fixed price', async() => {
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('0'));
      let ethSwapBalance = await token.balanceOf(ethswap.address);
      assert.equal(ethSwapBalance.toString(), tokens('1000000'));
      ethSwapBalance = await web3.eth.getBalance(ethswap.address);
      assert.equal(ethSwapBalance.toString(), tokens('0'));
      let event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens('100').toString());
      assert.equal(event.rate.toString(), '100');

      await ethswap.sellTokens(tokens('500'), {from: investor}).should.be.rejected;
    });
  });

})
