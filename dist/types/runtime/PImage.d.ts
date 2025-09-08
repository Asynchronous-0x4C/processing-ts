import { Texture } from "pixi.js";
import { PConstants } from "./PConstants";
import { PApplet } from "./PApplet";
export declare class PImage extends PConstants {
    texture: Texture | null;
    width: number;
    height: number;
    parent: PApplet;
    pixels: number[];
    __pixel_modified__: boolean;
    constructor(parent: PApplet, settings?: {
        pixels: number[];
        width: number;
        height: number;
        format: number;
    });
    load_from_arraybuffer(buffer: ArrayBuffer): Promise<void>;
    load_from_blob(blob: Blob): Promise<void>;
    loadPixels(): void;
    updatePixels(): void;
    get(x: number, y: number): number;
}
