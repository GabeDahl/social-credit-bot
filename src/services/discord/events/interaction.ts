import { Colors, EmbedBuilder, Interaction } from 'discord.js';
import { getUser } from '../../firebase/users.js';

export enum InteractionCustomIds {
  GenerateReport = 'generateReport',
  Appeal = 'appeal',
}

export const interactionHandler = async (interaction: Interaction) => {
  if (!interaction.isButton()) return;

  await interaction.deferReply();
  console.log(`button ${interaction.customId}`);
  const user = await getUser(interaction.user.id);

  switch (interaction.customId) {
    case InteractionCustomIds.GenerateReport:
      {
        if (!user) return;
        const embed = new EmbedBuilder()
          .setColor(Colors.DarkButNotBlack)
          .setTitle('Social Credit Report')
          .setAuthor({
            name: 'The Credit Bureau',
            iconURL: 'https://cdn.theorg.com/055eaccb-c323-44ea-9240-489e9926d960_medium.jpg',
          })
          .addFields([
            {
              name: 'Your Social Credit Score',
              value: String(user.socialCreditScore),
            },
          ]);
        interaction.followUp({
          embeds: [embed],
        });
      }

      break;
    case InteractionCustomIds.Appeal:
      interaction.followUp(`Appeal received. We'll review and notify you of our decision.`);
      setTimeout(() => {
        interaction.followUp('Your appeal has been rejected.');
      }, 5000);
      break;
    default:
      break;
  }
};
