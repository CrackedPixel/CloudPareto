# Cloud Pareto
Cloud Pareto is a small business with a goal for expanding to a global market. With multiple warehouses full of products, we are sure to have something for everyone.

---
## How to deploy
- `cd SharedLibrary` to enter the shared library folder
- `yarn install` to install global dependencies
- `cd ../` to get back to the root folder
- edit the account id in `serverless.yml` (line 10)
- (optional) change the service name in `serverless.yml` (line 1)
- `sls deploy` to deploy to AWS. Optionally, use `--stage="example"` to change environments
---
## How to run locally
- `cd SharedLibrary` to enter the shared library folder
- `yarn install` to install global dependencies
- `cd ../` to get back to the root folder (important for relative pathing to match deployment)
- `node API-CloudPareto/local.js` to run the API locally. Nodemon can also be used
- `node Function-XYZ/local.js` to run the function locally (requires manual edits to */local.js). Nodemon can also be used
---
## Checking case study
### #1 - Total value of a product at a given warehouse
```
query {
    totalValueOfProductAtWarehouse
    (
        warehouse_id: "warehouse#001"
        product_id: "product#001"
    )
    {
        price
        inventory
        total
    }
}
```
### #2 - List of warehouses that have a given product, and the stats for each
```
query {
    warehouseInventoriesByProductId
    (
        product_id: "product#001"
    )
    {
        results {
            warehouse_id
            inventory
        }
    }
}
```
---
## Running queries
For this I recommed using something like Postman
### Product - CRUD
```
mutation {
    createProduct (
        productReq: {
            product_id: "product#001"
            name: "Ketchup"
            manufacturer: "Heinz"
            cost: 3
            price: 4
        }
    )
    {
        id
        name
    }
}
```
```
query {
    productById 
    (
        id: "<ID>"
    ) 
    {
        id
        name
        product_id
        manufacturer
        cost
        price
    }
}
```
```
query {
    products 
    {
        results {
            id
            product_id
            name
            manufacturer
            cost
            price
        }
    }
}
```
```
mutation {
    editProduct 
    (
        id: "<ID>"
        productReq: {
            price: 12   # This can be any field, or multiple
        }
    )
    {
        id
        name
        price
    }
}
```
```
mutation {
    removeProduct (
        id: "<ID>"
    ) 
    {
        id
        name
        product_id
        manufacturer
        cost
        price
    }
}
```
### Product - Other queries to explore
- productByProductId, accepts `product_id` as a parameter
### Warehouse - CRUD
```
mutation {
    createWarehouse
    (
        warehouseReq : {
            warehouse_id: "warehouse#001"
            name: "SouthEast"
            address: "9851 E. Mill Pond St."
            city: "Jupiter"
            state: "FL"
            zipcode: "33458"
            phonenumber: "111-111-1111"
        }
    )
    {
        id
        name
    }
}
```
```
query {
    warehouseById
    (
        id: "<ID>"
    )
    {
        id
        warehouse_id
        name
        address
        phonenumber
    }
}
```
```
query {
    warehouses
    {
        results {
            id
            warehouse_id
            name
            address
            phonenumber
        }
    }
}
```
```
mutation {
    editWarehouse
    (
        id: "<ID>"
        warehouseReq: {
            phonenumber: "111-111-1111" # This can be any field
        }
    )
    {
        id
        warehouse_id
        name
        address
        phonenumber
    }
}
```
```
mutation {
    removeWarehouse
    (
        id: "<ID>"
    )
    {
        id
        warehouse_id
        name
        address
        phonenumber
    }
}
```
### Warehouse - Other queries to explore
- warehouseByWarehouseId, accepts `warehouse_id` as a parameter
### Warehouse Inventory - CRUD
```
mutation {
    createWarehouseInventory
    (
        WarehouseInventoryReq: {
            warehouse_id: "warehouse#001"
            product_id: "product#001"
            inventory: 5
        }
    )
    {
        id
        warehouse_id
        product_id
        inventory 
    }
}
```
```
query {
    warehouseInventoriesByWarehouseId
    (
        warehouse_id: "warehouse#001"
    )
    {
        results {
            id
            warehouse_id
            product_id
            inventory
        }
    }
}
```
```
query {
    warehouseInventories
    {
        results {
            id
            warehouse_id
            product_id
            inventory
        }
    }
}
```
```
mutation {
    editWarehouseInventory
    (
        id: "<ID>"
        WarehouseInventoryReq: {
            warehouse_id: "warehouse#001"
            product_id: "product#002"
            inventory: 4
        }
    )
    {
        id
        warehouse_id
        product_id
        inventory 
    }
}
```
```
mutation {
    removeWarehouseInventory
    (
        id: "<ID>"
    )
    {
        id
        warehouse_id
        product_id
        inventory
    }
}
```
### Warehouse Inventory - Other queries to explore
- warehouseInventoriesByProductId, accepts `product_id` as a parameter. returns `results`
- warehouseInventoriesByWarehouseProductId, accepts both `product_id` and `warehouse_id` as parameters
---
### Contact us
If you notice any bugs/glitches or have comments/suggestions, please reach out to your nearest Cloud Pareto representive.

Additionally, you may contact us at support@cloudpareto.com
