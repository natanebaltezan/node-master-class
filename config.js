/*
* Create and export configuration variables
*/

let environments = {};

environments.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging'
};

environments.production = {
  'port': 5000,
  'httpsPort': 5001,
  'envName': 'production'
};

// Determine which environment was passed as a command line argument
let currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default is staging
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module
module.exports = environmentToExport;