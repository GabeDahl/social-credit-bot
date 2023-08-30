import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { startBot } from './initialization.js';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  credential: applicationDefault(),
});

export const db = getFirestore();

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
startBot(client)
  .then(() => {
    console.log('Bot started successfully');
  })
  .catch();
