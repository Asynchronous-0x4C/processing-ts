import { JSONArray } from "./JSONArray";
export declare class JSONObject {
    json: JSON;
    constructor(source: JSON);
    static parse(str: string): JSONObject;
    hasKey(str: string): boolean;
    isNull(str: string): boolean;
    toString(): string;
    getInt(name: string, init: number): number;
    setInt(name: string, val: number): this;
    getFloat(name: string, init: number): number;
    setFloat(name: string, val: number): this;
    getString(name: string, init: string): string;
    setString(name: string, val: string): this;
    getBoolean(name: string, init: boolean): boolean;
    setBoolean(name: string, val: boolean): this;
    getJSONObject(name: string): JSONObject;
    setJSONObject(name: string, val: JSONObject): this;
    getJSONArray(name: string): JSONArray;
    setJSONArray(name: string, val: JSONArray): this;
    keys(): string[];
    remove(name: string): void;
}
