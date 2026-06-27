const mongoose= require('mongoose');

const PlantSchema= new mongoose.Schema({
    image:{
        filename:String,
        url:String,
    },
    name:{
        type:String
    },
    desc:{
        type:String
    }
});

const Plant= mongoose.model("Plant", PlantSchema);
module.exports= Plant;
