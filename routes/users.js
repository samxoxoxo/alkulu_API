var express = require('express');
var router = express.Router();
var UserSchema = require('../public/javascripts/models/UserSchema')
require('../public/javascripts/services/connection')
const loginService = require('../public/javascripts/services/loginService');


router.post('/signup', async function( req, res, next){

  var newUser = new UserSchema({
   email : req.body.email,
   name : req.body.name,
   password : req.body.password,
  })
  var ress = await loginService.signup(newUser.email, newUser.password, newUser.name)
  res.send(ress)
})

router.post('/loginUser', async (req, res)=>{
  var newUser = new UserSchema({
    email: req.body.email,
    password: req.body.password
  })
    var ress  =  await loginService.login(newUser.email, newUser.password) 
    res.send(ress)
})

module.exports = router;
