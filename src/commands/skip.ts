import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { PreprocessingResult } from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips to the next song in the queue'),
  async execute(interaction: ChatInputCommandInteraction, preprocessingResult: PreprocessingResult) {
    const { player, newPlayer } = preprocessingResult;
    if (newPlayer) {
      interaction.reply({ content: 'No music is playing', ephemeral: true });
      return;
    }
    player.skip();
    interaction.reply({ content: 'Skiped', ephemeral: false });
  },
};
