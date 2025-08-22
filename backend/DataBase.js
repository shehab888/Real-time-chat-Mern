const mongoose = require('mongoose')
const ConnectDB= async()=>{
    try{
    const url=process.env.MONGO_URL
    // console.log(url);
    
    await mongoose.connect(url)
    console.log(`Data Base connection esatblished`);

    }catch(error){
        // if the main connection of the cluster failed use the local 
        const localUrl=process.env.MONOGO_LOCAL_URL
        await mongoose.connect(localUrl)
        console.log(`Database faild to establish ${error.message} and connected to the local database`);   
    }

}
module.exports=ConnectDB

