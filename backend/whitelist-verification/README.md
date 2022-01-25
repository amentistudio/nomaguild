# Whitelist verification

This service provide API endpoint to check if ETH address has been chosen for NFT minting.

### Resources

- https://medium.com/@ItsCuzzo/using-aws-for-your-nft-whitelist-api-9ae82b5c5fbc

### Deployment

```
$ serverless deploy
```

### Invocation

After successful deployment, you can call the created application via HTTP:

API endpoint is secured and can be accessed only with valid cognito JWT token. JWT token is issued by cognito after successfull sign in.
"eyJraWQiOiJiS1EzVEZZa1wvVXpJb2x3eHQ2NHJKUW44ejN4dkJVYXh6WWw1ZUx3WE5FOD0iLCJhbGciOiJSUzI1NiJ9.eyJvcmlnaW5fanRpIjoiNWI1N2FmM2UtOWM0YS00OWQ1LWFkYmYtMmU4OTM4NTliYmE5Iiwic3ViIjoiZmVlOTZlYmUtYjVkYy00NmQ5LThiNTAtOGExYzgxMzJhY2I4IiwiZXZlbnRfaWQiOiI4ZjJkZjQ4MC1iZWQwLTQwMGItOGExOC00OTg2Njc0MTIzODYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjQyMTUwNjM4LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV9KcmNudTBOeWwiLCJleHAiOjE2NDIxNTQyMzgsImlhdCI6MTY0MjE1MDYzOCwianRpIjoiNjA2Njg1OTQtYjg4Mi00N2FkLTlmYzYtYTk0ZTA1ODM3MDU5IiwiY2xpZW50X2lkIjoiaHU2NGo3aDcydDA5ZWFjamppZ2xibWg1ciIsInVzZXJuYW1lIjoiMHgwNWMwMGNlZjBmODQzMDAwYTZmODUwNmExOWZhNGJlYjU5MWM1MTljIn0.Zhbt7aiWZXvcxNFYiFSKi90fEJivcYu1mYMZIHwBESiRZGt4KKhSPzxntw-tt1vUb-IPwrB5bsD6gU7e9nA28gs0I67Bi1pW2MTTfZdsM-8gSnF4cTP695FGpVv4m_Q7XMtfYbCVr-Mvn2n6dIwBo2ke79tdvn0o1AX6itH2sVc0huCNYtvNJVmBkKbEokytinsTzignP1hUs9lBGUaRHBdzRJqEn_CgzW4rQtmQKFYd7ZR74KNcEp7fvoNMxsOJNJgCmjSOEiDNc0RROkIiOJXVDyXHCdmTmzgQrpnCNvbYEARHCmKLncgS_vySOboavY74x3s1Ci-rQKtBQ6K4iA"

```bash
curl --location --request GET 'https://XXXXXXXX.execute-api.eu-central-1.amazonaws.com/verify' \
--header 'Authorization: COGNITO_JWT_ACCESS_TOKEN'
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "body": {
      "proof": [
        "0x7e52cf4ee4b9234f3fa2bc47b2bbe72e196d6a5c309e9615891d4dcefcf4822c",
        "0xd45c0a76c176532aa0edb02b63ad4ba67cbd456bd28f4ebfe8069bdc55f62257",
        "0x753449fccac797cbef4c8d177e2c988db94b2910fa4d3adba8883e3a0c89ca94"
      ]
    }
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function verify --data '{ "headers": {"Authorization":"COGNITO_JWT_ACCESS_TOKEN"}}'
```
