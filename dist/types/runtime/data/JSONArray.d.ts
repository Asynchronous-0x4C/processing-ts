import { JSONObject } from "./JSONObject";
export declare class JSONArray {
    json: JSON;
    constructor(json: JSON);
    static parse(str: string): JSONArray;
    isNull(index: number): boolean;
    toString(): string;
    getJSONArray(index: number, init: JSONArray): JSONArray;
    setJSONArray(index: number, val: JSONArray): this;
    getJSONObject(index: number): JSONObject;
    setJSONObject(index: number, val: JSONObject): this;
    getInt(index: number, init: number): number;
    setInt(index: number, val: number): this;
    toIntArray(): number[];
    getFloat(index: number, init: number): number;
    setFloat(index: number, val: number): this;
    toFloatArray(): number[];
    getString(index: number, init: string): string;
    setString(index: number, val: string): this;
    toStringArray(): string[];
    getBoolean(index: number, init: boolean): boolean;
    setBoolean(index: number, val: boolean): JSONArray;
    toBooleanArray(): boolean[];
    size(): number;
    append(val: number | string | boolean | JSONObject | JSONArray): JSONArray;
    remove(index: number): void;
}
