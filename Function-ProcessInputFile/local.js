process.env.ACCOUNT_ID='';
process.env.REGION='us-east-1';
process.env.ENVIRONMENT='development';
process.env.DYNAMODB_TABLE_NAME=`cloudpareto-DYNAMODB-${process.env.ENVIRONMENT}`;
process.env.SQS_QUEUE_INTAKE_CSV=`https://sqs.${process.env.REGION}.amazonaws.com/${process.env.ACCOUNT_ID}/cloudpareto-IntakeCSV-${process.env.ENVIRONMENT}`;
process.env.S3_MAIN = `cloudpareto-data-files-${process.env.ENVIRONMENT}`;
process.env.API_MAIN = `cloudpareto-API-CloudPareto-${process.env.ENVIRONMENT}`;

const runLocally = async () => {
  const app = require('./app');

  const testData = {
    Records: [
      {
        s3: {
          object: {
            // key: 'data-files/inventory/Severless_Case_-_Inventory.csv',
          },
        },
      },
    ],
  };

  await app.lambdaFunction(testData);
};

runLocally();
