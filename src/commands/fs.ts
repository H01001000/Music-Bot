import skip from './skip';

export default {
  data: Object.assign(Object.create(Object.getPrototypeOf(skip.data)), skip.data).setName('fs'),
  execute: skip.execute,
};
