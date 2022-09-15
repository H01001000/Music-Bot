import nowPlaying from './now-playing';

export default {
  data: Object.assign(Object.create(Object.getPrototypeOf(nowPlaying.data)), nowPlaying.data).setName('np'),
  execute: nowPlaying.execute,
};
