var express = require('express');
var router = express.Router();
// const session = require("express-session");

router.get('/:message', (req,res) => {
    console.log("redirect", req.params.message);
    var message;
    if (req.params.message == "logout"){
        req.session.destroy();
        message = "Logging out";
    } else if (req.params.message == "invalid-login"){
        message = 'Invalid login, please login again.';
        
    } else if (req.params.message == "account-existed"){
        message = 'Account already existed';
    }
    else if (req.params.message == "account-created"){
        message = 'Account created! Welcome';
    }
    res.render('pages/redirect.pug', { title: 'Redirecting',  message: message });
    
});

module.exports = router;