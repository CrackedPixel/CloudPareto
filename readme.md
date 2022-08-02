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
### Contact us
If you notice any bugs/glitches or have comments/suggestions, please reach out to your nearest Cloud Pareto representive.

Additionally, you may contact us at support@cloudpareto.com
