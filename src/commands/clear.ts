import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { interactionPreprocessing } from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears all songs in the queue'),
  async execute(interaction: ChatInputCommandInteraction) {
    const { skip, player } = interactionPreprocessing(interaction);
    if (skip) return;
    player.queue.clear();
    interaction.reply({ content: 'Cleared queue', ephemeral: false });
  },
};
