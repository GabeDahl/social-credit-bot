import { Colors, EmbedBuilder, Interaction } from 'discord.js';
import { getUser } from '../../firebase/users.js';

export enum InteractionCustomIds {
  GenerateReport = 'generateReport',
  Appeal = 'appeal',
}

export const interactionHandler = async (interaction: Interaction) => {
  if (!interaction.isButton()) return;

  await interaction.deferReply({ ephemeral: true });
  console.log(`button ${interaction.customId}`);
  const interactionIdAndUserId = interaction.customId;
  const lastHyphenIndex = interactionIdAndUserId.lastIndexOf('-');
  const base = interactionIdAndUserId.substring(0, lastHyphenIndex);
  const userId = interactionIdAndUserId.substring(lastHyphenIndex + 1);
  console.log(base);
  console.log(userId);
  if (interaction.user.id !== userId) {
    console.log('mismatch');
    await interaction.followUp('not your button to press, pal');
  }

  const user = await getUser(interaction.user.id);

  switch (base) {
    case InteractionCustomIds.GenerateReport:
      {
        if (!user) return;
        const embed = new EmbedBuilder()
          .setColor(Colors.DarkButNotBlack)
          .setTitle('Social Credit Report')
          .setAuthor({
            name: 'The Credit Bureau',
            iconURL: 'https://b.thumbs.redditmedia.com/J36LSECOx8ukkKWTMoGmNyi15-esVGRo194wLYiI3rw.png',
          })
          .addFields([
            {
              name: 'Your Social Credit Score',
              value: String(user.socialCreditScore),
            },
          ]);
        await interaction.followUp({
          embeds: [embed],
        });
      }

      break;
    case InteractionCustomIds.Appeal:
      setTimeout(async () => {
        await interaction.followUp({
          ephemeral: true,
          content: 'Your appeal has been rejected.',
        });
      }, 5000);
      break;
    default:
      break;
  }
};
