import readline from "readline";

import { WSManager } from './wsManager.js';

const ws = new WSManager("localhost", 3333);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to process user input
const processInput = (input: string) => {
  if (input === "exit") {
    console.log("Shutting down...");
    rl.close();
    process.exit(0);
  }

  if (ws.isConnected) {
    ws.sendChatMessage(input);
  } else {
    console.log("Not connected to the server.");
  }
};

rl.setPrompt("");
rl.prompt();
rl.on("line", (input) => {
  processInput(input.trim());
  rl.prompt();
});