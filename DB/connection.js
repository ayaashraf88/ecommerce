import mongoose from "mongoose";
const db_connection=async()=>{
    // await mongoose.connect('mongodb://localhost:27017/ecommerce').then(console.log('connected'))
    // .catch((err)=>console.log("Connection Error : " , err))
    await mongoose.connect(process.env.mongodb_server).then(console.log('connected'))
    .catch((err)=>console.log("Connection Error : " , err)) 
}
export default db_connection;   