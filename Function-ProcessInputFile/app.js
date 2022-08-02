const ioHelper = require('../SharedLibrary/helpers/ioHelper');
const S3Lib = require('../SharedLibrary/libs/s3');
const SQSLib = require('../SharedLibrary/libs/sqs');

const SQS_QUEUE_NAME = process.env.SQS_QUEUE_INTAKE_CSV; // .split('/').pop();
const CSV_CHUNK_SIZE = 100;

const getS3DataNames = (event) => {
  const filePath = event.Records[0].s3.object.key;
  const lowerKey = filePath.toLowerCase();
  const fileNameSplit = event.Records[0].s3.object.key.split('/');
  const fileName = decodeURI(fileNameSplit[fileNameSplit.length-1]).replace(/\+/g, ' ');
  const processingType = fileNameSplit[1]; // TODO: find a better way to identify these

  return {
    lowerKey,
    fileNameSplit,
    fileName,
    filePath,
    processingType,
  };
};

const isValidS3Data = (event) => {
  return Boolean (
    event
    && event.Records
    && event.Records[0].s3
    && event.Records[0].s3.object
    && event.Records[0].s3.object.key
  );
};

const sendChunksToSQS = async (S3Path, processingType, fileData) => {
  const chunks = Math.ceil(fileData.length / CSV_CHUNK_SIZE);

  const sendToSQSData = [];
  for (let i = 0; i < chunks; ++i) {
    const skipLines = CSV_CHUNK_SIZE * i;
    const maxRows = CSV_CHUNK_SIZE + 1;

    const SQSObj = {
      action: `add${processingType}`,
      data: {
        S3Path,
        skipLines,
        maxRows,
        headers: fileData.headers,
      },
    };

    sendToSQSData.push(SQSObj);
  }

  await SQSLib.SendMessageBatch(SQS_QUEUE_NAME, sendToSQSData);
};

const processFile = async ({ fileName, filePath, processingType } = {}) => {
  ioHelper.CheckPathExists(`${ioHelper.GetLocalPath()}${fileName}`);

  const fileStream = await S3Lib.DownloadFileStream(process.env.S3_MAIN, filePath);
  const fileData = await ioHelper.ReadCSVStream(fileStream, { trim: true });

  await sendChunksToSQS(filePath, processingType, fileData);
};

const lambdaFunction = async (event) => {
  if (!isValidS3Data(event)) {
    console.log('invalid S3 data received');

    return;
  }

  const S3DataNames = getS3DataNames(event);

  await processFile(S3DataNames);
};

module.exports = {
  lambdaFunction,
};
