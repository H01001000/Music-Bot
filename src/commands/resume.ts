import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { interactionPreprocessing } from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes playing the current song'),
  async execute(interaction: ChatInputCommandInteraction) {
    const { skip, player, newPlayer } = interactionPreprocessing(interaction);
    if (skip) return;
    if (newPlayer) {
      interaction.reply({ content: 'No music is playing', ephemeral: true });
      return;
    }
    player.play();
    interaction.reply({ content: 'resumed playing song', ephemeral: false });
  },
};
