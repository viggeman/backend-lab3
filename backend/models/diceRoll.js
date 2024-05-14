const mongoose = require('mongoose');

const diceRollSchema = new mongoose.Schema({
  playerName: String,
  diceRoll: Number,
  totalSum: Number,
});

module.exports = mongoose.model('DiceRoll', diceRollSchema);
