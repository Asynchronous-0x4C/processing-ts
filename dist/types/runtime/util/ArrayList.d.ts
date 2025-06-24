export declare class ArrayList {
    private items;
    constructor();
    add(item: any): void;
    get(index: number): any;
    size(): number;
    clear(): void;
    remove(arg: any): void;
    [Symbol.iterator](): {
        next(): {
            value: any;
            done: boolean;
        } | {
            done: boolean;
            value?: undefined;
        };
    };
}
