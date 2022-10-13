import { assert } from 'chai';
import { ChatInputCommandInteraction } from 'discord.js';
import sinon from 'sinon';
import resume from '../../src/commands/resume';
import { PreprocessingResult } from '../../src/util/utils';

describe('commands/resume.ts', () => {
  afterEach(() => {
    sinon.restore();
  });
  it('will resume if player is old', async () => {
    const playStub = sinon.stub();
    const replyStub = sinon.stub();
    resume.execute(
      { reply: replyStub } as unknown as ChatInputCommandInteraction,
      { newPlayer: false, player: { play: playStub } } as unknown as PreprocessingResult,
    );
    sinon.assert.calledOnce(playStub);
    sinon.assert.calledOnce(replyStub);
    assert.include(replyStub.firstCall.args[0].content, 'resume');
  });
  it('will not resume if player is new', async () => {
    const playStub = sinon.stub();
    const replyStub = sinon.stub();
    resume.execute(
      { reply: replyStub } as unknown as ChatInputCommandInteraction,
      { newPlayer: true, player: { play: playStub } } as unknown as PreprocessingResult,
    );
    sinon.assert.notCalled(playStub);
    sinon.assert.calledOnce(replyStub);
    assert.include(replyStub.firstCall.args[0].content, 'No music');
  });
});
