# NoMA web

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Install
```sh
yarn install
```

## Run from root of monorepo
```sh
cd .. && make web-start
```

## Run for test purposes
```sh
yarn start
```

## Deploy
```sh
cd .. && make web-deploy
```

## Benchmarking
```sh
npx autocannon -c 100 -d 5 -p 10 https://nomummyallowed.com
```

