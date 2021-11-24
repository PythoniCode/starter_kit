import React, { Component } from 'react';
import Web3 from 'web3'

import Buy from './BuyForm'
import Sell from './SellForm'

import tokenLogo from '../cointracklogo.png'
import ethLogo from '../ethlogo.png'

import './Main.css';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      form: 'buy'
    }
  }

  render() {
    let content;
    if(this.state.form === 'buy'){
      content = <Buy
        ether={this.props.ether}
        tokens={this.props.tokens}
        buyTokens={this.props.buyTokens}
      />
    } else {
      content = <Sell
        ether={this.props.ether}
        tokens={this.props.tokens}
        sellTokens={this.props.sellTokens}
      />
    }
    return (
      <div id="content">
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-light"
          onClick={
            (event) =>{
              this.setState({form: 'buy'})
            }
          }>
            Buy
          </button>
          <h2>Token Exchange</h2>
          <button className="btn btn-light"
          onClick={
            (event) =>{
              this.setState({form: 'sell'})
            }
          }>
            Sell
          </button>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
