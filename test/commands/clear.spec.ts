import { assert } from 'chai';
import { ChatInputCommandInteraction } from 'discord.js';
import sinon from 'sinon';
import clear from '../../src/commands/clear';
import { PreprocessingResult } from '../../src/util/utils';

describe('commands/clear.ts', () => {
  afterEach(() => {
    sinon.restore();
  });
  it('will resume if player is old', async () => {
    const clearStub = sinon.stub();
    const replyStub = sinon.stub();
    clear.execute(
      { reply: replyStub } as unknown as ChatInputCommandInteraction,
      { newPlayer: false, player: { queue: { clear: clearStub } } } as unknown as PreprocessingResult,
    );
    sinon.assert.calledOnce(clearStub);
    sinon.assert.calledOnce(replyStub);
    assert.include(replyStub.firstCall.args[0].content, 'Cleared');
  });
});
