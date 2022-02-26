var express = require('express');
var router = express.Router();
var User = require('../models/user.model');

router.get('/', (req, res, next) => {
    res.render('pages/login.pug', { title: 'Classically - Log In', loggedIn: false });
  });


// GET ALL user in the current database
router.get('/allUsername', async (req, res, next) => {
  try {
    var result = await User.find();
    res.send(result);
  }catch (err){
    res.status(400).json({message: err.message});
  }

});
/*
* POST to add login
*/
router.post('/', async (req, res) => {
    var user = new User({
      username: req.body.username,
      password: req.body.password,
    })
  
    
    try {
        var result = await User.find({"username": user.username, "password": user.password});
        console.log("result: ", result);
        if (result == ''){
            res.send({ msg: 'Invalid login, please login again.' });
        }else{
            req.session.user = user;
            let temp = req.session.carts;
            req.session.carts = [];
            res.send({ msg: '' , sessionCarts: temp });
        }
    }catch (err){
      res.status(400).json({message: err.message});
    }
    
  });

  module.exports = router;
