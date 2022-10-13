import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { interactionPreprocessing } from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins your current voice channel'),
  async execute(interaction: ChatInputCommandInteraction) {
    const { skip, voiceChannel, player } = interactionPreprocessing(interaction);
    if (skip) return;
    player.join(voiceChannel);
    interaction.reply({ content: `Joined ${voiceChannel.name}`, ephemeral: false });
  },
};
