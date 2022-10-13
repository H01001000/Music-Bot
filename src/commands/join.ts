import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { PreprocessingResult } from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins your current voice channel'),
  async execute(interaction: ChatInputCommandInteraction, preprocessingResult: PreprocessingResult) {
    const { voiceChannel, player } = preprocessingResult;
    player.join(voiceChannel);
    interaction.reply({ content: `Joined ${voiceChannel.name}`, ephemeral: false });
  },
};
