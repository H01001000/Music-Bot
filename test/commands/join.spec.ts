import { assert } from 'chai';
import { ChatInputCommandInteraction } from 'discord.js';
import sinon from 'sinon';
import join from '../../src/commands/join';
import { PreprocessingResult } from '../../src/util/utils';

describe('commands/join.ts', () => {
  afterEach(() => {
    sinon.restore();
  });
  it('will resume if player is old', async () => {
    const joinStub = sinon.stub();
    const replyStub = sinon.stub();
    const voiceChannel = { name: 'voiceChannel' };
    join.execute(
      { reply: replyStub } as unknown as ChatInputCommandInteraction,
      { newPlayer: false, player: { join: joinStub }, voiceChannel } as unknown as PreprocessingResult,
    );
    sinon.assert.calledOnceWithExactly(joinStub, voiceChannel);
    sinon.assert.calledOnce(replyStub);
    assert.include(replyStub.firstCall.args[0].content, 'Joined');
    assert.include(replyStub.firstCall.args[0].content, voiceChannel.name);
  });
});
