const fs = require('fs');
const path = require('path');

const exceljs = require('../node_modules/exceljs');

const CheckPathExists = (localPath) => {
  const dirPath = path.extname(localPath) ? path.resolve(localPath.substring(0, localPath.lastIndexOf('/'))) : path.resolve(localPath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return `${dirPath}/`;
};

const GetLocalPath = () => {
  const localPath = process.env.LAMBDA_TASK_ROOT ? '/tmp/' : './tmp/';

  return CheckPathExists(localPath);
};

const WriteFile = async (localPath = '', Data) => {
  const filePath = localPath || GetLocalPath();

  await fs.writeFileSync(filePath, Data);
};

const WorksheetToJSON = (worksheet, options) => {
  const localHeaders = options.headers ? options.headers : [];
  const results = [];

  for (let i = 0; i < worksheet._rows.length; ++i) {
    const rowData = worksheet._rows[i];
    const rowValues = rowData.values;
    const rowObj = {};
    rowValues.shift();

    if (options.headerOnly) {
      return rowValues;
    }

    if (i === 0) {
      if (!options.headers) {
        localHeaders.push(...rowValues);
      }

      continue;
    }

    for (let x = 0; x < localHeaders.length; ++x) {
      rowObj[localHeaders[x]] = rowValues[x] || rowValues[x] === 0 ? rowValues[x] : '';
    }

    results.push(rowObj);
  }

  return results;
};

const GetCSVHeadersFromWorksheet = (worksheet) => {
  const rawData = worksheet._rows[0].values;
  rawData.shift();

  return rawData;
};

const ReadLocalCSV = async (localPath, options) => {
  const workbook = new exceljs.Workbook();
  const worksheet = await workbook.csv.readFile(localPath, { parserOptions: { trim: options.trim, maxRows: options.maxRows, skipLines: options.skipLines } });
  const result = {};

  result.length = worksheet._rows.length;
  result.headers = GetCSVHeadersFromWorksheet(worksheet);
  result.json = WorksheetToJSON(worksheet, options);
  result.workbook = workbook;

  return result;
};

const ReadCSVStream = async (csvStream, options) => {
  const workbook = new exceljs.Workbook();
  const worksheet = await workbook.csv.read(csvStream, { parserOptions: { trim: options.trim, maxRows: options.maxRows, skipLines: options.skipLines } });
  const result = {};

  result.length = worksheet._rows.length;
  result.headers = GetCSVHeadersFromWorksheet(worksheet);
  result.json = WorksheetToJSON(worksheet, options);
  result.workbook = workbook;

  return result;
};

module.exports = {
  CheckPathExists,
  GetLocalPath,
  WriteFile,
  ReadCSVStream,
  ReadLocalCSV,
};
