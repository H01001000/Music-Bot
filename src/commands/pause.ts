import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import Players from '../Players';

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the current song'),
  async execute(interaction: CommandInteraction) {
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
      interaction.reply({ content: 'No music is playing', ephemeral: true });
      return;
    }
    player.pause();
    interaction.reply({ content: 'paused playing song in queue', ephemeral: false });
  },
};
