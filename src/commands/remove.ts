import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { PreprocessingResult } from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes the song with the given ID in the queue')
    .addIntegerOption((option) => option.setName('index').setDescription('The index of the song you want to remove').setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction, preprocessingResult: PreprocessingResult) {
    const { player, newPlayer } = preprocessingResult;
    if (newPlayer) {
      interaction.reply({ content: 'no music in queue', ephemeral: true });
      return;
    }
    const index = interaction.options.getInteger('index', true);
    if (player.queue.size < index) {
      interaction.reply({ content: 'index out of range', ephemeral: true });
      return;
    }
    player.queue.remove(index - 1);
    interaction.reply({ content: 'removed', ephemeral: false });
  },
};
