import 'dotenv/config';
import { initDiscordClient } from './services/discord/init.js';
import { NlpMachine } from './models/message-analysis/NlpMachine.js';
import { messageHandler } from './services/discord/events/message-handler.js';
import { Client, Events, Guild } from 'discord.js';
import { positiveStatements } from './services/message-analysis/training-data/positive.js';
import { TrainingDocument } from './models/message-analysis/TrainingDocument.js';
import { negativeStatements } from './services/message-analysis/training-data/negative.js';
import { neutralStatements } from './services/message-analysis/training-data/neutral.js';
import { syncUsers } from './services/firebase/users.js';
import { interactionHandler } from './services/discord/events/interaction.js';

export const startBot = async (client: Client, nlpMachine: NlpMachine) => {
  client.once(Events.GuildCreate, async ({ members, available }: Guild | Partial<Guild>) => {
    if (available === false || !members) return;
    await members.fetch();
    const nonBotMembers = members.cache.filter((member) => !member.user.bot);
    const nonBotIds = nonBotMembers.map((member) => member.id);
    if (nonBotIds.length === 0) return;
    await syncUsers(nonBotIds);
  });
  client.addListener(Events.MessageCreate, (msg) => messageHandler(msg, client, nlpMachine));
  client.addListener(Events.InteractionCreate, (interaction) => interactionHandler(interaction));
  await initDiscordClient(client);
};
export const trainMachine = async (nlpMachine: NlpMachine) => {
  const docs: TrainingDocument[] = [];
  positiveStatements.forEach((stmt) => {
    docs.push({ locale: 'en', intent: 'positive', utterance: stmt });
  });
  negativeStatements.forEach((stmt) => {
    docs.push({ locale: 'en', intent: 'negative', utterance: stmt });
  });
  neutralStatements.forEach((stmt) => {
    docs.push({ locale: 'en', intent: 'None', utterance: stmt });
  });
  nlpMachine.loadData(docs);
  return await nlpMachine.train();
};
