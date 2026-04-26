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
        image: obj.image.url,
        owner:"69ea646ee9a973fddfc47af4" 
    }));
    await Listing.insertMany(initData.data);
    console.log("database initialized with sample data");
}
initDB();