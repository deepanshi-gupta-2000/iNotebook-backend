const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type : String,
        required : true
    }, // String is shorthand for {type: String}
    email : {
        type : String,
        required : true,
        unique : true
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    password : {
        type : String,
        required : true
    }
  });


module.exports = mongoose.model('user', UserSchema); // 1st arg is name of model which we want, instead of 
// user it can be ram, shyam anything
// and next arg is name of schema for which we want to create model.
