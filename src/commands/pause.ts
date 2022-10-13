import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { PreprocessingResult } from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the current song'),
  async execute(interaction: ChatInputCommandInteraction, preprocessingResult: PreprocessingResult) {
    const { player, newPlayer } = preprocessingResult;
    if (newPlayer) {
      interaction.reply({ content: 'No music is playing', ephemeral: true });
      return;
    }
    player.pause();
    interaction.reply({ content: 'paused playing song in queue', ephemeral: false });
  },
};
