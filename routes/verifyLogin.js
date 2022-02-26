var express = require('express');
var router = express.Router();
var user = require('../models/user.model');

/*
* POST to add commodity
*/
router.post('/login/submit', async (req, res) => {
    var addRecord = new req.login({
        username: req.body.username,
        password: req.body.password,
    });

    try {
        const result = await user.find({username});
        if (result == null) {
            await addRecord.save(function (err, result) {
                res.send((err === null) ? { msg: 'login successful' } : { msg: err });
            });
          return 'user not found';
        } else {
            return result;
        }

    } catch (err) {
      return err;
    }
    //add new commodity document
    
  });

module.exports = router;