import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayerStatus } from '@discordjs/voice';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Players from '../Players';
import Util from '../util/Util';

export default {
  data: new SlashCommandBuilder()
    .setName('now-playing')
    .setDescription('Gets information about the current song'),
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
    if (!player || player.player.state.status !== AudioPlayerStatus.Playing) {
      interaction.reply({ content: 'No music is playing', ephemeral: true });
      return;
    }
    const media = player.nowPlaying;
    const elapsed = Math.round(player.player.state.playbackDuration / 1000);
    const progress = Math.round((elapsed / media.duration.number) * 20) + 1;
    interaction.reply({ embeds: [new MessageEmbed().setTitle(media.title).setDescription(`${Util.toHHMMSS(elapsed)} / ${media.duration.string}\n[${'='.repeat(progress - 1)}>${'--'.repeat(19 - progress)}]`)] });
  },
};
