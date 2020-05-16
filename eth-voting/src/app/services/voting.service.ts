import {Injectable} from '@angular/core';

const Web3 = require('web3');
declare let require: any;
declare let window: any;
const tokenAbi = require('../../../../solidity/build/contracts/Voter.json');

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  private account: any = null;
  private readonly web3: any;
  private enable: any;

  constructor() {
    if (window.ethereum === undefined) {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      if (typeof window.web3 !== 'undefined') {
        this.web3 = window.web3.currentProvider;
      } else {
        this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      console.log('voting.service :: constructor :: window.ethereum');
      window.web3 = new Web3(window.ethereum);
      console.log('voting.service :: constructor :: this.web3');
      console.log(this.web3);
      this.enable = this.enableMetaMaskAccount();
    }

  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = window.ethereum.enable();
    });
    return Promise.resolve(enable);
  }


  public async getAccount(): Promise<any> {
    console.log('voting.service :: getAccount :: start');
    if (this.account == null) {
      this.account = await new Promise((resolve, reject) => {
        console.log('voting.service :: getAccount :: eth');
        console.log(window.web3.eth);
        window.web3.eth.getAccounts((err, retAccount) => {
          console.log('voting.service :: getAccount: retAccount');
          console.log(retAccount);
          if (retAccount.length > 0) {
            this.account = retAccount[0];
            resolve(this.account);
          } else {
            alert('voting.service :: getAccount :: no accounts found.');
            reject('No accounts found.');
          }
          if (err != null) {
            alert('voting.service :: getAccount :: error retrieving account');
            reject('Error retrieving account');
          }
        });
      }) as Promise<any>;
    }
    return Promise.resolve(this.account);
  }

  public async getOptions(votingName: string): Promise<string[]> {
    const that = this;
    return new Promise((resolve, reject) => {
      console.log('voting.service :: getOptions:: tokenAbi');
      console.log(tokenAbi);
      const contract = require('@truffle/contract');
      const votingContract = contract(tokenAbi);
      votingContract.setProvider(that.web3);
      console.log('voting.service :: getOptions :: votingContract');
      console.log(votingContract);
      votingContract.deployed().then(instance => instance.getVoting(votingName)
        .then(options => {
          return resolve(options);
        })
        .catch(error => {
          console.log(error);
          return reject('voting.service error');
        }));
    });
  }

}
