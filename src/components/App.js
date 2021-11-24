import React, { Component } from 'react';
import Web3 from 'web3'

import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import NavBar from './NavBar'
import Main from './Main'

import './App.css';

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ether: ethBalance});
    // Load Token
    const networkID = await web3.eth.net.getId();
    const tokenData = Token.networks[networkID]
    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({token});
      let tokenBal = await token.methods.balanceOf(this.state.account).call();
      this.setState({tokens: tokenBal.toString()});
    }
    else window.alert('Token Contract Not Deployed to Detected Network')
    // Load EthSwap
    const swapData = EthSwap.networks[networkID]
    if(swapData) {
      const swap = new web3.eth.Contract(EthSwap.abi, swapData.address);
      this.setState({swap});
    }
    else window.alert('Token Contract Not Deployed to Detected Network');
    this.setState({loading: false});
  }

  async loadWeb3() {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if(window.web3) window.web3 = new Web3(window.web3.currentprovider);
    else window.alert("Non-Ethereum browser detected.")
  }

  buyTokens = (etherAmount) => {
    this.setState({loading: true})
    this.state.swap.methods.buyTokens()
      .send({value: etherAmount, from: this.state.account})
      .on('transactionHash', (hash) => {
        this.setState({loading: false});
      });
  }

  sellTokens = (tokenAmount) => {
    this.setState({loading: true});
    this.state.token.methods.approve(this.state.swap.address, tokenAmount)
      .send({from: this.state.account})
      .on('transactionHash', (hash) => {
        this.state.swap.methods.sellTokens(tokenAmount)
        .send({from: this.state.account})
        .on('transactionHash', (hash) => {
          this.setState({loading: false});
        });
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      token: {},
      swap: {},
      tokens: 0,
      ether: 0,
      loading: true
    }
  }

  render() {
    let content = "";
    if(this.state.loading) content = <h2 id="loader" text-align="center">Loading...</h2>
    else content = <Main
      ether={this.state.ether}
      tokens={this.state.tokens}
      rate={50 + Math.random() * 50}
      buyTokens={this.buyTokens}
      sellTokens={this.sellTokens}
    />
    return (
      <div>
        <NavBar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
