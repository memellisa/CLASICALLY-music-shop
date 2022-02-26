var express = require('express');
var router = express.Router();
var Music = require('../models/music.model');

router.get('/', async (req, res, next) => {
    try{
        var musics = await Music.find();
        var categories = []

        for (let music of musics){
            if (!categories.includes(music.category)){
                categories.push(music.category);
            }
        }

        if (req.session.user) {
            res.render('pages/main.pug', { title: 'Classically', filter: 'Music', categories: categories, musics: musics, loggedIn: true });
        }
        else {
            res.render('pages/main.pug', { title: 'Classically', filter: 'Music', categories: categories, musics: musics, loggedIn: false });
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
    
});

router.get('/data',  async(req, res, next) =>{
    await Music.find((err, docs) => {
        if (!err) {
            res.send({data:docs})
        } else {
            res.send({data:err});
        }
    })
});

router.get('/category/:category', async(req, res, next) => {
    try{
        var category = req.params.category;
        // if (category == "late-19th"){
        //     category = "Late 19th"encodeURIComponent(result)
        // }
        console.log(category)
        // console.log(category);
        var musics = await Music.find({"category": category});
        var categories = [];
        var allMusics = await Music.find();
        // console.log(musics);
        // for (var music of musics){
        //     console.log(music)
        // }
        for (let music of allMusics){
            if (!categories.includes(music.category)){
                categories.push(music.category);
            }
        }

        console.log(musics)
        // res.json(subscribers)
        res.render('pages/main.pug', { title: 'Classically - Category', categories: categories,filter: category, musics: musics });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// router.get('/find/:keywords', async(req, res, next) => {
//     try{

//         const keywords = req.params.keywords.split(' ');
//         var result = [];
//         var musics = await Music.find();
//         for (let music of musics){
//             for(let keyword of keywords){
//                 if (music.name.includes(keyword) || music.composer.includes(keyword)){
//                     result.push(music);
//                 }
//             }
//         }
//         // res.json(subscribers)
//         res.render('pages/main.pug', { title: 'Classically', filter: "", musics: result });
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// });





// /*
// * POST to add commodity
// */
router.post('/', async (req, res) => {
    var newMusic = new Music({
        name: req.body.name,
        category: req.body.category,
        composer: req.body.composer,
        description: req.body.description,
        price:  req.body.price,
        published:  req.body.published,
        newArival:  req.body.newArrival,
        image: req.body.image,
        clip: req.body.clip,
        link:  req.body.link,
    })
  
    
    try {
        // var result = await Music.find({"username": newUser.username});
        var result = "";
        if (result == ""){
          var createdUser = await newMusic.save();
          res.send({ msg: 'Account created! Welcome' });
        } else {
          res.send({ msg: 'Account already existed' });
        }
        
      }catch (err){
        res.status(400).json({message: err.message})
      }
    
  });
  
  module.exports = router;