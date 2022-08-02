const ioHelper = require('../SharedLibrary/helpers/ioHelper');
const S3Lib = require('../SharedLibrary/libs/s3');
const GraphQLHelper = require('../SharedLibrary/helpers/graphQLHelper');

const GetCSVSection = async (inputData) => {
  const fileStream = await S3Lib.DownloadFileStream(process.env.S3_MAIN, inputData.S3Path);
  const fileData = await ioHelper.ReadCSVStream(fileStream, { trim: true, maxRows: inputData.maxRows, skipLines: inputData.skipLines, headers: inputData.headers });

  return fileData.json;
};

const CreateProductGraph = ({ product_id, name, manufacturer, cost, price }) => {
  return {
    query: `
      mutation {
        createProduct (
            productReq: {
                product_id: "${product_id}"
                name: "${name}"
                manufacturer: "${manufacturer}"
                cost: ${cost}
                price: ${price}
            }
        )
        { id }
    }`,
  };
};

const CreateWarehouseGraph = ({ warehouse_id, name, address, city, state, zipcode, phonenumber }) => {
  return {
    query: `
      mutation {
        createWarehouse
        (
            warehouseReq : {
                warehouse_id: "${warehouse_id}"
                name: "${name}"
                address: "${address}"
                city: "${city}"
                state: "${state}"
                zipcode: "${zipcode}"
                phonenumber: "${phonenumber}"
            }
        )
        { id }
    }`,
  };
};

const CreateInventoryGraph = ({ warehouse_id, product_id, inventory }) => {
  return {
    query: `mutation {
      createWarehouseInventory
      (
          WarehouseInventoryReq: {
              warehouse_id: "${warehouse_id}"
              product_id: "${product_id}"
              inventory: ${inventory}
          }
      )
      { id }
    }`,
  };
};

const processAddProduct = async (inputData, csvData) => {
  // ###################
  // ## Start Product ##
  // ###################
  const dataToSend = [];
  for (const csvItem of csvData) {
    const addQuery = CreateProductGraph(csvItem);

    dataToSend.push(addQuery);
  }

  // TODO: Make this bulk
  for (const dataTo of dataToSend) {
    await GraphQLHelper.SendGraphQL(process.env.API_MAIN, dataTo);
  }
};

const processAddWarehouse = async (inputData, csvData) => {
  // #############################
  // ##     Manual override     ##
  // ## I want to find a better ##
  // ##      way to do this     ##
  // #############################
  csvData.forEach((item) => {
    if ('phone-number' in item) {
      item.phonenumber = item['phone-number'];
      delete item['phone-number'];
    }
  });

  // #####################
  // ## Start Warehouse ##
  // #####################
  const dataToSend = [];
  for (const csvItem of csvData) {
    const addQuery = CreateWarehouseGraph(csvItem);

    dataToSend.push(addQuery);
  }

  // TODO: Make this bulk
  for (const dataTo of dataToSend) {
    await GraphQLHelper.SendGraphQL(process.env.API_MAIN, dataTo);
  }
};

const processAddInventory = async (inputData, csvData) => {
  // #####################
  // ## Start Inventory ##
  // #####################

  const dataToSend = [];
  for (const csvItem of csvData) {
    const addQuery = CreateInventoryGraph(csvItem);

    dataToSend.push(addQuery);
  }

  // TODO: Make this bulk
  for (const dataTo of dataToSend) {
    await GraphQLHelper.SendGraphQL(process.env.API_MAIN, dataTo);
  }
};

const processFileData = async (SQSData) => {
  const csvData = await GetCSVSection(SQSData.data);

  switch (SQSData.action) {
    case 'addproduct': return await processAddProduct(SQSData.data, csvData);
    case 'addwarehouse': return await processAddWarehouse(SQSData.data, csvData);
    case 'addinventory': return await processAddInventory(SQSData.data, csvData);
  }
};

const isValidS3Data = (event) => {
  return Boolean (
    event
    && event.Records
    && event.Records[0].body
  );
};

const lambdaFunction = async (event) => {
  if (!isValidS3Data(event)) {
    console.log('invalid SQS data received');

    return;
  }

  const SQSData = JSON.parse(event.Records[0].body);

  await processFileData(SQSData);
};

module.exports = {
  lambdaFunction,
};
