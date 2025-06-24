export class ArrayList{
  private items: any[];

  constructor() {
    this.items = [];
  }

  add(item: any): void {
    this.items.push(item);
  }

  get(index: number): any {
    return this.items[index];
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  remove(arg:any): void {
    if (typeof arg === "number") {
      if (arg >= 0 && arg < this.items.length) {
        this.items.splice(arg, 1);
      }
    } else {
      const index = this.items.indexOf(arg);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    }
  }

  [Symbol.iterator]() {
    let index = 0;
    const items = this.items;

    return {
      next() {
        if (index < items.length) {
          return { value: items[index++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
}