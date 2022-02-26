var express = require('express');
var router = express.Router();
var Cart = require('../models/cart.model');

// render cart page
router.get('/', async (req, res, next) => {
    if (req.session.user) {
        try {
            var result = await Cart.find( {username: req.session.user.username});
            console.log(result);
            res.render('pages/cart.pug', { title: 'Cart', loggedIn: true, carts: result });
            // res.send(result);
        } catch (err){
            res.status(400).json({message: err.message});
        }
        // req.cart.find( {username: req.session.user.username}, function(err, docs) {
        //   res.render('pages/cart.pug', { title: 'Cart', loggedIn: true, carts: docs });
        // })
    }
    else {
        console.log("HELOO")
        console.log(req.session.carts);
        res.render('pages/cart.pug', { title: 'Cart', loggedIn: false, carts: req.session.carts });
    }
});

router.get('/data', async (req, res, next) => {
    if (req.session.user) {
        try {
            var result = await Cart.find( {username: req.session.user.username});
            console.log(result);
            res.status(200).send({data: result});
            // res.send(result);
        } catch (err){
            res.status(400).json({message: err.message});
        }
        // req.cart.find( {username: req.session.user.username}, function(err, docs) {
        //   res.render('pages/cart.pug', { title: 'Cart', loggedIn: true, carts: docs });
        // })
    }
    else {
        console.log("HELOO")
        console.log(req.session.carts);
        res.status(200).send({data: req.session.carts});
    }
});

// GET all cart from current user
router.get('/all', async (req, res) => {
    if (req.session.user) {
        console.log(req.session.user.username);
        try {
            var result = await Cart.find( {username: req.session.user.username});
            console.log(result);
            res.send(result);
        } catch (err){
            res.status(400).json({message: err.message});
        }
    }
    else {
         res.send(req.session.carts);
    }
  }
);

router.post('/addToCart', async (req,res) => {
    
    
    var cart = new Cart(req.body);

    if (req.session.user) {
        cart.username = req.session.user.username;
        console.log(cart);
        var music = await Cart.findOne({musicName: cart.musicName});
        if (music){
            music.quantity += parseInt(req.body.quantity);
            await music.save();
            res.send({ msg: '' });
        } else {
            await cart.save((err, result) => {
                if (err === null) {
                    console.log("CART SAVED")
                    res.send({ msg: '' });
                }
                else{
                    res.send(err)
                }
            })
            
        }
        
    }
    else {
        var exist = false;
        console.log(cart);
        if (req.session.carts) {
            for(music of req.session.carts){
                if (music.musicName == cart.musicName){
                    music.quantity += cart.quantity;
                    exist = true;
                }
            }
            if (!exist){
                (req.session.carts).push(cart);

            }
            
            res.send({ msg: '' });
            // req.session.carts = temp;
            
        }
        else {
            // if there's empty cart
            let temp = [];
            temp.push(cart);
            req.session.carts = temp;
            res.send({ msg: '' });
        }
    }
})

router.delete('/delete/:id', async(req, res) => {
    if (req.session.user) {
        try {
            var result = await Cart.findByIdAndDelete(req.params.id);
            console.log(result);
            res.send("result");
        } catch (err){
            res.status(400).json({message: err.message});
        }
    }
    else {
        let counter = 0;
        let array = req.session.carts;
        for (x in array) {
            if (array[x]._id === req.params.id) {
                array.splice(x, 1);
            }
        }
        req.session.carts = array;
        res.send({msg:''});
        // res.render('pages/cart.pug', { title: 'Cart', loggedIn: false, carts: req.session.carts });
    }
})



module.exports = router;