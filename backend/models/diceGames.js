const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: { type: Number, unique: true, required: true }, // Auto-incrementing ID
  players: [{ type: String, required: true }], // Array of player names
  rolls: [
    {
      // Array of roll objects
      playerName: String,
      diceRoll: Number,
      totalSum: Number,
    },
  ],
});

gameSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  const lastGame = await Game.findOne().sort({ gameId: -1 }); // Get last game
  let newGameId = 1;
  if (lastGame) {
    newGameId = lastGame.gameId + 1;
  }
  this.gameId = newGameId;
  next();
});

module.exports = mongoose.model('Game', gameSchema);
