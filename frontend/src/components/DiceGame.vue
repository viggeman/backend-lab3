<template>
  <h1 class="title">Dice game DELUXE</h1>
  <div class="container">
    <div class="player-section">
      <div class="player-name">
        <p v-if="playerName">Welcome {{ playerName }}!</p>
        <p v-else>Set player name</p>
        <div v-if="!playerName">
          <input
            type="text"
            :id="playerNameInput"
            v-model="playerNameInput"
            placeholder="Enter Name"
            class="input"
          />
          <button class="button" @click="setPlayerName">Submit</button>
        </div>
      </div>

      <div v-if="playerName" class="dice-game">
        <button class="button" @click="rollDice">Throw Dice</button>
        <div v-if="diceRollResult" class="result">
          <ul>
            <li v-for="(roll, index) in diceRollResult" :key="index">
              {{ roll.name }}: {{ roll.roll }} (Total: {{ roll.totalSum }})
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="playerName" class="chat-window">
      <h2>Chat</h2>
      <div class="chat-messages" ref="chatWindow">
        <ul>
          <li
            v-for="(comment, index) in chatMessages"
            :key="index"
            class="comment-item"
          >
            {{ comment.name }}: {{ comment.message }}
          </li>
        </ul>
      </div>
      <div class="chat-input">
        <input
          type="text"
          v-model="message"
          placeholder="Enter chat message"
          class="input"
        />
        <button class="button" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, nextTick } from 'vue';
  import io from 'socket.io-client';

  const socket = io('http://localhost:3000'); // Connect to the server
  const diceRollResult = ref([]);
  const message = ref('');
  const chatMessages = ref([]);
  const playerNameInput = ref('');
  const playerName = ref('');
  const chatWindow = ref(null);

  const setPlayerName = () => {
    socket.emit('setPlayerName', playerNameInput.value);
    playerName.value = playerNameInput.value;
    playerNameInput.value = '';
  };

  const rollDice = () => {
    socket.emit('diceRoll');
  };

  const sendMessage = () => {
    if (message.value) {
      socket.emit('message', message.value);
      message.value = '';
    }
  };

  const addMessage = (message) => {
    chatMessages.value.push(message);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    nextTick(() => {
      chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
    });
  };

  socket.on('diceRollResult', (data) => {
    console.log(data);
    diceRollResult.value.push(data);
  });

  socket.on('newMessage', (data) => {
    addMessage(data);
  });
</script>

<style scoped>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .dice-game {
    padding: 20px;
  }

  .button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .button:disabled {
    background-color: #ccc;
  }

  .result {
    margin-top: 10px;
    font-weight: bold;
  }

  .comments {
    margin-bottom: 20px;
  }

  .input {
    padding: 10px;
    width: 200px;
    margin-right: 10px;
  }

  .comment-item {
    margin-bottom: 10px;
  }

  .chat-window {
    width: 400px;
    height: 400px;
    background-color: #ccc;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
  }

  .chat-messages {
    flex: 1;
    overflow-y: scroll;
    padding: 10px;
  }

  .chat-input {
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .chat-input input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
</style>
