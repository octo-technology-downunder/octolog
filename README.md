# Resume generator


[![CircleCI](https://circleci.com/gh/octo-technology-downunder/octolog/tree/master.svg?style=svg)](https://circleci.com/gh/octo-technology-downunder/octolog/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/octo-technology-downunder/octolog/badge.svg?branch=master)](https://coveralls.io/github/octo-technology-downunder/octolog?branch=master)

The idea is to generate the Resume of the Octos.
it should be able to retrieve information from external systems like Askbob, Gmail, Octopod, Gitlab

The application is using [Serverless] and [DynamoDB](https://aws.amazon.com/dynamodb/).

The API specs are available on [Apiary](http://docs.octoprofile.apiary.io/)

## Requirements

 * [NodeJS](https://nodejs.org/)
 * [Serverless]

### Deploying

 * ask an send a mail to [hello+cv@octo.com.au](mailto:hello+cv@octo.com.au) to demand a access to AWS with the role `deployCvOcto`
 * [configure](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) your AWS profile

### Locally

 * [Java](https://java.com/en/download/)
 * Download local DynamoDB `npm run dlDynamo`

_Note: Everything is packaged for a unix system, if you using windows: you should ~~be ashamed~~ run a local VM/add the windows specific commands_

## Commands

### Test

```sh
npm run runDynamo # run dynamodb locally (needed by e2e test)

npm run back:unit # run backend unit tests
npm run back:e2e # run backend integration tests (you need internet)
npm run back:test # run backend unit and integration test

npm run front:unit # run frontend unit tests
npm run front:e2e # run frontend end to end tests
npm run front:test # run frontend unit and end to end test

npm run test # run all of the above
```
### Locally

```sh
npm run runDynamo # run dynamodb locally

npm run front:dev # run frontend server
npm run back:dev # run backend server

```

### Deployment

Use the CLI directly.
```sh
export OCTOPOD_CLIENT_ID=toto
export OCTOPOD_CLIENT_SECRET=titi
export ASKBOB_API_KEY=tutu
npm run front:build
rm -fr node_modules
npm install --production
sls deploy
npm run front:deploy
```

Or push the code to let the circleCI deploy for you

```sh
git push
```


[Serverless]: https://serverless.com/
