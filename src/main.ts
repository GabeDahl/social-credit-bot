import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { NlpMachine } from './models/message-analysis/NlpMachine.js';
import { startBot, trainMachine } from './initialization.js';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  credential: applicationDefault(),
});

export const db = getFirestore();

const nlpMachine = new NlpMachine();
trainMachine(nlpMachine);
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildIntegrations,
  ],
});
startBot(client, nlpMachine)
  .then(() => {
    console.log('Bot started successfully');
  })
  .catch();
