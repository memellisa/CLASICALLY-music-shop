var express = require('express');
var router = express.Router();

// // render invoice page
// router.get('/', function(req, res, next) {
//     console.log(req.body);
//     res.render('pages/invoice.pug', { title: 'Invoice Classically', data: req.body });
// });

// post to invoice page 
router.post('/', function(req, res, next) {
    console.log("BODY INVOICE")
    console.log(req.body);
    if (req.session.user) {
        req.cart.deleteMany({userId:req.session.user.username}, function(err, docs) {
            // res.send((err==null) ? { msg: "" } : { msg: err });
        })
    }
    req.session.carts = [];
    res.render('pages/invoice.pug', { title: 'Classically - Invoice', data: req.body });
});

module.exports = router;