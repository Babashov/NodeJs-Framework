/*
  * @Helpers Object
  * 
*/

// Dependencies
const crypto = require('crypto');
const config = require('./config');
// Create Helpers Object for containers
const helpers = {};

helpers.hash = (str)=>{

  if(typeof(str) == 'string' && str.length > 0)
  {
    const hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
    return hash;
  }else{
    return false;
  }

};


// Parse JSON string to Object
helpers.parseJsonToObject = (str)=>{
try{
const obj = JSON.parse(str);
return obj;
}catch(e){

  

}
};


// Export Helpers Object
module.exports = helpers;