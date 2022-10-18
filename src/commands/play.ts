import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import yts from 'yt-search';
import logger from '../util/logger';
import {
  PreprocessingResult, keywordTransformer, toHHMMSS, toSec,
} from '../util/utils';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays the song with the given URL/Name')
    .addStringOption((option) => option.setName('keyword').setDescription('Name or url for the song you want to play').setRequired(true))
    .addStringOption((option) => option.setName('begin-at').setDescription('The beginning time in mm:ss format').setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction, preprocessingResult: PreprocessingResult) {
    const { voiceChannel, player, guild } = preprocessingResult;

    await interaction.deferReply();

    const keyword = interaction.options.getString('keyword', true);

    const result = (await yts(keywordTransformer(keyword))).videos[0];

    const beginOption = interaction.options.getString('begin-at');
    const begin = beginOption !== null ? toSec(beginOption) : 0;

    player.queue.push({
      url: result.url,
      title: result.title,
      thumbnailUrl: result.thumbnail,
      duration: { number: begin === 0 ? result.seconds : result.seconds - begin, string: begin === 0 ? result.timestamp : toHHMMSS(result.seconds - begin) },
      requestor: interaction.user,
      requestChannel: interaction.channel,
      begin,
    });

    player.join(voiceChannel);
    logger.log('info', `${interaction.user.username} at ${guild.name} play ${result.title} url: ${result.url}`);
    await interaction.editReply({ content: `${player.playMedia() ? 'Playing' : 'Queued'} **${result.title}**\nUrl: ${result.url}` });
  },
};
