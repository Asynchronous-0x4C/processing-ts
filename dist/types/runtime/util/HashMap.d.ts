export declare class HashMap<K, V> {
    private map;
    constructor(iterable?: Iterable<readonly [K, V]> | number | readonly (readonly [K, V])[] | null | undefined);
    containsKey(key: K): boolean;
    containsValue(value: V): boolean;
    get(key: K): V | undefined;
    getOrDefault(key: K, value: V): V;
    isEmpty(): boolean;
    keySet(): MapIterator<K>;
    put(key: K, value: V): void;
    putIfAbsent(key: K, value: V): void;
    remove(k: K, v?: V): void;
    size(): number;
    values(): MapIterator<V>;
}
