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
   admin: false
  })
  var ress = await loginService.signup(newUser.email, newUser.password, newUser.name)
  res.send(ress)
})

router.post('/loginUser', async (req, res)=>{
  
  var email = req.body.email
  var password = req.body.password
  
    await loginService.login(email, password, res) 
    
})

router.post('/checkUser', async (req, res)=>{
    var id = req.body.id

  await loginService.getPersonalDetail(id, res) 
    
})
router.post('/checkAdmin', loginService.auth,  async (req, res, next) => {
  if(req.user.admin === true) {
    res.send({status: "isAdmin"})
  }
  else {
    res.send({status: "notAdmin"})
  }
})
router.post("/refresh", async (req,res,next)=>{
  var refreshToken = req.body.token;
   await loginService.refresh(refreshToken, res)
})

module.exports = router;
