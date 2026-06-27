const mongoose= require("mongoose");
const Plant= require('../Models/Plants.js');
const {data}= require('./data.js');

async function connect(){
    await mongoose.connect('mongodb://127.0.0.1/FFJ');
}
connect().then(console.log("Database connected"))
.catch((err)=>console.log(err));

async function insert(){
    await Plant.deleteMany();
    await Plant.insertMany(data).then((res)=>console.log(res));
}
insert();