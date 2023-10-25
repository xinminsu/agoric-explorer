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

Install the explorer
```sh
git clone https://github.com/xinminsu/agoric-explorer
cd agoric-eplorer
yarn install
yarn start
```

