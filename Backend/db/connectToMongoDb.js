import mongoose from "mongoose";
const connectToMongoDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected");
        
    } catch (error) {
        console.log("Error connecting to mongodb",error.message);
    }
};

export default connectToMongoDb;