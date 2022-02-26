var express = require('express');
var router = express.Router();
var User = require('../models/user.model');

router.get('/', function(req, res, next) {
  res.render('pages/create.pug', { title: 'Classically - Create Account', loggedIn: false });
});
/*
* POST to add commodity
*/
router.post('/', async (req, res) => {
  console.log("input",req.body.username);
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
  })

  try {
    var result = await User.find({"username": newUser.username});
    console.log("result",result);
    if (result == ""){
      var createdUser = await newUser.save();
      res.send({ msg: '' });
    } else {
      res.send({ msg: 'fail' });
    }
    
  }catch (err){
    res.status(400).json({message: err.message})
  }
    
  
});

module.exports = router;