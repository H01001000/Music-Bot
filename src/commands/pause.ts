import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { interactionPreprocessing } from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the current song'),
  async execute(interaction: ChatInputCommandInteraction) {
    const {
      skip, player, newPlayer,
    } = interactionPreprocessing(interaction);
    if (skip) return;
    if (newPlayer) {
      interaction.reply({ content: 'No music is playing', ephemeral: true });
      return;
    }
    player.pause();
    interaction.reply({ content: 'paused playing song in queue', ephemeral: false });
  },
};
