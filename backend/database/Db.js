const {mongoose,dbConnectionString} = require("../config/Constant");

mongoose.connect(dbConnectionString);

const database= mongoose.connection;

database.on("error",console.error.bind(console,"MongoDb connection error:"));
database.once("open",()=>{
    console.log("Successfully Connected to Mongodb");
})

module.exports=database;