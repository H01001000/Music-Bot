import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import youtube from 'youtube-sr';
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

    const result = (await youtube.searchOne(keywordTransformer(keyword), 'video'));

    const beginOption = interaction.options.getString('begin-at');
    const begin = beginOption !== null ? toSec(beginOption) : 0;

    const durationInSec = toSec(result.durationFormatted as string);

    player.queue.push({
      url: result.url,
      title: result.title as string,
      thumbnailUrl: result.thumbnail?.url as string,
      duration: { number: begin === 0 ? durationInSec : durationInSec - begin, string: begin === 0 ? result.durationFormatted as string : toHHMMSS(durationInSec - begin) },
      requestor: interaction.user,
      requestChannel: interaction.channel,
      begin,
    });

    player.join(voiceChannel);
    logger.log('info', `${interaction.user.username} at ${guild.name} play ${result.title} url: ${result.url}`);
    await interaction.editReply({ content: `${player.playMedia() ? 'Playing' : 'Queued'} **${result.title}** ${begin !== 0 ? `begin at ${beginOption}` : ''} \nUrl: ${result.url} ` });
  },
};
