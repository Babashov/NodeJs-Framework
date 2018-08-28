/*
  * Create and export Envoriment
  * 
  */

  // Define the @envoriments object
  const envoriments = {};

  // Staging envoriment
  envoriments.staging = {
    'port':3000,
    'envName':'staging'
  };

  // Production Envoriment
  envoriments.production = {
    'port':5000,
    'envName':'production'
  };

  // Checking envoriment
  const currentEnvoriment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

  // Pass Envoriment
  const envorimentToExport = typeof(envoriments[currentEnvoriment]) === 'object' ? envoriments[currentEnvoriment] : envoriments.staging;

  // Export The Module
  module.exports = envorimentToExport;