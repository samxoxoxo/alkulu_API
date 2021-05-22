var UserSchema = require('../models/UserSchema')
var bcrypt = require('bcrypt');
var saltRouds = 10
module.exports = {
    login: async function(email, password) {

        var resultStatus = {status: "Successfully Login"}
        var resd 
        
   await UserSchema.findOne({email: email})
  .then(async chk => {
    if(!chk) {
        resultStatus.status = "User not exist"
      return resultStatus
    }
    else {
      const match = await bcrypt.compare(password, chk.password)
        if(match) {
          return resultStatus
        }else {
          resultStatus.status = "Unauthorized Access"
          return resultStatus
        }
    } 
  })
  .catch(err => {
    console.log("Error is ", err.message);
  });
  return resultStatus
    },
    
    signup: async function(email, password, name) {
   
        var resultStatus = {status: "Added Successfully"}
        await UserSchema.findOne({email: email})
        .then(async chk => {
          if(!chk) {
            bcrypt.hash(password, saltRouds, async (err, hash) => {
              if(err) {
                console.log(err)
              }
              else {
                password = hash;
                var newUser = UserSchema({
                    email : email,
                    name : name,
                    password : password
                 })
                
                await newUser
                .save()
                .then(() => {
                        return resultStatus
                })
                .catch(err => {
                  console.log("Error is ", err.message);
                });
              }
            })
          } else {
              resultStatus.status = "User already exist"
            return resultStatus
          }
        }) 
        return resultStatus
    }
}