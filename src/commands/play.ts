import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import * as yt from 'youtube-search-without-api-key';
import ytpl from 'ytpl';
import * as Util from '../util/Util';
import logger from '../util/logger';
import { interactionPreprocessing } from '../util/Util';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays the song with the given URL/Name')
    .addStringOption((option) => option.setName('keyword').setDescription('Name or url for the song you want to play').setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const {
      skip, voiceChannel, player, guild,
    } = interactionPreprocessing(interaction);
    if (skip) return;

    await interaction.deferReply();

    const keyword = interaction.options.getString('keyword', true);

    const results = await yt.search(keyword.includes('youtu.be') ? keyword : `https://www.youtube.com/watch?v=${keyword.split('/')[keyword.split('/').length - 1]}`);

    if (results.length !== 0) {
      const result = results[0];

      player.queue.push({
        url: result.url,
        title: result.title,
        thumbnailUrl: result.snippet.thumbnails.url,
        duration: { number: Util.toSec(result.duration_raw), string: result.duration_raw },
        requestor: interaction.user,
        requestChannel: interaction.channel,
      });

      player.join(voiceChannel);
      const status = player.playMedia() ? 'Playing' : 'Queued';
      logger.log('info', `${interaction.user.username} at ${guild.name} play ${result.title} url: ${result.url}`);
      await interaction.editReply({ content: `${status} **${result.title}**\nUrl: ${result.url}` });
      return;
    }

    try {
      const playlist = await ytpl(keyword);
      // eslint-disable-next-line no-restricted-syntax
      for (const item of playlist.items) {
        player.queue.push({
          url: item.url,
          title: item.title,
          thumbnailUrl: item.bestThumbnail.url ?? '',
          duration: { number: item.durationSec ?? 0, string: item.duration ?? '00:00' },
          requestor: interaction.user,
          requestChannel: interaction.channel,
        });
        logger.log('info', `${interaction.user.username} at ${guild.name} play ${item.title} url: ${item.url}`);
      }
      player.join(voiceChannel);
      const status = player.playMedia() ? 'Playing' : 'Queued';
      await interaction.editReply({ content: `${status} playlist **${playlist.title}**\nUrl: ${playlist.url}` });
    } catch (error) {
      await interaction.editReply({ content: `search failed keyword: ${keyword}` });
    }
  },
};
