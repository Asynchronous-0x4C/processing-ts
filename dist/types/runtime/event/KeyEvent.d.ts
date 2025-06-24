import { Event } from "./Event";
export declare class KeyEvent implements Event {
    key: string;
    keyCode: number;
    modifiers: number;
    static PRESS: number;
    static RELEASE: number;
    static TYPE: number;
    constructor(key: string, keyCode: number, modifiers: number);
    getKeyCode(): number;
    getKey(): string;
}
