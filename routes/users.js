var express = require('express');
var router = express.Router();
var UserSchema = require('../public/javascripts/models/UserSchema')
require('../public/javascripts/services/connection')
var bcrypt = require('bcrypt')
var saltRouds = 10

router.post('/signup', async function( req, res, next){
  console.log('hello')

  var newUser = new UserSchema({
   email : req.body.email,
   name : req.body.name,
   password : req.body.password,
  });

    await Users.findOne({email: newUser.email})
    .then(async chk => {
      if(!chk) {
        bcrypt.hash(newUser.password, saltRouds, async (err, hash) => {
          if(err) {
            console.log(err)
          }
          else {
            newUser.password = hash;
            await newUser
            .save()
            .then(() => {
              res.send(newUser);
            })
            .catch(err => {
              console.log("Error is ", err.message);
            });
          }
        })
      } else {
        res.send("User already exist")
      }
    }) 
})

router.post('/loginUser', async (req, res)=>{
  var newUser = {
    email: req.body.email,
    password: req.body.password
  }
  await Users.findOne({email: newUser.email})
  .then(chk => {
    if(!chk) {
      res.send('User not exist')
    }
    else {
      bcrypt.compare(
        newUser.password,
        chk.password,
        async (err, result) =>{
          if(err) {
            console.log(err)
          }
         else if(result === true) {    
            res.send("User authenticated")
          }
          else {
            res.send("Unauthorized access")
          }
        }
      )
    } 
  })
  .catch(err => {
    console.log("Error is ", err.message);
  });
})

module.exports = router;
