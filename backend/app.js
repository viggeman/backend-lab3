const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const diceRollRoutes = require('./routes/diceRollRoutes');
const DiceRoll = require('./models/diceRoll');
// const Game = require('./models/diceGame');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let playerName;

  // Set playername
  socket.on('setPlayerName', (name) => {
    playerName = name;
    console.log('User changed name to: ', playerName);
  });

  // Roll Dice

  socket.on('diceRoll', async () => {
    const roll = Math.floor(Math.random() * 6) + 1;

    try {
      // Get existing rolls for the player
      const existingRolls = await DiceRoll.find({ playerName });

      let totalSum = 0;
      if (existingRolls.length > 0) {
        // Calculate total sum from existing rolls
        totalSum = existingRolls.reduce((acc, roll) => acc + roll.diceRoll, 0);
      }

      totalSum += roll; // Add current roll to total

      const newDiceRoll = new DiceRoll({
        playerName,
        diceRoll: roll,
        totalSum,
      });

      await newDiceRoll.save();

      console.log('Dice roll saved: ', newDiceRoll);

      io.emit('diceRollResult', { roll, name: playerName, totalSum });
    } catch (err) {
      console.error('Fel vid spara tärningskast:', err);
    }
  });

  // Chat message
  socket.on('message', (message) => {
    io.emit('newMessage', { message, name: playerName });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  });
});

app.use(cors());
app.use(express.json());
app.use('/api', diceRollRoutes);

const connectionMongo = require('./connectionMongo');
connectionMongo();

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
