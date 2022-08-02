const fs = require('fs');

const { S3Client, GetObjectCommand } = require('../node_modules/@aws-sdk/client-s3');
const S3 = new S3Client({
  region: process.env.REGION,
});

const streamToString = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
};

const DownloadFileStream = async (S3Bucket, S3Path, { convertToString = false } = {}) => {
  const config = {
    Bucket: S3Bucket || process.env.S3_MAIN,
    Key: S3Path
  };

  const S3DataCommand = new GetObjectCommand(config);
  const S3Data = await S3.send(S3DataCommand);

  return convertToString ? await streamToString(S3Data.Body) : S3Data.Body;
};

const DownloadFileLocally = async (S3Bucket, S3Path, localPath, { convertToString = true } = {}) => {
  const config = {
    Bucket: S3Bucket || process.env.S3_MAIN,
    Key: S3Path
  };

  const S3DataCommand = new GetObjectCommand(config);
  const S3Data = await S3.send(S3DataCommand);

  const fileData = convertToString ? await streamToString(S3Data.Body) : S3Data.Body;
  await fs.writeFileSync(localPath, fileData);
};

module.exports = {
  DownloadFileStream,
  DownloadFileLocally,
};
