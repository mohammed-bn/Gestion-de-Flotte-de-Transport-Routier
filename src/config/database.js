const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("connected");
  } catch (err) {
    console.error("makaynch connex");
    process.exit(1);
  }
};

module.exports = connectDB;