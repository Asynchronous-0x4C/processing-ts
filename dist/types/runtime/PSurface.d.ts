import { PApplet } from "./PApplet";
import { PImage } from "./PImage";
export declare class PSurface {
    readonly MIN_WINDOW_WIDTH = 128;
    readonly MIN_WINDOW_HEIGHT = 128;
    current_cursor: string;
    private applet;
    constructor(applet: PApplet);
    setCursor(...args: any[]): void;
    showCursor(): void;
    hideCursor(): void;
    setCursorStyle(arg: string | {
        image: PImage;
        x: number;
        y: number;
    }): void;
    setTitle(title: string): void;
}
