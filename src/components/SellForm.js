import React, { Component } from 'react';
import Web3 from 'web3'

import tokenLogo from '../cointracklogo.png'
import ethLogo from '../ethlogo.png'

class Sell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      output: 0
    }
  }

  render() {
    return (
      <form className="mb-3" onSubmit= {
        (event) => {
          event.preventDefault();
          let tokenAmount = window.web3.utils.toWei(this.input.value.toString(), 'Ether');
          if(tokenAmount < 0) tokenAmount = 0;
          this.props.sellTokens(tokenAmount);
        }
      }>
        <div>
          <label className="float-left"><b>Input</b></label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(this.props.tokens, 'Ether')}
          </span>
        </div>
        <div className="input-group mb-4">
          <input type="number" step="0.01" onChange= {
            (event) => {
              let tokens   = this.input.value.toString();
              this.setState({
                output: tokens / 100
              });
            }
          }
          ref = {
            (input) => {
              this.input = input;
            }
          } className="form-control form-control-lg" placeholder="0" required/>
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={tokenLogo} height="32" alt=""/>
              &nbsp; TRACK
            </div>
          </div>
        </div>
        <div>
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(this.props.ether, 'Ether')}
          </span>
        </div>
        <div className="input-group mb-4">
          <input type="text" className="form-control form-control-lg" value={this.state.output} disabled/>
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={ethLogo} height="32" alt=""/>
              &nbsp;&nbsp; ETH
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted">1 ETH = 100 TRACK</span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP</button>
      </form>
    );
  }
}

export default Sell;
