import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { PreprocessingResult } from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears all songs in the queue'),
  async execute(interaction: ChatInputCommandInteraction, preprocessingResult: PreprocessingResult) {
    const { player } = preprocessingResult;
    player.queue.clear();
    interaction.reply({ content: 'Cleared queue', ephemeral: false });
  },
};
