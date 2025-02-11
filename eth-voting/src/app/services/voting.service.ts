import {Injectable} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {VotingResult} from '../model/VotingResult';
import {Voting} from '../model/Voting';

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

  public async getVotingResults(votingName: string): Promise<VotingResult> {
    const that = this;
    return new Promise((resolve, reject) => {
      console.log('voting.service :: getVoting:: tokenAbi');
      console.log(tokenAbi);
      const contract = require('@truffle/contract');
      const votingContract = contract(tokenAbi);
      votingContract.setProvider(that.web3);
      console.log('voting.service :: getVoting :: votingContract');
      console.log(votingContract);
      votingContract.deployed().then(instance => instance.getVotingResults(votingName)
        .then(result => {
          console.log('getVoting result: ', result);
          const optionsNo = result.length - 3;
          const voting: VotingResult = {
              started: !!result[0].words[0],
              ended: !!result[1].words[0],
              allVotersNo: result[2].words[0],
              votesNo: result.slice(3, 3 + optionsNo).map(n => n.words[0])
            }
          ;
          return resolve(voting);
        })
        .catch(error => {
          console.log(error);
          return reject('voting.service error');
        }));
    });
  }

  public async getVoting(votingName: string): Promise<Voting> {
    const that = this;
    return new Promise((resolve, reject) => {
      console.log('voting.service :: getVoting:: tokenAbi');
      console.log(tokenAbi);
      const contract = require('@truffle/contract');
      const votingContract = contract(tokenAbi);
      votingContract.setProvider(that.web3);
      console.log('voting.service :: getVoting :: votingContract');
      console.log(votingContract);
      votingContract.deployed().then(instance => instance.getVoting(votingName)
        .then(result => {
          console.log('getVoting result: ', result);
          const voting: Voting = {
              question: result[0],
              options: result.slice(1)
            }
          ;
          return resolve(voting);
        })
        .catch(error => {
          console.log(error);
          return reject('voting.service error');
        }));
    });
  }


  public async createVoting(votingName: string, question: string, options: string[], addresses: string[]): Promise<any> {
    const account = await this.getAccount();
    const that = this;
    return new Promise((resolve, reject) => {
      const contract = require('@truffle/contract');
      const votingContract = contract(tokenAbi);
      votingContract.setProvider(that.web3);
      votingContract.deployed().then(instance => instance.createVoting(votingName, question, options, addresses, {from: account})
        .then(success => {
          return resolve(true);
        })
        .catch(error => {
          console.log(error);
          return reject(error);
        }));
    });

  }

  public async endVoting(votingName: string): Promise<any> {
    const account = await this.getAccount();
    const that = this;
    return new Promise((resolve, reject) => {
      const contract = require('@truffle/contract');
      const votingContract = contract(tokenAbi);
      votingContract.setProvider(that.web3);
      votingContract.deployed().then(instance => instance.endVoting(votingName, {from: account})
        .then(success => {
          return resolve(true);
        })
        .catch(error => {
          console.log(error);
          return reject(error);
        }));
    });
  }

  public async startVoting(votingName: string): Promise<any> {
    const account = await this.getAccount();
    const that = this;
    return new Promise((resolve, reject) => {
      const contract = require('@truffle/contract');
      const votingContract = contract(tokenAbi);
      votingContract.setProvider(that.web3);
      votingContract.deployed().then(instance => instance.startVoting(votingName, {from: account})
        .then(success => {
          return resolve(true);
        })
        .catch(error => {
          console.log(error);
          return reject(error);
        }));
    });
  }

  public async vote(votingName: string, option: string): Promise<any> {
    const account = await this.getAccount();
    const that = this;
    return new Promise((resolve, reject) => {
      const contract = require('@truffle/contract');
      const votingContract = contract(tokenAbi);
      votingContract.setProvider(that.web3);
      votingContract.deployed().then(instance => instance.vote(votingName, option, {from: account})
        .then(success => {
          return resolve(true);
        })
        .catch(error => {
          console.log('vote error: ');
          console.log(error.toString());
          return reject(error);
        }));
    });
  }
}
