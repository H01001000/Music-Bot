import sinon, { SinonFakeTimers } from 'sinon';
import proxyquire from 'proxyquire';
import { assert } from 'chai';
import { AudioPlayerStatus } from '@discordjs/voice';
import { genId } from '../utils';
import Player from '../../src/structure/Player';
import logger from '../../src/util/logger';

describe('Player.ts', () => {
  let clock: SinonFakeTimers;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    sinon.stub(logger, 'error');
  });
  afterEach(() => {
    sinon.restore();
    clock.restore();
  });

  describe('on error', () => {
    it('will log error with logger', () => {
      sinon.restore();
      // @ts-expect-error
      const player = new Player({});
      const loggerStub = sinon.stub(logger, 'error');
      // @ts-expect-error
      // eslint-disable-next-line no-underscore-dangle
      player._nowPlaying = {
        // @ts-expect-error
        title: genId(), url: genId(), requestor: { id: genId() }, requestChannel: { send: () => { } },
      };
      const error = new Error(genId());
      player.player.emit('error', error);
      sinon.assert.calledOnce(loggerStub);
      // @ts-expect-error
      assert.include(loggerStub.firstCall.args[0], player.nowPlaying.title);
      // @ts-expect-error
      assert.include(loggerStub.firstCall.args[0], player.nowPlaying.url);
      // @ts-expect-error
      assert.include(loggerStub.firstCall.args[0], error.message);
    });
    it('will send error to where song request', () => {
      sinon.restore();
      // @ts-expect-error
      const player = new Player({});
      const sendStub = sinon.stub();
      sinon.stub(logger, 'error');
      // @ts-expect-error
      // eslint-disable-next-line no-underscore-dangle
      player._nowPlaying = {
        // @ts-expect-error
        title: genId(), url: genId(), requestor: { id: genId() }, requestChannel: { send: sendStub },
      };
      player.player.emit('error', new Error());
      sinon.assert.calledOnce(sendStub);
      assert.include(sendStub.firstCall.args[0].content, `<@${player.nowPlaying.requestor.id}>`);
      assert.include(sendStub.firstCall.args[0].content, player.nowPlaying.title);
      assert.include(sendStub.firstCall.args[0].content, 'error');
    });
    it('will send age restricted to where song request', () => {
      sinon.restore();
      // @ts-expect-error
      const player = new Player({});
      const sendStub = sinon.stub();
      sinon.stub(logger, 'error');
      // @ts-expect-error
      // eslint-disable-next-line no-underscore-dangle
      player._nowPlaying = {
        // @ts-expect-error
        title: genId(), url: genId(), requestor: { id: genId() }, requestChannel: { send: sendStub },
      };
      player.player.emit('error', new Error('Status code: 410'));
      sinon.assert.calledOnce(sendStub);
      assert.include(sendStub.firstCall.args[0].content, `<@${player.nowPlaying.requestor.id}>`);
      assert.include(sendStub.firstCall.args[0].content, player.nowPlaying.title);
      assert.include(sendStub.firstCall.args[0].content, 'age restricted');
    });
  });
  describe('on idle', () => {
    it('will play next song', () => {
      // @ts-expect-error
      const player = new Player({});
      sinon.stub(setTimeout);
      const playMediaStub = sinon.stub(player, 'playMedia');
      player.player.emit(AudioPlayerStatus.Idle);
      sinon.assert.calledOnce(playMediaStub);
    });
    it('will not start timeout when there is video', () => {
      // @ts-expect-error
      const player = new Player({});
      sinon.stub(player, 'playMedia').returns(true);
      player.player.emit(AudioPlayerStatus.Idle);
      // @ts-expect-error
      assert.isNull(player.timeout);
    });
    it('will start timeout when there is no video', () => {
      // @ts-expect-error
      const player = new Player({});
      sinon.stub(player, 'playMedia').returns(false);
      const disconnectStub = sinon.stub();
      // @ts-expect-error
      // eslint-disable-next-line no-underscore-dangle
      player._connection = { disconnect: disconnectStub };
      player.player.emit(AudioPlayerStatus.Idle);
      // @ts-expect-error
      assert.isNotNull(player.timeout);
      clock.tick(1000 * 60 * 5 - 1);
      sinon.assert.notCalled(disconnectStub);
      clock.tick(1);
      sinon.assert.calledOnce(disconnectStub);
    });
  });

  it.skip('can join and subscribe channel', () => {
    const subscribeStub = sinon.stub();
    const joinVoiceChannelStub = sinon.stub().returns({ subscribe: subscribeStub });

    const PlayerStub = proxyquire('../../src/structure/Player', {
      '@discordjs/voice': {
        joinVoiceChannel: joinVoiceChannelStub,
      },
    }).default;

    const dummyGuild = { id: genId(), voiceAdapterCreator: () => ({ sendPayload: () => { } }) };
    const dummyVoiceChannel = { id: genId() };

    const player = new PlayerStub(dummyGuild) as Player;

    // @ts-expect-error
    player.join(dummyVoiceChannel);

    sinon.assert.calledOnceWithExactly(joinVoiceChannelStub, { channelId: dummyVoiceChannel.id, guildId: dummyGuild.id, adapterCreator: dummyGuild.voiceAdapterCreator });
    sinon.assert.calledOnceWithExactly(subscribeStub, player.player);
  });

  it('can leave channel', () => {
    // @ts-expect-error
    const player = new Player({});

    const disconnectStub = sinon.stub();
    // @ts-expect-error
    // eslint-disable-next-line no-underscore-dangle
    player._connection = { disconnect: disconnectStub };

    player.leave();

    sinon.assert.calledOnceWithExactly(disconnectStub);
  });

  describe('playMedia', () => {
    it('will return false if no song in queue', () => {
      // @ts-expect-error
      const player = new Player({});

      sinon.stub(player.player, 'play');
      sinon.stub(player.queue, 'size').get(() => 0);

      assert.isFalse(player.playMedia());
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const statueKey in AudioPlayerStatus) {
      if (statueKey !== 'Idle') {
        it(`will return false if player is ${statueKey}`, () => {
          // @ts-expect-error
          const player = new Player({});

          sinon.stub(player.player, 'play');
          player.queue.push({ url: '' });
          sinon.stub(player.player.state, 'status').get(() => AudioPlayerStatus[statueKey]);

          assert.isFalse(player.playMedia());
        });
      }
    }

    it('will return true if player is idle', () => {
      // @ts-expect-error
      const player = new Player({});

      player.queue.push({ url: '' });
      sinon.stub(player.player.state, 'status').get(() => AudioPlayerStatus.Idle);

      assert.isTrue(player.playMedia());
    });

    it('will return true if skip is true and player is not idle', () => {
      // @ts-expect-error
      const player = new Player({});

      sinon.stub(player.player, 'play');
      player.queue.push({ url: '' });
      sinon.stub(player.player.state, 'status').get(() => AudioPlayerStatus.Playing);

      assert.isTrue(player.playMedia(true));
    });

    it('will clear timeout', () => {
      // @ts-expect-error
      const player = new Player({});

      sinon.stub(player.player, 'play');
      player.queue.push({ url: '' });
      sinon.stub(player.player.state, 'status').get(() => AudioPlayerStatus.Idle);

      // @ts-expect-error
      player.timeout = setTimeout(() => { }, 1);

      player.playMedia(false);

      // @ts-expect-error
      assert.isNull(player.timeout);
    });

    it('will set nowPlaying to song playing', () => {
      // @ts-expect-error
      const player = new Player({});

      sinon.stub(player.player, 'play');
      sinon.stub(player.player.state, 'status').get(() => AudioPlayerStatus.Idle);

      const song = { url: '' };
      player.queue.push(song);

      player.playMedia(false);

      assert.equal(player.nowPlaying, song);
    });

    it('will play player', () => {
      // @ts-expect-error
      const player = new Player({});

      const playerPlayStub = sinon.stub(player.player, 'play');
      player.queue.push({ url: '' });
      sinon.stub(player.player.state, 'status').get(() => AudioPlayerStatus.Idle);

      player.playMedia(false);

      sinon.assert.calledOnce(playerPlayStub);
    });
  });

  describe('skip', () => {
    it('can skip', () => {
      // @ts-expect-error
      const player = new Player({});
      const playMediaStub = sinon.stub(player, 'playMedia');

      player.skip();

      sinon.assert.calledOnceWithExactly(playMediaStub, true);
    });
    it('will pause if no next song', () => {
      // @ts-expect-error
      const player = new Player({});
      sinon.stub(player, 'playMedia').returns(false);
      const playerStub = sinon.stub(player.player, 'stop');

      player.skip();

      sinon.assert.calledOnce(playerStub);
    });
    it('will not pause if there is next song', () => {
      // @ts-expect-error
      const player = new Player({});
      sinon.stub(player, 'playMedia').returns(true);
      const playerStub = sinon.stub(player.player, 'stop');

      player.skip();

      sinon.assert.notCalled(playerStub);
    });
  });

  it('can unpause', () => {
    // @ts-expect-error
    const player = new Player({});
    const unpauseStub = sinon.stub(player.player, 'unpause');

    player.play();

    sinon.assert.calledOnce(unpauseStub);
  });

  it('can pause', () => {
    // @ts-expect-error
    const player = new Player({});
    const pauseStub = sinon.stub(player.player, 'pause');

    player.pause();

    sinon.assert.calledOnce(pauseStub);
  });

  it.skip('can get connection', () => {
    const PlayerStub = proxyquire('../../src/structure/Player', {
      '@discordjs/voice': {
        joinVoiceChannel: () => ({ subscribe: () => { } }),
      },
    }).default;

    const player = new PlayerStub({ id: genId(), voiceAdapterCreator: () => ({ sendPayload: () => { } }) }) as Player;

    // @ts-expect-error
    player.join({ id: genId() });

    // @ts-expect-error
    // eslint-disable-next-line no-underscore-dangle
    assert.deepEqual(player.connection, player._connection);
  });
});
