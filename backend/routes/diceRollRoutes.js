const express = require('express');
const router = express.Router();
const DiceRoll = require('../models/diceRoll');

router.get('/dice-rolls', async (req, res) => {
  try {
    const diceRolls = await DiceRoll.find();
    res.json(diceRolls);
  } catch (err) {
    console.error('Error getting diceroll:', err);
    res.status(500).send('server error');
  }
});

module.exports = router;
