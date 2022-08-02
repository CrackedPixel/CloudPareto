process.env.ACCOUNT_ID='';
process.env.REGION='us-east-1';
process.env.ENVIRONMENT='development';
process.env.DYNAMODB_TABLE_NAME=`cloudpareto-DYNAMODB-${process.env.ENVIRONMENT}`;
process.env.SQS_QUEUE_INTAKE_CSV=`https://sqs.${process.env.REGION}.amazonaws.com/${process.env.ACCOUNT_ID}/cloudpareto-IntakeCSV-${process.env.ENVIRONMENT}`;
process.env.S3_MAIN = `cloudpareto-data-files-${process.env.ENVIRONMENT}`;
process.env.API_MAIN = `cloudpareto-API-CloudPareto-${process.env.ENVIRONMENT}`;

const runLocally = async () => {
  let testGraphQuery;
  // testGraphQuery = {
  //   query: `{
  //     products {
  //       results {
  //         id
  //         name
  //         cost
  //         price
  //       },
  //     },
  //   }`,
  // };

  const testEvent = {
    path: '/graphql',
    httpMethod: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testGraphQuery),
  };

  if (testGraphQuery) {
    return await require('./lambda').universal(testEvent);
  }

  const app = require('./app');

  app.listen({
    port: 4000,
  }, (err, addr) => {
    if (err) throw err;

    console.log('server listening on', addr);
  });
};

runLocally();