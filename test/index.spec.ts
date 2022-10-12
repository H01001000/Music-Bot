import { assert } from 'chai';
import sinon from 'sinon';
import dotenv from 'dotenv';
import client from '../src/structure/client';
import { genId } from './utils';

describe('index.ts', () => {
  before(() => {
    import('../src/commands');
  });

  beforeEach(() => {
    // stub login for all test below since we tested
    sinon.stub(client, 'login');
  });

  afterEach(() => {
    client.removeAllListeners();
    sinon.restore();
  });

  it('will login discord with env variable "token"', async () => {
    sinon.restore();
    const stubClientLogin = sinon.stub(client, 'login');
    process.env.token = genId();

    await import(`../src/index.ts?v=${Date.now()}`);

    // only login once
    assert.isTrue(stubClientLogin.calledOnce);
    // login with token
    assert.deepEqual(stubClientLogin.args[0], [process.env.token]);
  });

  it('will call dotenv config', async () => {
    const stubDotenvConfig = sinon.stub(dotenv, 'config');
    await import(`../src/index.ts?v=${Date.now()}`);
    assert.isTrue(stubDotenvConfig.calledOnce);
  });

  it('will log ready when client ready', async () => {
    const stubConsoleLog = sinon.stub(console, 'log');

    await import(`../src/index.ts?v=${Date.now()}`);
    client.emit('ready', client);

    // console log ready
    assert.isTrue(stubConsoleLog.calledOnce);
    assert.deepEqual(stubConsoleLog.args[0], ['ready']);
  });
});
