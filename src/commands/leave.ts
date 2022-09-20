import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Players from '../structure/Players';

export default {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leaves the current voice channel'),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      interaction.reply({ content: 'You are not currently in a guild!', ephemeral: true });
      return;
    }
    const voiceChannel = interaction.guild.members.cache
      .get(interaction.user.id)?.voice.channel;

    if (!voiceChannel) {
      interaction.reply({ content: 'You are not currently in a voice channel!', ephemeral: true });
      return;
    }
    const player = Players.get(interaction.guild.id);
    if (!player) {
      interaction.reply({ content: 'Current no in any voice channel', ephemeral: true });
      return;
    }
    player.leave();
    interaction.reply({ content: 'Skiped', ephemeral: false });
  },
};
