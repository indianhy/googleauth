const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId:{
        type:String,
        required:true
    },
    name: String,
    image: String,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
