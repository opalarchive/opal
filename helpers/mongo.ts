import mongoose from "mongoose";

let connected = false;

const connectdb = async () => {
  if (connected) {
    return;
  }

  const db = await mongoose.connect("mongodb://localhost:27017/dev", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  connected = db.connection.readyState !== 0;
};

export default connectdb;
