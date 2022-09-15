import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import Players from '../Players';
import Player from '../util/Player';

export default {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins your current voice channel'),
  async execute(interaction: CommandInteraction) {
    if (!interaction.guild) {
      interaction.reply({ content: 'You are not currently in a voice channel!', ephemeral: true });
      return;
    }
    const voiceChannel = interaction.guild.members.cache
      .get(interaction.user.id)?.voice.channel;

    if (!voiceChannel) {
      interaction.reply({ content: 'You are not currently in a voice channel!', ephemeral: true });
      return;
    }
    let player = Players.get(interaction.guild.id);
    if (!player) {
      player = new Player(interaction.guild);
      Players.set(interaction.guild.id, player);
    }
    player.join(voiceChannel);
    interaction.reply({ content: `Joined ${voiceChannel.name}`, ephemeral: false });
  },
};
