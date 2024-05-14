const mongoose = require('mongoose');

const connectionMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/diceGame');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectionMongoDB;
