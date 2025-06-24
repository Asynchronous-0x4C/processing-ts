import { Event } from "./Event";
export declare class MouseEvent extends Event {
    x: number;
    y: number;
    button: number;
    count: number;
    constructor(x: number, y: number, button: number, count: number);
    getX(): number;
    getY(): number;
    getButton(): number;
    getCount(): number;
}
