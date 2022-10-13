import { ChatInputCommandInteraction, Guild, VoiceBasedChannel } from 'discord.js';
import Player from '../structure/Player';
import Players from '../structure/Players';

export function toHHMMSS(timeInSec: number | string) {
  const time = typeof timeInSec === 'number' ? timeInSec : parseInt(timeInSec, 10);
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time / 60) % 60;
  const seconds = time % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? `0${v}` : v))
    .join(':');
}

export function toSec(hhmmss: string) {
  const time = hhmmss.split(':');
  if (time.length === 3) return (+time[0]) * 60 * 60 + (+time[1]) * 60 + (+time[2]);
  if (time.length === 2) return (+time[0]) * 60 + (+time[1]);
  return (+time[0]);
}

export const keywordTransformer = (keyword: string) => {
  try {
    const url = new URL(keyword);
    if (url.hostname === 'www.youtube.com') {
      return new URL(keyword).searchParams.get('v') ?? keyword;
    }
    if (url.hostname === 'youtu.be') {
      return new URL(keyword).pathname.slice(1);
    }
    return keyword;
  } catch {
    return keyword;
  }
};

export function interactionPreprocessing(interaction: ChatInputCommandInteraction): {
  skip: true;
  voiceChannel: VoiceBasedChannel | null | undefined;
  player: Player | undefined;
  newPlayer: boolean | undefined;
  guild: undefined
} | {
  skip: false;
  voiceChannel: VoiceBasedChannel;
  player: Player;
  newPlayer: boolean;
  guild: Guild
} {
  if (!interaction.guild) {
    interaction.reply({ content: 'You are not currently in a guild!', ephemeral: true });
    return {
      skip: true, voiceChannel: undefined, player: undefined, newPlayer: undefined, guild: undefined,
    };
  }
  const voiceChannel = interaction.guild.members.cache
    .get(interaction.user.id)?.voice.channel;

  if (!voiceChannel) {
    interaction.reply({ content: 'You are not currently in a voice channel!', ephemeral: true });
    return {
      skip: true, voiceChannel, player: undefined, newPlayer: undefined, guild: undefined,
    };
  }
  let player = Players.get(interaction.guild.id);
  let newPlayer = false;
  if (!player) {
    newPlayer = true;
    player = new Player(interaction.guild);
    Players.set(interaction.guild.id, player);
  }
  return {
    skip: false, voiceChannel, player, newPlayer, guild: interaction.guild,
  };
}
