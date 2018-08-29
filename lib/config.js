// Create Envoriment Object and Export That Object
const envoritmetns = {};

// Staging Envoriment
envoritmetns.dev = {
  'name':'Development',
  'httpPort':3000,
  'httpsPort':3001,
  'hashingSecret':'thisIsASecret'
};

// Production Envoriment
envoritmetns.production = {
  'name':'Production',
  'httpPort':5000,
  'httpsPort':5001,
  'hashingSecret':'thisIsAsslSecret'
};

// Envoriment Changing
const envorimentChange = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Current Envoriment
const currentEnvoriment = typeof(envoritmetns[envorimentChange]) === 'object' ? envoritmetns[envorimentChange] : envoritmetns['dev'];

module.exports = currentEnvoriment;