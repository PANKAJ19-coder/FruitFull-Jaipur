const mongoose= require('mongoose');

const reviewSchema= new mongoose.Schema({
    feedback:String
});
const Review= mongoose.model("Review", reviewSchema);
module.exports= Review;