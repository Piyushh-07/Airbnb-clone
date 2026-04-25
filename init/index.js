const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../model/listings.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main()
.then(()=>{
    console.log("connected to the database")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj, 
        owner:"64b8c9e5f1a4c3e5d6a7b8c" 
    }));
    await Listing.insertMany(initData.data);
    console.log("database initialized with sample data");
}
initDB();