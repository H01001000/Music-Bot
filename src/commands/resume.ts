import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { PreprocessingResult } from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes playing the current song'),
  async execute(interaction: ChatInputCommandInteraction, preprocessingResult: PreprocessingResult) {
    const { player, newPlayer } = preprocessingResult;
    if (newPlayer) {
      interaction.reply({ content: 'No music is playing', ephemeral: true });
      return;
    }
    player.play();
    interaction.reply({ content: 'resumed playing song', ephemeral: false });
  },
};
