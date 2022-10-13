import { assert } from 'chai';
import { ChatInputCommandInteraction, Guild, VoiceChannel } from 'discord.js';
import sinon from 'sinon';
import Player from '../../src/structure/Player';
import Players from '../../src/structure/Players';
import {
  toSec, toHHMMSS, keywordTransformer, interactionPreprocessing,
} from '../../src/util/utils';
import { genId } from '../utils';

describe('utils.ts', () => {
  afterEach(() => {
    sinon.restore();
    Players.clear();
  });
  describe('toHHMMSS', () => {
    describe('with numbers', () => {
      it('can convert second to HHMMSS (with second)', () => {
        assert.equal(toHHMMSS(21), '00:00:21');
      });
      it('can convert hour to HHMMSS (with minute)', () => {
        assert.equal(toHHMMSS(1325), '00:22:05');
      });
      it('can convert second to HHMMSS (with hour)', () => {
        assert.equal(toHHMMSS(61315), '17:01:55');
      });
    });
    describe('with string', () => {
      it('can convert second to HHMMSS (with second)', () => {
        assert.equal(toHHMMSS('35'), '00:00:35');
      });
      it('can convert hour to HHMMSS (with minute)', () => {
        assert.equal(toHHMMSS('3214'), '00:53:34');
      });
      it('can convert second to HHMMSS (with hour)', () => {
        assert.equal(toHHMMSS('98743'), '27:25:43');
      });
    });
  });
  describe('toSec', () => {
    it('can convert HHMMSS to second (with second)', () => {
      assert.equal(toSec('21'), 21);
    });
    it('can convert HHMMSS to second (with minute)', () => {
      assert.equal(toSec('22:05'), 1325);
    });
    it('can convert HHMMSS to second (with hour)', () => {
      assert.equal(toSec('17:01:55'), 61315);
    });
  });
  describe('keywordTransformer', () => {
    it('can get video id from youtube.com link', () => {
      assert.equal(keywordTransformer('https://www.youtube.com/watch?v=56fwa641wa'), '56fwa641wa');
    });
    it('will return original link from youtube.com without "v" query', () => {
      assert.equal(keywordTransformer('https://www.youtube.com/watch/goiawhoi'), 'https://www.youtube.com/watch/goiawhoi');
    });
    it('can get video id from youtu.be link', () => {
      assert.equal(keywordTransformer('https://youtu.be/ag6w541g'), 'ag6w541g');
    });
    it('will return original link from non-youtube site', () => {
      assert.equal(keywordTransformer('https://gaw.gaw'), 'https://gaw.gaw');
    });
    it('will return original query if its not url', () => {
      assert.equal(keywordTransformer('aoiwhb wiand'), 'aoiwhb wiand');
    });
  });
  describe('interactionPreprocessing', () => {
    it('will reply and return skip true without guild', () => {
      const replyStub = sinon.stub();
      assert.deepEqual(interactionPreprocessing({ guild: null, reply: replyStub } as unknown as ChatInputCommandInteraction), {
        skip: true, voiceChannel: undefined, player: undefined, newPlayer: undefined, guild: undefined,
      });
      assert.deepEqual(replyStub.firstCall.args[0], { content: 'You are not currently in a guild!', ephemeral: true });
      sinon.assert.calledOnce(replyStub);
    });
    it('will reply and return skip true without in voice channel', () => {
      const replyStub = sinon.stub();
      const cacheGetStub = sinon.stub().callsFake(() => ({ voice: { channel: null } }));
      const id = genId();
      const guild = { members: { cache: { get: cacheGetStub } } } as unknown as Guild;
      assert.deepEqual(interactionPreprocessing({ guild, user: { id }, reply: replyStub } as unknown as ChatInputCommandInteraction), {
        skip: true, voiceChannel: undefined, player: undefined, newPlayer: undefined, guild,
      });
      assert.deepEqual(replyStub.firstCall.args[0], { content: 'You are not currently in a voice channel!', ephemeral: true });
      sinon.assert.calledOnce(replyStub);
      sinon.assert.alwaysCalledWithExactly(cacheGetStub, id);
    });
    it('will reply and return skip true without in voice channel', () => {
      const replyStub = sinon.stub();
      const channel = {} as VoiceChannel;
      const cacheGetStub = sinon.stub().callsFake(() => ({ voice: { channel } }));
      const id = genId();
      const guild = { id: genId(), members: { cache: { get: cacheGetStub } } } as unknown as Guild;
      assert.deepEqual(interactionPreprocessing({ guild, user: { id }, reply: replyStub } as unknown as ChatInputCommandInteraction), {
        skip: false, voiceChannel: channel, player: Players.get(guild.id), newPlayer: true, guild,
      });
      sinon.assert.notCalled(replyStub);
    });
    it('will reply and return skip true without in voice channel', () => {
      const replyStub = sinon.stub();
      const channel = {} as VoiceChannel;
      const cacheGetStub = sinon.stub().callsFake(() => ({ voice: { channel } }));
      const id = genId();
      const guild = { id: genId(), members: { cache: { get: cacheGetStub } } } as unknown as Guild;
      Players.set(guild.id, new Player(guild));
      assert.deepEqual(interactionPreprocessing({ guild, user: { id }, reply: replyStub } as unknown as ChatInputCommandInteraction), {
        skip: false, voiceChannel: channel, player: Players.get(guild.id), newPlayer: false, guild,
      });
      sinon.assert.notCalled(replyStub);
    });
  });
});
