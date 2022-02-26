var express = require('express');
var router = express.Router();
// var User = require('../models/user.model');

router.get('/', (req,res) => {
    req.session.destroy();
    // res.send(req);
    res.render('pages/logout.pug')
    // setTimeout(function(){ res.render('pages/main.pug'); }, 3000); 
});

// router.post('/', (req,res) => {
//     res.redirect('/logout');
    
// })

module.exports = router;