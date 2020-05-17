# Ethereum based voting system
## Run locally
Install `ganache-cli` and `truffle`, then compile the contracts.

```$xslt
npm i -g ganache-cli truffle
cd solidity
ganache-cli -p 8545
truffle compile
truffle migrate --network development
```

In order to run frontend you will need `MetaMask` plugin to Chrome:
https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en

Run Angular app:
```$xslt
cd eth-voting
ng serve
```

Add examplary voting:
```
truffle console --network development
truffle(development)> Voter.deployed().then(instance=>voterContract=instance)
truffle(development)> voterContract.createVoting("PresidentialElection2020", "Who should be the new president of USA?", ["Donald Trump", "Darth Vader", "Harry Potter", "Tinky Winky"], ["0xAA17bcadcC19401623ca4f4510E69Bf491fFAF76"])
```

Then you should be able to get info of created voting:
```
truffle(development)> voterContract.getVoting("PresidentialElection2020")
```
You should also be able to search for this voting in frontend application.