export declare class ArrayList<T> extends Array<T> {
    constructor(c?: T[] | number);
    add(item: T): void;
    addAll(item: T[]): void;
    clear(): void;
    contains(v: T): boolean;
    get(index: number): T | null;
    isEmpty(): boolean;
    remove(arg: T | number): void;
    removeAll(a: T[]): void;
    set(index: number, element: T): void;
    size(): number;
    toArray(): T[];
}
