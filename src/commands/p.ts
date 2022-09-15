import play from './play';

export default {
  data: Object.assign(Object.create(Object.getPrototypeOf(play.data)), play.data).setName('p'),
  execute: play.execute,
};
