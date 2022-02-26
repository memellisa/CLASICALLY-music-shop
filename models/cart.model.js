
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    musicId: { type : String , required : true },
    musicName: { type : String , required : true },
    musicPrice: { type : Number , required : true },
    username: { type : String , required : true },
    quantity: { type : Number , required : true },
});

module.exports = mongoose.model('Cart', cartSchema)