var express = require('express');
var router = express.Router();
var User = require('../public/javascripts/models/Users') 
/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
