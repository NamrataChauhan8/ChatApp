const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://namratac:Namrata@cluster0.nte2w9a.mongodb.net/ChatApp');

const database= mongoose.connection;

database.on("error",console.error.bind(console,"MongoDb connection error:"));
database.once("open",()=>{
    console.log("Successfully Connected to Mongodb");
})

module.exports=database;