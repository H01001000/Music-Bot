import { AudioPlayerStatus } from '@discordjs/voice';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import * as Util from '../util/Util';
import { interactionPreprocessing } from '../util/Util';

export default {
  data: new SlashCommandBuilder()
    .setName('now-playing')
    .setDescription('Gets information about the current song'),
  async execute(interaction: ChatInputCommandInteraction) {
    const { skip, player, newPlayer } = interactionPreprocessing(interaction);
    if (skip) return;
    if (newPlayer || player.player.state.status !== AudioPlayerStatus.Playing) {
      interaction.reply({ content: 'No music is playing', ephemeral: true });
      return;
    }
    const media = player.nowPlaying;
    const elapsed = Math.round(player.player.state.playbackDuration / 1000);
    const progress = Math.round((elapsed / media.duration.number) * 20) + 1;
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(media.title).setDescription(`${Util.toHHMMSS(elapsed)} / ${media.duration.string}\n[${'='.repeat(progress - 1)}>${'--'.repeat(19 - progress)}]`)] });
  },
};
