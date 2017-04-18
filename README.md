# Resume generator

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

### Testing

 * Install [Dredd](https://www.npmjs.com/package/dredd) `npm install -g dredd`

## Commands

### Test

#### Unit test
```sh
npm test # not yet configure
```

#### Integration test
Using apiary as spec we can use dredd

```sh
npm run dynamo # run dynamoDb
dredd # run integration tests
```

### Run locally

```sh
npm run dynamo # run dynamoDb
npm run dev # start the application
```

### Deployment

```sh
export ENV=dev
sls deploy --stage $ENV
```

[Serverless]: https://serverless.com/
