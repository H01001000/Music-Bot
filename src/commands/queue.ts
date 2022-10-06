import { AudioPlayerStatus } from '@discordjs/voice';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { interactionPreprocessing } from '../util/Util';

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Gets the current queued song list'),
  async execute(interaction: ChatInputCommandInteraction) {
    const { skip, player, newPlayer } = interactionPreprocessing(interaction);
    if (skip) return;
    if (newPlayer || player.player.state.status !== AudioPlayerStatus.Playing) {
      interaction.reply({ content: 'No music is playing', ephemeral: true });
      return;
    }
    const items = player.queue.toArray()
      .map((item, idx) => `${idx + 1}. Title: "${item.title}", Requested By: ${item.requestor}`);
    if (items.length > 0) {
      interaction.reply({ embeds: [new EmbedBuilder().setTitle('Current Playing Queue').setDescription(items.join('\n\n'))], ephemeral: true });
      return;
    }
    interaction.reply({ content: 'There are no songs in the queue.', ephemeral: false });
  },
};
