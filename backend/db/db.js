const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.mongo_user);
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch(error){
        console.error({message: error.message});
        process.exit(1)
    }
}

module.exports = {connectDb}