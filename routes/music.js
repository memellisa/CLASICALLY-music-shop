var express = require('express');
var router = express.Router();
var Music = require('../models/music.model');

router.get('/', async (req,res) => {
    console.log("hello")
    await Music.find( (err, docs) => {
        if (err === null) {
            res.send(docs);            
        }
        else
            res.send("");
      }); 
})

router.get('/:id', async(req, res, next) =>{
    try{
        var music = await Music.findById(req.params.id);
        // console.log(musics);
        // for (var music of musics){
        //     console.log(music)
        // }
        console.log(music)
        // res.json(subscribers)
        if (req.session.user) {
            res.render('pages/music.pug', { title: 'Classically - '+music.name, name: music.name, music: music, loggedIn: true });
        } else {
            res.render('pages/music.pug', { title: 'Classically - '+music.name, name: music.name, music: music, loggedIn: false });
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});


module.exports = router;