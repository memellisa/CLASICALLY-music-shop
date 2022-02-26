var express = require('express');
var router = express.Router();

// render cart page
router.get('/', function(req, res, next) {
    if (req.session.user) {
        req.cart.find( {username: req.session.user.username}, function(err, docs) {
            let total = 0;
            console.log("find MY CART")
            console.log(docs);
            for (x in docs) {
                console.log(x);
                total += docs[x].quantity * parseInt(docs[x].musicPrice);
                console.log(total);
            } 
            res.render('pages/checkout.pug', { title: 'Cart', loggedIn: true, carts: docs, total: total });
        })
    }
    else {
        let total = 0;
        for (x in req.session.carts) {
            total += req.session.carts[x].quantity * parseInt(req.session.carts[x].musicPrice);
            console.log(total);
        } 
        res.render('pages/checkout.pug', { title: 'Cart', loggedIn: false, carts: req.session.carts, total: total });
    }
});


module.exports = router;