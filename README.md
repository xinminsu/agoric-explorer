# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prepare

install the
[prerequisites](https://agoric.com/documentation/getting-started/before-using-agoric.html).

## Execute every command below in a seperate terminal

Install the sdk
```sh
cd agoric-sdk
git checkout
yarn && yarn build
```

Start your local-chain
```sh
cd agoric-sdk/packages/cosmic-swingset
make scenario2-setup && make scenario2-run-chain
```

Start `ag-solo`
```sh
cd agoric-sdk/packages/cosmic-swingset
make scenario2-run-client
```

Start `ag-solo-1`
```sh
cd agoric-sdk/packages/cosmic-swingset
make scenario2-run-client-1
```

Open your wallet UI
```
cd agoric-sdk/packages/cosmic-swingset/t1/8000
agoric open --repl --hostport=localhost:8000
```

Open your wallet UI 1
```
cd agoric-sdk/packages/cosmic-swingset/t1/8001
agoric open --repl --hostport=localhost:8001
```

Deploy the contract
```
cd agoric-dapp-card-store
agoric deploy contract/deploy.js api/deploy.js
```

Start UI,
```
cd ui && yarn start
```

Install the explorer
```sh
git clone https://github.com/xinminsu/agoric-explorer
cd agoric-eplorer
yarn install
yarn start
```

