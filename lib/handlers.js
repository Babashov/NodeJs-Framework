// Dependecies
const _data = require('./data.js');
const helpers = require('./helpers.js');
// Handler Object for handle routings
const handlers = {};

// Users Route Handler
handlers.users = (data, callback) => {

  const acceptableMethods = ['get', 'put', 'post', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  };
};

// @_users object
handlers._users = {};

//_users Get Method
// required: @phone
// optional: none
handlers._users.get = (data, callback) => {
  const phone = typeof (data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length > 0 ? data.queryStringObject.phone.trim() : false;
  if (phone) {
    _data.read('users', phone, (err, data) => {

      if (!err && data) {
        delete data.hashedPassword;
        delete data.agreement;
        callback(200, data);
        console.log('Isledi');

      } else {
        callback(404);
      }
    });
  }else{
    callback(400,{'Error':'Required Missing Field'});
  }
};

// _users Post Method
// Required: @firstName,@lastName,@phone,@password,@agreement
// Optional: none
handlers._users.post = (data, callback) => {

  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const agreement = typeof(data.payload.agreement) == 'boolean' && data.payload.agreement == true ? true : false;

  console.log(`firstname: ${firstName} and lastname is: ${lastName} and phone is ${phone} and password is ${password} and agreement is ${agreement}`)
  if (firstName && lastName && phone && password) {

    _data.read('users', phone, (data, err) => {
      if (!err) {
        const hashedPassword = helpers.hash(password);
        // User Object Data
        const userObject = {
          firstName,
          lastName,
          phone,
          hashedPassword,
          agreement: true
        };

        _data.create('users', phone, userObject, (err) => {
          if (!err) {
            callback(200);
          } else {
            console.log(err);
            callback(500, {
              'Error': 'New user is not created'
            });
          }
        });


      } else {
        callback(400, {
          'Error': 'A user with that phone number is already exist'
        });
      }
    })

  } else {
    callback(400, {
      'Error': 'Required fields must filled out'
    });
  }

};
// _users Put Method
// Required: @phone
// Optional: @firstName,@lastName,@password,@agreement
handlers._users.put = (data, callback) => {

  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const agreement = typeof(data.payload.agreement) == 'boolean' && data.payload.agreement == true ? true : false;

  if(phone)
  {
    if(firstName || lastName || password)
    {
      _data.read('users',phone,(err,userData)=>{
        if(!err && userData)
        {
          if(firstName)
          {
            userData.firstName = firstName;
          }
          if(lastName)
          {
            userData.lastName = lastName;
          }

          if(password)
          {
            userData.hashedPassword = helpers.hash(password);
          }
          _data.update('users',phone,userData,(err)=>{
            if(!err)
            {
              callback(200);
            }else{
              console.log(err);
              callback(500,{'Error':'User\'s Data is not Updates'});
            }
          })
        }
      })

    }else{
      callback(400,{'Error':'FirstName LastName and Password is required'});
    }
    
  }else{
    callback(400,{'Error':'Required Field is missing'});
  }

};

// _users Delete Method
// required: @phone
// optional: none
// @ToDo Delete any data about that user's phone number
handlers._users.delete = (data, callback) => {
// Phone Number
const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length > 0 ? data.queryStringObject.phone : false;
if(phone)
{
  _data.read('users',phone,(err,data)=>{
    if(!err && data)
    {
      _data.delete('users',phone,(err)=>{
        if(!err)
        {
          callback(200,{'Success':'User Deleted'});
        }else{
          callback(500,{'Error':'User is not deleted'});
        }
      })
    }else{
      callback(400,{'Error':'The user file is not reading'});
    }
  })
}else{
  callback(400,{'Error':'Phone Number is not found'});
}
};

// Sample Route Handler
handlers.sample = (data, callback) => {
  // Callback return http status code, and payload object
  callback(406, {
    'name': 'Sample Router Handler'
  });

};

// 404 Not Found Handler
handlers.notFound = (data, callback) => {
  // 404 Page Not Found Callback only return http status code
  callback(404);

};

module.exports = handlers;