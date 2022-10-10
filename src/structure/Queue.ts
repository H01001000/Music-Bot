export default class Queue<T> {
  constructor(size?: number) {
    this.maxSize = size;
  }

  private maxSize;

  private items: T[] = [];

  push(item: T) {
    if (this.maxSize && this.size >= this.maxSize) return;
    this.items.push(item);
  }

  pop() {
    return this.items.shift();
  }

  clear() {
    this.items = [];
  }

  toArray() {
    return Array.from(this.items);
  }

  remove(index: number) {
    this.items.splice(index, 1);
  }

  get size() {
    return this.items.length;
  }

  get empty() {
    return this.items.length === 0;
  }
}
