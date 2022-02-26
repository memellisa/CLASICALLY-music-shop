
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var musicSchema = new Schema({
    // musicId: String,
    name:  { type : String , required : true },
    category: String,
    composer: String,
    description: String,
    price: Number,
    published: String,
    newArrival: String,
    image: String,
    clip: String,
    link: String,

});

module.exports = mongoose.model('Music', musicSchema)