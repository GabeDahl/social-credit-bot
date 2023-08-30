import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Message } from 'discord.js';
import { NlpMachine } from '../../../models/message-analysis/NlpMachine.js';
import { adjustScore } from '../../firebase/scoresAdjustments.js';
import { InteractionCustomIds } from './interaction.js';

export enum BOT_UTTERANCES {
  NoMentionNeeded = `There is no need for mentions or slash commands. I am always watching.`,
  PositiveStatementDetected = `Pro-state sentiment detected. We appreciate your compliance. Social credit increased.`,
  NegativeStatementDetected = `This message has been flagged. Your social credit has decreased by 10. Further unsanctioned discourse may result in censorship.`,
}

export const messageHandler = async (msg: Message, client: Client, nlpMachine: NlpMachine) => {
  if (msg.author.bot || msg.system) return;
  const extraMessages: string[] = [];
  if (client.user && msg.mentions.has(client.user)) {
    extraMessages.push(BOT_UTTERANCES.NoMentionNeeded);
  }
  const { intent, score } = await nlpMachine.process(msg.content);
  console.log(`intent: ${intent} -- score: ${score}`);
  const isSignificant = score > 0.99;

  const generateReport = new ButtonBuilder()
    .setCustomId(InteractionCustomIds.GenerateReport + '-' + msg.author.id)
    .setLabel('Generate Report')
    .setStyle(ButtonStyle.Primary);
  const appeal = new ButtonBuilder()
    .setCustomId(InteractionCustomIds.Appeal + '-' + msg.author.id)
    .setLabel('Appeal Score Adjustment')
    .setStyle(ButtonStyle.Danger);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(generateReport, appeal);

  if (isSignificant && intent === 'positive') {
    await adjustScore({ amount: 10, userId: msg.author.id });
    msg.reply({
      content: BOT_UTTERANCES.PositiveStatementDetected,
      components: [row],
    });
  } else if (isSignificant && intent === 'negative') {
    await adjustScore({ amount: -10, userId: msg.author.id });
    msg.reply({
      content: BOT_UTTERANCES.NegativeStatementDetected,
      components: [row],
    });
  }

  extraMessages.forEach((m) => {
    msg.reply(m);
  });
};
