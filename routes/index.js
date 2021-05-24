var express = require('express');
var router = express.Router();
var User = require('../public/javascripts/models/UserSchema') 
var Posts = require('../public/javascripts/models/PostSchema') 
var commentSchema = require('../public/javascripts/models/commentSchema')
/* GET home page. */

router.get('/', async function(req, res, next) {
  res.send('API running');
});


module.exports = router;
