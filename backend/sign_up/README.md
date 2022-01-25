# cognito-wallet-whitelist

Sign in with a Web3 Wallet and authenticate against a Cognito User Pool allowing us to whitelist users

Original code from: https://davbarrick.medium.com/how-to-build-a-serverless-web3-wallet-login-like-opensea-with-metamask-and-cognito-eb93c723f4de

## Install
```bash
npm -g install serverless
serverless config credentials --provider aws --key KEY --secret SECRET
```
KEY and SECRET can be found in our 1Password or ask at ladi@amentistudio.com

## Deploy
IMPORTANT!!!
```bash
yarn install
```

Deploy the resources and triggers for development:
```bash
serverless deploy --config resources.yml
serverless deploy --config triggers.yml
```

for production ready deploy:
```bash
serverless deploy --config resources.yml -s prod
serverless deploy --config triggers.yml -s prod
```


Get the configuration so we can setup the FE:
```bash
serverless info --config resources.yml --verbose
```
it will look like this:
```
Stack Outputs
UserPoolId: eu-central-XXXXXX
UserPoolArn: arn:aws:cognito-idp:eu-central-1:XXXXXXX:userpool/eu-central-1_XXXXX
UserPoolWebClient: XXXXXXXXXXX
ServerlessDeploymentBucketName: noma-whitelist-resources-serverlessdeploymentbuck-XXXXXX
UserPoolName: noma-whitelist
```
we need UserPoolId, UserPoolWebClient, and region (part of the UserPoolId (us-east-1))