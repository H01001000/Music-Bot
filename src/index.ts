import dotenv from 'dotenv';

import {
  Client, GatewayIntentBits, Partials,
} from 'discord.js';
import ytpl from 'ytpl';
import * as yt from 'youtube-search-without-api-key';
import commands from './commands';
import logger from './util/logger';
import Util from './util/Util';
import Players from './Players';
import Player from './util/Player';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
  ],
});

client.on('messageCreate', async (message) => {
  if (message.channel.id !== '881800101981462619') return;
  if (message.author.bot) return;
  const command = message.content.split(' ')[0].slice(1);
  if (command !== 'play') return;
  if (!message.guild) {
    await message.channel.send({ content: 'You are not currently in a voice channel!' });
    return;
  }
  const voiceChannel = message.guild.members.cache
    .get(message.author.id)?.voice.channel;

  if (!voiceChannel) {
    await message.channel.send({ content: 'You are not currently in a voice channel!' });
    return;
  }
  let player = Players.get(message.guild.id);
  if (!player) {
    player = new Player(message.guild);
    Players.set(message.guild.id, player);
  }

  const keyword = message.content.split(' ').slice(1).join(' ');

  const results = await yt.search(keyword);

  if (results.length !== 0) {
    const result = results[0];

    player.queue.push({
      url: result.url,
      title: result.title,
      thumbnailUrl: result.snippet.thumbnails.url,
      duration: { number: Util.toSec(result.duration_raw), string: result.duration_raw },
      requestor: message.author,
      begin: undefined,
      requestChannel: message.channel,
    });

    player.join(voiceChannel);
    const status = player.playMedia() ? 'Playing' : 'Queued';
    logger.log('info', `${message.author.username} at ${message.guild?.name} play ${result.title} url: ${result.url}`);
    await message.channel.send({ content: `${status} **${result.title}**\nUrl: ${result.url}` });
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
        requestor: message.author,
        requestChannel: message.channel,
      });
    }
    player.join(voiceChannel);
    const status = player.playMedia() ? 'Playing' : 'Queued';
    await message.channel.send({ content: `${status} playlist **${playlist.title}**\nUrl: ${playlist.url}` });
  } catch (error) {
    await message.channel.send({ content: `search failed keyword: ${keyword}` });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    try {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    } catch {
      await interaction.editReply({ content: 'There was an error while executing this command!' });
    }
  }
});

client.on('ready', () => {
  console.log('ready');
});

process.on('SIGINT', () => {
  client.destroy();
});

client.login(process.env.token);
