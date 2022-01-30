import {connect} from "mongoose"
import {DB_URL} from "./key_var"

const connectRetry = () => {
 console.log("Giving it another shot.. Retrying")
 return connect(DB_URL, {
  keepAlive: 1,
  useNewUrlParser: true,
  useUnifiedTopology:true
 })
}

const dbConnect = async () => {
 try {
   await connect(DB_URL, {
     useNewUrlParser: true,
     useUnifiedTopology: true
   });
   console.log("Database connected successfully.")
 } catch (err) {
   console.log(`Mongoose connection was not succesful due to: ${err}`);
   setTimeout(connectRetry, 7000);
 }
};

export default dbConnect