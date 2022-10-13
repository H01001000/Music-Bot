import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { PreprocessingResult } from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leaves the current voice channel'),
  async execute(interaction: ChatInputCommandInteraction, preprocessingResult: PreprocessingResult) {
    const { player, newPlayer } = preprocessingResult;
    if (newPlayer) {
      interaction.reply({ content: 'Current no in any voice channel', ephemeral: true });
      return;
    }
    player.leave();
    interaction.reply({ content: 'Leaved', ephemeral: false });
  },
};
