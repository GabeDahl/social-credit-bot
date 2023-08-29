import { Client } from 'discord.js';

export const initDiscordClient = async (client: Client) => {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error('Discord token not provided.');
  }

  await client.login(token);
};
