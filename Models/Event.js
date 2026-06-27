const { string } = require('joi');
const mongoose= require('mongoose');

const eventSchema= new mongoose.Schema({
    title:{
        type:String,
    },
    detail:{
        type:String
    }
});

const Event= mongoose.model('Event', eventSchema);
module.exports= Event;