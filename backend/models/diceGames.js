const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: { type: Number, unique: true, required: true },
  players: [{ type: String, required: true }],
  rolls: [
    {
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

  const lastGame = await Game.findOne().sort({ gameId: -1 });
  let newGameId = 1;
  if (lastGame) {
    newGameId = lastGame.gameId + 1;
  }
  this.gameId = newGameId;
  next();
});

module.exports = mongoose.model('Game', gameSchema);
