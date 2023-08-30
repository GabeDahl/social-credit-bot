import 'dotenv/config';
import { initDiscordClient } from './services/discord/init.js';
import { messageHandler } from './services/discord/events/message-handler.js';
import { Client, Events, GuildMemberManager } from 'discord.js';
import { syncUsers } from './services/firebase/users.js';
import { interactionHandler } from './services/discord/events/interaction.js';

export const startBot = async (client: Client) => {
  client.once(Events.ClientReady, async () => {
    for (const guild of client.guilds.cache.values()) {
      if (guild.available) {
        await fetchAndSyncUsers(guild.members);
      }
    }
  });
  client.addListener(Events.MessageCreate, (msg) => messageHandler(msg, client));
  client.addListener(Events.InteractionCreate, (interaction) => interactionHandler(interaction));
  await initDiscordClient(client);
};

async function fetchAndSyncUsers(members: GuildMemberManager) {
  await members.fetch();
  const nonBotMembers = members.cache.filter((member) => !member.user.bot);
  const nonBotIds = nonBotMembers.map((member) => member.id);
  if (nonBotIds.length === 0) return;
  await syncUsers(nonBotIds);
}
