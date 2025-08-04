const mongoose = require("mongoose");

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log("db connection success"))
    .catch((err)=>{
        console.log("db connection error");
        console.error(err);
        process.exit(1);
    })
};