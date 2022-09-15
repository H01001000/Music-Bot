import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';
import {
  Channel, Guild, TextBasedChannel, User,
} from 'discord.js';
import ytdl, { Filter } from 'ytdl-core';
import logger from './logger';
import Queue from './Queue';

type Media = {
  title: string,
  thumbnailUrl: string,
  url: string,
  duration: {
    number: number
    string: string
  },
  requestor: User
  begin?: string
  requestChannel: TextBasedChannel | null
}

const ytdlOption = {
  filter: 'audioonly' as Filter, quality: 'highestaudio', highWaterMark: 1024 * 1024 * 700, dlChunkSize: 0,
};

export default class Player {
  constructor(guild: Guild) {
    this.guild = guild;
    this.queue = new Queue<Media>();
    this.player = createAudioPlayer();
    this.player.on(AudioPlayerStatus.Idle, () => {
      if (this.playMedia() === false) {
        this.timeout = setTimeout(() => {
          this._connection.disconnect();
        }, 1000 * 60 * 5);
      }
    });
    this.player.on('error', (error) => {
      logger.error(`Error when trying to play ${this._nowPlaying.title} url: ${this._nowPlaying.url} ${error}`);
      if (error.message === 'Status code: 410') {
        this._nowPlaying.requestChannel?.send({ content: `<@${this._nowPlaying.requestor.id}> the song "${this._nowPlaying.title}" cannot be play because of its age restricted.` });
        return;
      }
      this._nowPlaying.requestChannel?.send({ content: `<@${this._nowPlaying.requestor.id}> the song "${this._nowPlaying.title}" cannot be play because of an error.` });
    });
  }

  public readonly player;

  private readonly guild;

  private _connection: VoiceConnection;

  public readonly queue;

  private _nowPlaying: Media;

  private timeout: NodeJS.Timeout | null = null;

  join(VoiceChannel: Channel) {
    this._connection = joinVoiceChannel({
      channelId: VoiceChannel.id,
      guildId: this.guild.id,
      adapterCreator: this.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });
    this._connection.subscribe(this.player);
  }

  leave() {
    return this._connection.disconnect();
  }

  playMedia(skip = false): boolean {
    if (this.queue.size === 0) return false;
    if (this.player.state.status !== AudioPlayerStatus.Idle && !skip) return false;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    // @ts-expect-error
    this._nowPlaying = this.queue.pop();
    this.player.pause(true);

    this.player.play(createAudioResource(
      ytdl(
        this._nowPlaying.url,
        {
          ...ytdlOption,
          begin: this._nowPlaying.begin,
        },
      ),
    ));
    return true;
  }

  skip() {
    if (!this.playMedia(true)) this.player.stop();
  }

  play() {
    this.player.unpause();
  }

  pause() {
    this.player.pause();
  }

  get nowPlaying() {
    return this._nowPlaying;
  }

  get connection() {
    return this._connection;
  }
}
