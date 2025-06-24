import { PApplet } from "./PApplet";
export declare class PSurface {
    readonly MIN_WINDOW_WIDTH = 128;
    readonly MIN_WINDOW_HEIGHT = 128;
    private applet;
    constructor(applet: PApplet);
    setCursor(...args: any[]): void;
    showCursor(): void;
    hideCursor(): void;
}
