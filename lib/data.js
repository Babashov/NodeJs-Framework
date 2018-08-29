// Dependecies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Container Data Object
const lib = {};

// Base Directory
lib.baseDir = path.join(__dirname,'/../.data/');

// Create File and write it
lib.create = (dir,file,data,callback)=>{

  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',(err,fileDescriptor)=>{

    if(!err && fileDescriptor)
    {
      const stringData = JSON.stringify(data);

      fs.writeFile(fileDescriptor,stringData,(err)=>{
        if(!err){
          fs.close(fileDescriptor,(err)=>{
            if(!err)
            {
              callback(false);
            }else{
              callback('Error closing new file');
            }

          });
        }else{
          callback('Error writing new file');
        }
      })
      
    }else{
      callback('File is not write, it may already exist same name file in the server');
    }

  });

};

// Read File
lib.read = (dir,file,callback)=>{
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',(err,data)=>{
    if(!err && data)
    {
      const parsedData = helpers.parseJsonToObject(data);
      callback(false,parsedData);
    }else{
      callback(err,data);
    }
  });
};

// Update File
lib.update = (dir,file,data,callback)=>{
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+',(err,fileDescriptor)=>{
    if(!err && fileDescriptor)
    {
      const stringData = JSON.stringify(data);
      fs.truncate(fileDescriptor,(err)=>{
        if(!err)
        {
          fs.writeFile(fileDescriptor,stringData,(err)=>{
            if(!err)
            {
              fs.close(fileDescriptor,(err)=>{
                if(!err)
                {
                  callback(err);
                }else{
                  callback('File is not closed');
                }
              })
            }else{
              callback('File is not writed');
            }
          })
        }else{
          callback('File descriptor is not truncated');
        }
      })

    }else{
      callback('Could not open the file');
    }
  });
};

// Delete File
lib.delete = (dir,file,callback)=>{

  fs.unlink(lib.baseDir+dir+'/'+file+'.json',(err)=>{
    if(!err)
    {
      callback(false);
    }else{
      callback('It Could not deleted file');
    }
  })

};


// Export Lib Object
module.exports = lib;