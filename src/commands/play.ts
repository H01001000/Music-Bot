import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import yts from 'yt-search';
import logger from '../util/logger';
import { interactionPreprocessing, keywordTransformer } from '../util/utils';

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

    const result = (await yts(keywordTransformer(keyword))).videos[0];

    player.queue.push({
      url: result.url,
      title: result.title,
      thumbnailUrl: result.thumbnail,
      duration: { number: result.seconds, string: result.timestamp },
      requestor: interaction.user,
      requestChannel: interaction.channel,
    });

    player.join(voiceChannel);
    logger.log('info', `${interaction.user.username} at ${guild.name} play ${result.title} url: ${result.url}`);
    await interaction.editReply({ content: `${player.playMedia() ? 'Playing' : 'Queued'} **${result.title}**\nUrl: ${result.url}` });
  },
};
